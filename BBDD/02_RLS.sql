-- Habilitar RLS en la tabla `transactions`
ALTER TABLE fintrax.transactions ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo al propietario del proyecto
-- Esta política asegura que los usuarios solo puedan ver transacciones asociadas a proyectos que les pertenecen.
CREATE POLICY "user_can_access_own_transactions"
ON fintrax.transactions
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM fintrax.projects
        WHERE fintrax.projects.id = fintrax.transactions.project_id
        AND fintrax.projects.user_id = auth.uid()
    )
);

-- Política para permitir modificaciones solo al propietario
CREATE POLICY "user_can_modify_own_transactions"
ON fintrax.transactions
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM fintrax.projects
        WHERE fintrax.projects.id = fintrax.transactions.project_id
        AND fintrax.projects.user_id = auth.uid()
    )
);

-- Política para controlar quién puede insertar transacciones
CREATE POLICY "user_can_insert_own_transactions"
ON fintrax.transactions
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM fintrax.projects
        WHERE fintrax.projects.id = project_id
        AND fintrax.projects.user_id = auth.uid()
    )
);

-- Política para permitir eliminación solo a los proyectos asociados al usuario
CREATE POLICY "user_can_delete_own_transactions"
ON fintrax.transactions
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM fintrax.projects
        WHERE fintrax.projects.id = fintrax.transactions.project_id
        AND fintrax.projects.user_id = auth.uid()
    )
);

-- Habilitar RLS en la tabla `transactions_log`
ALTER TABLE fintrax.transactions_log ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo al propietario de la transacción
CREATE POLICY "user_can_access_own_transaction_logs"
ON fintrax.transactions_log
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM fintrax.transactions
        WHERE fintrax.transactions.id = fintrax.transactions_log.transaction_id
        AND EXISTS (
            SELECT 1 FROM fintrax.projects
            WHERE fintrax.projects.id = fintrax.transactions.project_id
            AND fintrax.projects.user_id = auth.uid()
        )
    )
);

-- Habilitar RLS en la tabla `projects`
ALTER TABLE fintrax.projects ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo al propietario del proyecto
CREATE POLICY "user_can_access_own_projects"
ON fintrax.projects
FOR SELECT USING (
    fintrax.projects.user_id = auth.uid()
);

-- Política para permitir modificaciones al proyecto solo al usuario correspondiente
CREATE POLICY "user_can_modify_own_projects"
ON fintrax.projects
FOR UPDATE USING (
    fintrax.projects.user_id = auth.uid()
);

-- Política para permitir eliminar el proyecto solo al usuario correspondiente
CREATE POLICY "user_can_delete_own_projects"
ON fintrax.projects
FOR DELETE USING (
    fintrax.projects.user_id = auth.uid()
);

-- Habilitar RLS en la tabla `reports`
ALTER TABLE fintrax.reports ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo al propietario del reporte
CREATE POLICY "user_can_access_own_reports"
ON fintrax.reports
FOR SELECT USING (
    fintrax.reports.user_id = auth.uid()
);

-- Política para permitir inserción de reportes solo al usuario correspondiente
CREATE POLICY "user_can_insert_own_reports"
ON fintrax.reports
FOR INSERT WITH CHECK (
    fintrax.reports.user_id = auth.uid()
);

-- Habilitar RLS en la tabla `notifications`
ALTER TABLE fintrax.notifications ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo a las notificaciones del usuario
CREATE POLICY "user_can_access_own_notifications"
ON fintrax.notifications
FOR SELECT USING (
    fintrax.notifications.user_id = auth.uid()
);

-- Política para permitir modificaciones solo a las notificaciones del usuario
CREATE POLICY "user_can_modify_own_notifications"
ON fintrax.notifications
FOR UPDATE USING (
    fintrax.notifications.user_id = auth.uid()
);

-- Habilitar RLS en la tabla `attachments`
ALTER TABLE fintrax.attachments ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo a los archivos de proyectos o transacciones del usuario
CREATE POLICY "user_can_access_own_attachments"
ON fintrax.attachments
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM fintrax.projects
        WHERE fintrax.projects.id = fintrax.attachments.project_id
        AND fintrax.projects.user_id = auth.uid()
    )
);

-- Política para insertar archivos adjuntos solo en proyectos propios
CREATE POLICY "user_can_insert_own_attachments"
ON fintrax.attachments
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM fintrax.projects
        WHERE fintrax.projects.id = project_id
        AND fintrax.projects.user_id = auth.uid()
    )
);

-- Política para modificar archivos adjuntos solo en proyectos propios
CREATE POLICY "user_can_modify_own_attachments"
ON fintrax.attachments
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM fintrax.projects
        WHERE fintrax.projects.id = fintrax.attachments.project_id
        AND fintrax.projects.user_id = auth.uid()
    )
);

-- Política para eliminar archivos adjuntos solo en proyectos propios
CREATE POLICY "user_can_delete_own_attachments"
ON fintrax.attachments
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM fintrax.projects
        WHERE fintrax.projects.id = fintrax.attachments.project_id
        AND fintrax.projects.user_id = auth.uid()
    )
);

-- Habilitar RLS en la tabla `access_logs`
ALTER TABLE fintrax.access_logs ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo a los registros del usuario
CREATE POLICY "user_can_access_own_access_logs"
ON fintrax.access_logs
FOR SELECT USING (
    fintrax.access_logs.user_id = auth.uid()
);