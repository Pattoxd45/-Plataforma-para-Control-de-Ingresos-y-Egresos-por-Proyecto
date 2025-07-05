-- Vista para obtener el balance de cada proyecto
CREATE OR REPLACE VIEW public.project_balances AS
SELECT 
    p.id AS project_id,
    p.name AS project_name,
    p.description AS project_description,
    p.budget AS project_budget,
    p.status AS project_status,
    COALESCE(SUM(CASE WHEN t.type = 'ingreso' THEN t.amount ELSE -t.amount END), 0) AS balance
FROM 
    public.projects p
LEFT JOIN 
    public.transactions t ON p.id = t.project_id AND t.deleted_at IS NULL
GROUP BY 
    p.id;

-- Vista para obtener transacciones activas con detalles del proyecto
CREATE OR REPLACE VIEW public.active_transactions AS
SELECT 
    t.id AS transaction_id,
    t.project_id,
    p.name AS project_name,
    t.amount,
    t.date,
    t.description,
    t.category,
    t.type,
    t.currency,
    t.payment_method
FROM 
    public.transactions t
JOIN 
    public.projects p ON t.project_id = p.id
WHERE 
    t.deleted_at IS NULL;

-- Vista para obtener el historial de cambios de transacciones
CREATE OR REPLACE VIEW public.transaction_history AS
SELECT 
    tl.transaction_id,
    tl.change_type,
    tl.old_values,
    tl.new_values,
    tl.reason,
    tl.user_id,
    u.email AS user_email,
    tl.created_at
FROM 
    public.transactions_log tl
JOIN 
    auth.users u ON tl.user_id = u.id;

-- Vista para obtener notificaciones activas de un usuario
CREATE OR REPLACE VIEW public.active_notifications AS
SELECT 
    n.id AS notification_id,
    n.user_id,
    u.email AS user_email,
    n.message,
    n.type,
    n.priority,
    n.expiration_date,
    n.created_at
FROM 
    public.notifications n
JOIN 
    auth.users u ON n.user_id = u.id
WHERE 
    n.read = FALSE AND (n.expiration_date IS NULL OR n.expiration_date > NOW());

-- Vista para obtener adjuntos relacionados con proyectos y transacciones
CREATE OR REPLACE VIEW public.project_attachments AS
SELECT 
    a.id AS attachment_id,
    a.project_id,
    p.name AS project_name,
    a.transaction_id,
    t.description AS transaction_description,
    a.file_name,
    a.file_url,
    a.file_type,
    a.uploaded_at
FROM 
    public.attachments a
LEFT JOIN 
    public.projects p ON a.project_id = p.id
LEFT JOIN 
    public.transactions t ON a.transaction_id = t.id;

-- Vista para obtener un resumen financiero consolidado por usuario
CREATE OR REPLACE VIEW public.user_financial_summary AS
SELECT 
    p.user_id,
    u.email AS user_email,
    p.id AS project_id,
    p.name AS project_name,
    COALESCE(SUM(CASE WHEN t.type = 'ingreso' THEN t.amount ELSE 0 END), 0) AS total_ingresos,
    COALESCE(SUM(CASE WHEN t.type = 'egreso' THEN t.amount ELSE 0 END), 0) AS total_egresos,
    COALESCE(SUM(CASE WHEN t.type = 'ingreso' THEN t.amount ELSE -t.amount END), 0) AS balance
FROM 
    public.projects p
LEFT JOIN 
    public.transactions t ON p.id = t.project_id AND t.deleted_at IS NULL
JOIN 
    auth.users u ON p.user_id = u.id
GROUP BY 
    p.user_id, u.email, p.id, p.name;

-- Vista para obtener el resumen de ingresos y egresos por categoría
CREATE OR REPLACE VIEW public.category_summary AS
SELECT 
    t.project_id,
    t.category,
    SUM(CASE WHEN t.type = 'ingreso' THEN t.amount ELSE 0 END) AS total_ingresos,
    SUM(CASE WHEN t.type = 'egreso' THEN t.amount ELSE 0 END) AS total_egresos
FROM 
    public.transactions t
