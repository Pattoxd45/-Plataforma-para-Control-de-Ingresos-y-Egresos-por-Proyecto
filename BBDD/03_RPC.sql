-- Función para calcular el balance de un proyecto
CREATE OR REPLACE FUNCTION public.calculate_project_balance(project_id UUID)
RETURNS NUMERIC AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE -amount END), 0)
        FROM public.transactions
        WHERE project_id = project_id AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Función para obtener transacciones filtradas
CREATE OR REPLACE FUNCTION public.get_filtered_transactions(
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
    FROM public.transactions
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
CREATE OR REPLACE FUNCTION public.log_user_action(user_id UUID, action TEXT, ip_address TEXT, user_agent TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.access_logs (user_id, accessed_at, ip_address, user_agent, action)
    VALUES (user_id, NOW(), ip_address, user_agent, action);
END;
$$ LANGUAGE plpgsql;

-- Función para generar un reporte financiero
CREATE OR REPLACE FUNCTION public.generate_financial_report(
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
        FROM public.transactions
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
CREATE OR REPLACE FUNCTION public.mark_notifications_as_read(user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.notifications
    SET read = TRUE
    WHERE user_id = user_id AND read = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de un proyecto
CREATE OR REPLACE FUNCTION public.get_project_statistics(project_id UUID)
RETURNS JSONB AS $$
BEGIN
    RETURN jsonb_build_object(
        'total_ingresos', (
            SELECT COALESCE(SUM(amount), 0)
            FROM public.transactions
            WHERE project_id = project_id AND type = 'ingreso' AND deleted_at IS NULL
        ),
        'total_egresos', (
            SELECT COALESCE(SUM(amount), 0)
            FROM public.transactions
            WHERE project_id = project_id AND type = 'egreso' AND deleted_at IS NULL
        ),
        'balance', (
            SELECT COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE -amount END), 0)
            FROM public.transactions
            WHERE project_id = project_id AND deleted_at IS NULL
        )
    );
END;
$$ LANGUAGE plpgsql;

--  Función para obtener el historial de cambios de una transacción
CREATE OR REPLACE FUNCTION public.get_transaction_history(transaction_id UUID)
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
    FROM public.transactions_log
    WHERE transaction_id = transaction_id
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener notificaciones activas
CREATE OR REPLACE FUNCTION public.get_active_notifications(user_id UUID)
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
    FROM public.notifications
    WHERE user_id = user_id AND read = FALSE AND (expiration_date IS NULL OR expiration_date > NOW());
END;
$$ LANGUAGE plpgsql;

-- Función para obtener un resumen financiero consolidado
CREATE OR REPLACE FUNCTION public.get_user_financial_summary(user_id UUID)
RETURNS JSONB AS $$
BEGIN
    RETURN jsonb_agg(
        jsonb_build_object(
            'project_id', id,
            'project_name', name,
            'total_ingresos', (
                SELECT COALESCE(SUM(amount), 0)
                FROM public.transactions
                WHERE project_id = public.projects.id AND type = 'ingreso' AND deleted_at IS NULL
            ),
            'total_egresos', (
                SELECT COALESCE(SUM(amount), 0)
                FROM public.transactions
                WHERE project_id = public.projects.id AND type = 'egreso' AND deleted_at IS NULL
            ),
            'balance', (
                SELECT COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE -amount END), 0)
                FROM public.transactions
                WHERE project_id = public.projects.id AND deleted_at IS NULL
            )
        )
    )
    FROM public.projects
    WHERE user_id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar transacciones de forma lógica
