-- Trigger para registrar cambios en transacciones en la tabla `transactions_log`
CREATE OR REPLACE FUNCTION fintrax.log_transaction_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO fintrax.transactions_log (transaction_id, user_id, change_type, old_values, new_values, reason, created_at)
        VALUES (OLD.id, auth.uid(), 'update', row_to_json(OLD), row_to_json(NEW), NULL, NOW());
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO fintrax.transactions_log (transaction_id, user_id, change_type, old_values, new_values, reason, created_at)
        VALUES (OLD.id, auth.uid(), 'delete', row_to_json(OLD), NULL, OLD.deletion_reason, NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_changes_trigger
AFTER UPDATE OR DELETE ON fintrax.transactions
FOR EACH ROW EXECUTE FUNCTION fintrax.log_transaction_changes();

-- Trigger para actualizar el número de adjuntos en la tabla `projects`
CREATE OR REPLACE FUNCTION fintrax.update_attachment_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE fintrax.projects
    SET attachment_count = (
        SELECT COUNT(*)
        FROM fintrax.attachments
        WHERE project_id = NEW.project_id
    )
    WHERE id = NEW.project_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_attachment_count_trigger
AFTER INSERT OR DELETE ON fintrax.attachments
FOR EACH ROW EXECUTE FUNCTION fintrax.update_attachment_count();

-- Trigger para registrar el último inicio de sesión en la tabla `user_profiles`
CREATE OR REPLACE FUNCTION fintrax.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE fintrax.user_profiles
    SET last_login = NOW()
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_last_login_trigger
AFTER INSERT ON fintrax.access_logs
FOR EACH ROW
WHEN (NEW.action = 'login')
EXECUTE FUNCTION fintrax.update_last_login();

-- Trigger para validar que las transacciones no excedan el presupuesto del proyecto
CREATE OR REPLACE FUNCTION fintrax.validate_transaction_budget()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.type = 'egreso') THEN
        IF (
            (SELECT COALESCE(SUM(amount), 0) FROM fintrax.transactions WHERE project_id = NEW.project_id AND type = 'egreso' AND deleted_at IS NULL) + NEW.amount >
            (SELECT budget FROM fintrax.projects WHERE id = NEW.project_id)
        ) THEN
            RAISE EXCEPTION 'El egreso excede el presupuesto del proyecto.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_transaction_budget_trigger
BEFORE INSERT OR UPDATE ON fintrax.transactions
FOR EACH ROW EXECUTE FUNCTION fintrax.validate_transaction_budget();

-- Trigger para registrar cambios en la tabla `categories` (auditoría opcional)
CREATE OR REPLACE FUNCTION fintrax.log_category_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO fintrax.categories_log (category_id, old_values, new_values, changed_at)
    VALUES (OLD.id, row_to_json(OLD), row_to_json(NEW), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER category_changes_trigger
AFTER UPDATE ON fintrax.categories
FOR EACH ROW EXECUTE FUNCTION fintrax.log_category_changes();

-- Trigger para actualizar el balance del proyecto
CREATE OR REPLACE FUNCTION fintrax.update_project_balance()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE fintrax.projects
    SET budget = (
        SELECT COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE -amount END), 0)
        FROM fintrax.transactions
        WHERE project_id = NEW.project_id AND deleted_at IS NULL
    )
    WHERE id = NEW.project_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_balance_trigger
AFTER INSERT OR UPDATE OR DELETE ON fintrax.transactions
FOR EACH ROW EXECUTE FUNCTION fintrax.update_project_balance();

-- Trigger para validar duplicados en transacciones
CREATE OR REPLACE FUNCTION fintrax.prevent_duplicate_transactions()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM fintrax.transactions
        WHERE project_id = NEW.project_id
          AND amount = NEW.amount
          AND date = NEW.date
          AND description = NEW.description
          AND deleted_at IS NULL
    ) THEN
        RAISE EXCEPTION 'Transacción duplicada detectada.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_duplicate_transactions_trigger
BEFORE INSERT ON fintrax.transactions
FOR EACH ROW EXECUTE FUNCTION fintrax.prevent_duplicate_transactions();