WHERE 
    t.deleted_at IS NULL
GROUP BY 
    t.project_id, t.category;

-- Vista para obtener el historial de accesos de un usuario
CREATE OR REPLACE VIEW public.user_access_history AS
SELECT 
    al.user_id,
    u.email AS user_email,
    al.accessed_at,
    al.ip_address,
    al.user_agent,
    al.action
FROM 
    public.access_logs al
JOIN 
    auth.users u ON al.user_id = u.id
ORDER BY 
    al.accessed_at DESC;

-- Vista para obtener proyectos con su balance y estado
CREATE OR REPLACE VIEW public.project_status_summary AS
SELECT 
    p.id AS project_id,
    p.user_id, -- <--- Agrega esto
    p.name AS project_name,
    p.description AS project_description,
    p.status AS project_status,
    COALESCE(SUM(CASE WHEN t.type = 'ingreso' THEN t.amount ELSE -t.amount END), 0) AS balance
FROM 
    public.projects p
LEFT JOIN 
    public.transactions t ON p.id = t.project_id AND t.deleted_at IS NULL
GROUP BY 
    p.id, p.user_id, p.name, p.description, p.status;
    
-- Vista para obtener notificaciones agrupadas por prioridad
CREATE OR REPLACE VIEW public.notifications_by_priority AS
SELECT 
    n.user_id,
    u.email AS user_email,
    n.priority,
    COUNT(*) AS notification_count
FROM 
    public.notifications n
JOIN 
    auth.users u ON n.user_id = u.id
WHERE 
    n.read = FALSE AND (n.expiration_date IS NULL OR n.expiration_date > NOW())
GROUP BY 
    n.user_id, u.email, n.priority;

-- Vista para obtener transacciones eliminadas
CREATE OR REPLACE VIEW public.deleted_transactions AS
SELECT 
    t.id AS transaction_id,
    t.project_id,
    p.name AS project_name,
    t.amount,
    t.date,
    t.description,
    t.category,
    t.type,
    t.deletion_reason,
    t.deleted_at
FROM 
    public.transactions t
JOIN 
    public.projects p ON t.project_id = p.id
WHERE 
    t.deleted_at IS NOT NULL;

-- Vista para obtener proyectos de un usuario con nombre, descripción, fecha límite, presupuesto y gastos
CREATE OR REPLACE VIEW public.user_projects_summary AS
SELECT
    p.id AS project_id,
    p.user_id,
    p.name AS project_name,
    p.description AS project_description,
    p.deadline,
    p.budget,
    COALESCE(SUM(CASE WHEN t.type = 'egreso' THEN t.amount ELSE 0 END), 0) AS total_gastos
FROM
    public.projects p
LEFT JOIN
    public.transactions t ON p.id = t.project_id AND t.deleted_at IS NULL
WHERE
    p.status = 'activo'
GROUP BY
    p.id, p.user_id, p.name, p.description, p.deadline, p.budget;

-- Vista para obtener egresos por proyecto con detalles de usuario
CREATE OR REPLACE VIEW public.project_egresos_view AS
SELECT
    t.id AS egreso_id,
    t.project_id,
    p.name AS proyecto,
    t.amount AS monto,
    t.date::date AS fecha,
    t.description AS descripcion,
    t.category,
    t.currency,
    t.payment_method,
    t.tags,
    u.email AS responsable
FROM
    public.transactions t
JOIN
    public.projects p ON t.project_id = p.id
JOIN
    auth.users u ON p.user_id = u.id
WHERE
    t.type = 'egreso'
    AND t.deleted_at IS NULL
    AND p.status = 'activo';