CREATE OR REPLACE FUNCTION public.soft_delete_transaction(transaction_id UUID, reason TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.transactions
    SET deleted_at = NOW(), deletion_reason = reason
    WHERE id = transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener adjuntos de un proyecto
CREATE OR REPLACE FUNCTION public.get_project_attachments(project_id UUID)
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
    FROM public.attachments
    WHERE project_id = project_id;
END;
$$ LANGUAGE plpgsql;


-- Funciones utiles quizas debamos limpiar funciones de arriba
-- Función para crear un nuevo proyecto
CREATE OR REPLACE FUNCTION public.create_project(
    p_user_id UUID,
    p_name TEXT,
    p_description TEXT,
    p_budget NUMERIC,
    p_deadline TIMESTAMPTZ,
    p_status TEXT DEFAULT 'activo'
)
RETURNS UUID AS $$
DECLARE
    new_project_id UUID;
BEGIN
    INSERT INTO public.projects (user_id, name, description, budget, deadline, status)
    VALUES (p_user_id, p_name, p_description, p_budget, p_deadline, p_status)
    RETURNING id INTO new_project_id;

    RETURN new_project_id;
END;
$$ LANGUAGE plpgsql;


-- Editar un proyecto
DROP FUNCTION IF EXISTS public.update_project(UUID, UUID, TEXT, TEXT, NUMERIC, TIMESTAMPTZ, TEXT);

CREATE OR REPLACE FUNCTION public.update_project(
    p_project_id UUID,
    p_user_id UUID,
    p_name TEXT,
    p_description TEXT,
    p_budget NUMERIC,
    p_deadline TIMESTAMPTZ,
    p_status TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.projects
    SET
        name = COALESCE(p_name, name),
        description = COALESCE(p_description, description),
        budget = COALESCE(p_budget, budget),
        deadline = COALESCE(p_deadline, deadline),
        status = COALESCE(p_status, status)
    WHERE id = p_project_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;


-- Función para eliminar (soft-delete) un proyecto seleccionado por el usuario
CREATE OR REPLACE FUNCTION public.soft_delete_project(
    p_project_id UUID,
    p_user_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Solo permite eliminar proyectos donde el usuario es propietario
    UPDATE public.projects
    SET status = 'archivado'
    WHERE id = p_project_id
      AND user_id = p_user_id;

    -- Opcional: también puedes marcar las transacciones asociadas como eliminadas lógicamente
    UPDATE public.transactions
    SET deleted_at = NOW(), deletion_reason = COALESCE(p_reason, 'Proyecto archivado')
    WHERE project_id = p_project_id
      AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Función para agregar un egreso a un proyecto
CREATE OR REPLACE FUNCTION public.add_egreso(
    p_project_id UUID,
    p_amount NUMERIC,
    p_date TIMESTAMPTZ,
    p_description TEXT,
    p_category TEXT DEFAULT NULL,
    p_currency TEXT DEFAULT 'CLP',
    p_payment_method TEXT DEFAULT 'efectivo',
    p_tags TEXT[] DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_transaction_id UUID;
BEGIN
    INSERT INTO public.transactions (
        project_id,
        amount,
        date,
        description,
        category,
        type,
        currency,
        payment_method,
        tags
    )
    VALUES (
        p_project_id,
        p_amount,
        p_date,
        p_description,
        p_category,
        'egreso',
        p_currency,
        p_payment_method,
        p_tags
    )
    RETURNING id INTO new_transaction_id;

    RETURN new_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Función para editar un egreso existente de un proyecto
CREATE OR REPLACE FUNCTION public.edit_egreso(
    p_transaction_id UUID,
    p_project_id UUID,
    p_amount NUMERIC,
    p_date TIMESTAMPTZ,
    p_description TEXT,
    p_category TEXT DEFAULT NULL,
    p_currency TEXT DEFAULT 'CLP',
    p_payment_method TEXT DEFAULT 'efectivo',
    p_tags TEXT[] DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.transactions
    SET
        amount = COALESCE(p_amount, amount),
        date = COALESCE(p_date, date),
        description = COALESCE(p_description, description),
        category = COALESCE(p_category, category),
        currency = COALESCE(p_currency, currency),
        payment_method = COALESCE(p_payment_method, payment_method),
        tags = COALESCE(p_tags, tags)
    WHERE id = p_transaction_id
      AND project_id = p_project_id
      AND type = 'egreso'
      AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;


-- Función para editar un ingreso existente de un proyecto
CREATE OR REPLACE FUNCTION public.edit_ingreso(
    p_transaction_id UUID,
    p_project_id UUID,
    p_amount NUMERIC,
    p_date TIMESTAMPTZ,
    p_description TEXT,
    p_category TEXT DEFAULT NULL,
    p_currency TEXT DEFAULT 'CLP',
    p_payment_method TEXT DEFAULT 'efectivo',
    p_tags TEXT[] DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.transactions
    SET
        amount = COALESCE(p_amount, amount),
        date = COALESCE(p_date, date),
        description = COALESCE(p_description, description),
        category = COALESCE(p_category, category),
        currency = COALESCE(p_currency, currency),
        payment_method = COALESCE(p_payment_method, payment_method),
        tags = COALESCE(p_tags, tags)
    WHERE id = p_transaction_id
      AND project_id = p_project_id
      AND type = 'ingreso'
      AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.increase_project_budget(
    p_project_id UUID,
    p_amount NUMERIC,
    p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
    -- Registrar el aumento en la nueva tabla
    INSERT INTO public.project_budget_increases (project_id, amount, user_id)
    VALUES (p_project_id, p_amount, p_user_id);

    -- Actualizar el balance actual del proyecto
    UPDATE public.projects
    SET current_balance = current_balance + p_amount
    WHERE id = p_project_id;
END;
$$ LANGUAGE plpgsql;