-- Trigger para registrar cambios en reports
CREATE OR REPLACE FUNCTION fintrax.log_report_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO fintrax.reports_log (report_id, old_values, new_values, changed_at)
    VALUES (OLD.id, row_to_json(OLD), row_to_json(NEW), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER report_changes_trigger
AFTER UPDATE ON fintrax.reports
FOR EACH ROW EXECUTE FUNCTION fintrax.log_report_changes();

-- Trigger para marcar notificaciones como expiradas
CREATE OR REPLACE FUNCTION fintrax.expire_notifications()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE fintrax.notifications
    SET read = TRUE
    WHERE expiration_date < NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expire_notifications_trigger
AFTER INSERT OR UPDATE ON fintrax.notifications
FOR EACH ROW EXECUTE FUNCTION fintrax.expire_notifications();

-- Trigger para actualizar el estado del proyecto
CREATE OR REPLACE FUNCTION fintrax.archive_project_if_expired()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.deadline IS NOT NULL AND NEW.deadline < NOW()) THEN
        UPDATE fintrax.projects
        SET status = 'archivado'
        WHERE id = NEW.id AND NOT EXISTS (
            SELECT 1 FROM fintrax.transactions
            WHERE project_id = NEW.id AND deleted_at IS NULL
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER archive_project_if_expired_trigger
AFTER UPDATE ON fintrax.projects
FOR EACH ROW EXECUTE FUNCTION fintrax.archive_project_if_expired();

-- Trigger para validar categorías jerárquicas
CREATE OR REPLACE FUNCTION fintrax.validate_category_hierarchy()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.parent_id = NEW.id) THEN
        RAISE EXCEPTION 'Una categoría no puede ser su propio padre.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_category_hierarchy_trigger
BEFORE INSERT OR UPDATE ON fintrax.categories
FOR EACH ROW EXECUTE FUNCTION fintrax.validate_category_hierarchy();

-- Trigger para registrar cambios en user_profiles
CREATE OR REPLACE FUNCTION fintrax.log_user_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO fintrax.user_profiles_log (user_id, old_values, new_values, changed_at)
    VALUES (OLD.user_id, row_to_json(OLD), row_to_json(NEW), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profile_changes_trigger
AFTER UPDATE ON fintrax.user_profiles
FOR EACH ROW EXECUTE FUNCTION fintrax.log_user_profile_changes();

-- Trigger para validar adjuntos
CREATE OR REPLACE FUNCTION fintrax.validate_attachment_relationship()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.project_id IS NULL AND NEW.transaction_id IS NULL) THEN
        RAISE EXCEPTION 'El adjunto debe estar relacionado con un proyecto o una transacción.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_attachment_relationship_trigger
BEFORE INSERT ON fintrax.attachments
FOR EACH ROW EXECUTE FUNCTION fintrax.validate_attachment_relationship();

-- Trigger para actualizar el estado de las transacciones eliminadas
CREATE OR REPLACE FUNCTION fintrax.log_soft_delete_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.deleted_at IS NOT NULL) THEN
        INSERT INTO fintrax.transactions_log (transaction_id, user_id, change_type, old_values, reason, created_at)
        VALUES (NEW.id, auth.uid(), 'delete', row_to_json(OLD), NEW.deletion_reason, NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_soft_delete_transaction_trigger
AFTER UPDATE ON fintrax.transactions
FOR EACH ROW
WHEN (NEW.deleted_at IS NOT NULL)
EXECUTE FUNCTION fintrax.log_soft_delete_transaction();

-- Trigger para validar el formato de los adjuntos
CREATE OR REPLACE FUNCTION fintrax.validate_attachment_format()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT (NEW.file_type IN ('pdf', 'jpg', 'png')) THEN
        RAISE EXCEPTION 'Formato de archivo no válido.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_attachment_format_trigger
BEFORE INSERT ON fintrax.attachments
FOR EACH ROW EXECUTE FUNCTION fintrax.validate_attachment_format();

-- Trigger para registrar accesos fallidos
CREATE OR REPLACE FUNCTION fintrax.log_failed_access()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO fintrax.access_logs (user_id, accessed_at, ip_address, user_agent, action)
    VALUES (NULL, NOW(), NEW.ip_address, NEW.user_agent, 'failed_login');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_failed_access_trigger
AFTER INSERT ON fintrax.failed_logins
FOR EACH ROW EXECUTE FUNCTION fintrax.log_failed_access();