-- Vista para obtener un resumen financiero de proyectos, incluyendo presupuesto, gastos y responsable
CREATE OR REPLACE VIEW public.project_financial_overview AS
SELECT
    p.id AS project_id,
    p.user_id,
    p.name AS nombre_proyecto,
    p.description AS descripcion,
    p.budget AS presupuesto_inicial,
    COALESCE(SUM(CASE WHEN t.type = 'egreso' THEN t.amount ELSE 0 END), 0) AS gastos,
    (
        p.budget
        + COALESCE((SELECT SUM(amount) FROM public.project_budget_increases WHERE project_id = p.id), 0)
        - COALESCE(SUM(CASE WHEN t.type = 'egreso' THEN t.amount ELSE 0 END), 0)
    ) AS presupuesto_actual,
    COALESCE((SELECT SUM(amount) FROM public.project_budget_increases WHERE project_id = p.id), 0) AS total_aumentos_presupuesto, -- <--- NUEVO
    p.deadline AS fecha_termino,
    STRING_AGG(DISTINCT t.category, ', ') FILTER (WHERE t.category IS NOT NULL) AS categorias,
    u.email AS responsable
FROM
    public.projects p
LEFT JOIN
    public.transactions t ON p.id = t.project_id AND t.deleted_at IS NULL
JOIN
    auth.users u ON p.user_id = u.id
WHERE
    p.status = 'activo'
GROUP BY
    p.id, p.user_id, p.name, p.description, p.budget, p.deadline, u.email;

-- Vista de ingresos por proyecto (solo aumentos de presupuesto)
CREATE OR REPLACE VIEW public.project_ingresos_view AS
SELECT
    p.id AS project_id,
    p.name AS proyecto,
    COALESCE((SELECT SUM(amount) FROM public.project_budget_increases WHERE project_id = p.id), 0) AS monto,
    p.created_at::date AS fecha,
    p.description AS descripcion,
    u.email AS responsable
FROM
    public.projects p
JOIN
    auth.users u ON p.user_id = u.id
WHERE
    p.status = 'activo';

-- Vista de ingresos de todos los proyectos de un usuario (solo aumentos de presupuesto)
CREATE OR REPLACE VIEW public.user_projects_ingresos_view AS
SELECT
    p.user_id,
    u.email AS responsable,
    p.id AS project_id,
    p.name AS proyecto,
    COALESCE((SELECT SUM(amount) FROM public.project_budget_increases WHERE project_id = p.id), 0) AS monto,
    p.created_at::date AS fecha,
    p.description AS descripcion
FROM
    public.projects p
JOIN
    auth.users u ON p.user_id = u.id
WHERE
    p.status = 'activo';

-- Vista para listar los aumentos individuales de presupuesto por proyecto
CREATE OR REPLACE VIEW public.project_budget_increases_view AS
SELECT
    id AS increase_id,
    project_id,
    amount,
    increased_at AS created_at,
    user_id
FROM
    public.project_budget_increases;

-- Vista para mostrar proyectos archivados con nombre, fecha de término, categoría, responsable y balance final desde current_balance
CREATE OR REPLACE VIEW public.archived_projects_summary AS
SELECT
    p.id AS project_id,
    p.name AS nombre_proyecto,
    p.deadline AS fecha_termino,
    STRING_AGG(DISTINCT t.category, ', ') FILTER (WHERE t.category IS NOT NULL) AS categorias,
    u.email AS responsable,
    p.current_balance AS balance_final
FROM
    public.projects p
LEFT JOIN
    public.transactions t ON p.id = t.project_id AND t.deleted_at IS NULL
JOIN
    auth.users u ON p.user_id = u.id
WHERE
    p.status = 'archivado'
GROUP BY
    p.id, p.name, p.deadline, u.email, p.current_balance;

-- Vista para mostrar proyectos archivados de un usuario específico usando current_balance
CREATE OR REPLACE VIEW public.user_archived_projects_summary AS
SELECT
    p.id AS project_id,
    p.user_id,
    p.name AS nombre_proyecto,
    p.deadline AS fecha_termino,
    STRING_AGG(DISTINCT t.category, ', ') FILTER (WHERE t.category IS NOT NULL) AS categorias,
    u.email AS responsable,
    p.current_balance AS balance_final
FROM
    public.projects p
LEFT JOIN
    public.transactions t ON p.id = t.project_id AND t.deleted_at IS NULL
JOIN
    auth.users u ON p.user_id = u.id
WHERE
    p.status = 'archivado'
GROUP BY
    p.id, p.user_id, p.name, p.deadline, u.email, p.current_balance;

