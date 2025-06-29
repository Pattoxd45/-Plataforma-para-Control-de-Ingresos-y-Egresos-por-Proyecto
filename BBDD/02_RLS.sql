-- Habilitar RLS en la tabla `transactions`
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo al propietario del proyecto
-- Esta política asegura que los usuarios solo puedan ver transacciones asociadas a proyectos que les pertenecen.
CREATE POLICY "user_can_access_own_transactions"
ON public.transactions
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = public.transactions.project_id
        AND public.projects.user_id = auth.uid()
    )
);

-- Política para permitir modificaciones solo al propietario
CREATE POLICY "user_can_modify_own_transactions"
ON public.transactions
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = public.transactions.project_id
        AND public.projects.user_id = auth.uid()
    )
);

-- Política para controlar quién puede insertar transacciones
CREATE POLICY "user_can_insert_own_transactions"
ON public.transactions
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = project_id
        AND public.projects.user_id = auth.uid()
    )
);

-- Política para permitir eliminación solo a los proyectos asociados al usuario
CREATE POLICY "user_can_delete_own_transactions"
ON public.transactions
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = public.transactions.project_id
        AND public.projects.user_id = auth.uid()
    )
);

-- Habilitar RLS en la tabla `transactions_log`
ALTER TABLE public.transactions_log ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo al propietario de la transacción
CREATE POLICY "user_can_access_own_transaction_logs"
ON public.transactions_log
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.transactions
        WHERE public.transactions.id = public.transactions_log.transaction_id
        AND EXISTS (
            SELECT 1 FROM public.projects
            WHERE public.projects.id = public.transactions.project_id
            AND public.projects.user_id = auth.uid()
        )
    )
);

-- Habilitar RLS en la tabla `projects`
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo al propietario del proyecto
CREATE POLICY "user_can_access_own_projects"
ON public.projects
FOR SELECT USING (
    public.projects.user_id = auth.uid()
);

-- Política para permitir modificaciones al proyecto solo al usuario correspondiente
CREATE POLICY "user_can_modify_own_projects"
ON public.projects
FOR UPDATE USING (
    public.projects.user_id = auth.uid()
);

-- Política para permitir eliminar el proyecto solo al usuario correspondiente
CREATE POLICY "user_can_delete_own_projects"
ON public.projects
FOR DELETE USING (
    public.projects.user_id = auth.uid()
);

-- Habilitar RLS en la tabla `reports`
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo al propietario del reporte
CREATE POLICY "user_can_access_own_reports"
ON public.reports
FOR SELECT USING (
    public.reports.user_id = auth.uid()
);

-- Política para permitir inserción de reportes solo al usuario correspondiente
CREATE POLICY "user_can_insert_own_reports"
ON public.reports
FOR INSERT WITH CHECK (
    public.reports.user_id = auth.uid()
);

-- Habilitar RLS en la tabla `notifications`
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo a las notificaciones del usuario
CREATE POLICY "user_can_access_own_notifications"
ON public.notifications
FOR SELECT USING (
    public.notifications.user_id = auth.uid()
);

-- Política para permitir modificaciones solo a las notificaciones del usuario
CREATE POLICY "user_can_modify_own_notifications"
ON public.notifications
FOR UPDATE USING (
    public.notifications.user_id = auth.uid()
);

-- Habilitar RLS en la tabla `attachments`
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo a los archivos de proyectos o transacciones del usuario
CREATE POLICY "user_can_access_own_attachments"
ON public.attachments
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = public.attachments.project_id
        AND public.projects.user_id = auth.uid()
    )
);

-- Política para insertar archivos adjuntos solo en proyectos propios
CREATE POLICY "user_can_insert_own_attachments"
ON public.attachments
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = project_id
        AND public.projects.user_id = auth.uid()
    )
);

-- Política para modificar archivos adjuntos solo en proyectos propios
CREATE POLICY "user_can_modify_own_attachments"
ON public.attachments
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = public.attachments.project_id
        AND public.projects.user_id = auth.uid()
    )
);

-- Política para eliminar archivos adjuntos solo en proyectos propios
CREATE POLICY "user_can_delete_own_attachments"
ON public.attachments
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE public.projects.id = public.attachments.project_id
        AND public.projects.user_id = auth.uid()
    )
);

-- Habilitar RLS en la tabla `access_logs`
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso solo a los registros del usuario
CREATE POLICY "user_can_access_own_access_logs"
ON public.access_logs
FOR SELECT USING (
    public.access_logs.user_id = auth.uid()
);

-- Permitir insertar proyectos solo si el user_id es igual al usuario autenticado
CREATE POLICY "user_can_insert_own_projects"
ON public.projects
FOR INSERT WITH CHECK (
    user_id = auth.uid()
);