-- Función para calcular el balance de un proyecto
CREATE OR REPLACE FUNCTION fintrax.calculate_project_balance(project_id UUID)
RETURNS NUMERIC AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE -amount END), 0)
        FROM fintrax.transactions
        WHERE project_id = project_id AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Función para obtener transacciones filtradas
CREATE OR REPLACE FUNCTION fintrax.get_filtered_transactions(
    project_id UUID,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    filter_category TEXT,
    min_amount NUMERIC,
    max_amount NUMERIC
)
RETURNS TABLE (
    id UUID,
    amount NUMERIC,
    date TIMESTAMPTZ,
    description TEXT,
    category TEXT,
    type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT id, amount, date, description, category, type
    FROM fintrax.transactions
    WHERE project_id = project_id
      AND (start_date IS NULL OR date >= start_date)
      AND (end_date IS NULL OR date <= end_date)
      AND (filter_category IS NULL OR category = filter_category)
      AND (min_amount IS NULL OR amount >= min_amount)
      AND (max_amount IS NULL OR amount <= max_amount)
      AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar actividad en access_logs
CREATE OR REPLACE FUNCTION fintrax.log_user_action(user_id UUID, action TEXT, ip_address TEXT, user_agent TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO fintrax.access_logs (user_id, accessed_at, ip_address, user_agent, action)
    VALUES (user_id, NOW(), ip_address, user_agent, action);
END;
$$ LANGUAGE plpgsql;

-- Función para generar un reporte financiero
CREATE OR REPLACE FUNCTION fintrax.generate_financial_report(
    project_id UUID,
    report_type TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS JSONB AS $$
DECLARE
    report_data JSONB;
BEGIN
    IF report_type = 'balance' THEN
        SELECT jsonb_agg(jsonb_build_object(
            'date', date,
            'type', type,
            'amount', amount,
            'description', description
        )) INTO report_data
        FROM fintrax.transactions
        WHERE project_id = project_id
          AND date BETWEEN start_date AND end_date
          AND deleted_at IS NULL;
    ELSE
        RAISE EXCEPTION 'Tipo de reporte no soportado.';
    END IF;

    RETURN report_data;
END;
$$ LANGUAGE plpgsql;

-- Función para marcar notificaciones como leídas
CREATE OR REPLACE FUNCTION fintrax.mark_notifications_as_read(user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE fintrax.notifications
    SET read = TRUE
    WHERE user_id = user_id AND read = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de un proyecto
CREATE OR REPLACE FUNCTION fintrax.get_project_statistics(project_id UUID)
RETURNS JSONB AS $$
BEGIN
    RETURN jsonb_build_object(
        'total_ingresos', (
            SELECT COALESCE(SUM(amount), 0)
            FROM fintrax.transactions
            WHERE project_id = project_id AND type = 'ingreso' AND deleted_at IS NULL
        ),
        'total_egresos', (
            SELECT COALESCE(SUM(amount), 0)
            FROM fintrax.transactions
            WHERE project_id = project_id AND type = 'egreso' AND deleted_at IS NULL
        ),
        'balance', (
            SELECT COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE -amount END), 0)
            FROM fintrax.transactions
            WHERE project_id = project_id AND deleted_at IS NULL
        )
    );
END;
$$ LANGUAGE plpgsql;

--  Función para obtener el historial de cambios de una transacción
CREATE OR REPLACE FUNCTION fintrax.get_transaction_history(transaction_id UUID)
RETURNS TABLE (
    change_type TEXT,
    old_values JSONB,
    new_values JSONB,
    reason TEXT,
    changed_by UUID,
    changed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT change_type, old_values, new_values, reason, user_id, created_at
    FROM fintrax.transactions_log
    WHERE transaction_id = transaction_id
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener notificaciones activas
CREATE OR REPLACE FUNCTION fintrax.get_active_notifications(user_id UUID)
RETURNS TABLE (
    id UUID,
    message TEXT,
    type TEXT,
    priority TEXT,
    expiration_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT id, message, type, priority, expiration_date, created_at
    FROM fintrax.notifications
    WHERE user_id = user_id AND read = FALSE AND (expiration_date IS NULL OR expiration_date > NOW());
END;
$$ LANGUAGE plpgsql;

-- Función para obtener un resumen financiero consolidado
CREATE OR REPLACE FUNCTION fintrax.get_user_financial_summary(user_id UUID)
RETURNS JSONB AS $$
BEGIN
    RETURN jsonb_agg(
        jsonb_build_object(
            'project_id', id,
            'project_name', name,
            'total_ingresos', (
                SELECT COALESCE(SUM(amount), 0)
                FROM fintrax.transactions
                WHERE project_id = fintrax.projects.id AND type = 'ingreso' AND deleted_at IS NULL
            ),
            'total_egresos', (
                SELECT COALESCE(SUM(amount), 0)
                FROM fintrax.transactions
                WHERE project_id = fintrax.projects.id AND type = 'egreso' AND deleted_at IS NULL
            ),
            'balance', (
                SELECT COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE -amount END), 0)
                FROM fintrax.transactions
                WHERE project_id = fintrax.projects.id AND deleted_at IS NULL
            )
        )
    )
    FROM fintrax.projects
    WHERE user_id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar transacciones de forma lógica
CREATE OR REPLACE FUNCTION fintrax.soft_delete_transaction(transaction_id UUID, reason TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE fintrax.transactions
    SET deleted_at = NOW(), deletion_reason = reason
    WHERE id = transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener adjuntos de un proyecto
CREATE OR REPLACE FUNCTION fintrax.get_project_attachments(project_id UUID)
RETURNS TABLE (
    id UUID,
    file_name TEXT,
    file_url TEXT,
    file_type TEXT,
    uploaded_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT id, file_name, file_url, file_type, uploaded_at
    FROM fintrax.attachments
    WHERE project_id = project_id;
END;
$$ LANGUAGE plpgsql;
