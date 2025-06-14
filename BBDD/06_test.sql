INSERT INTO fintrax.projects (user_id, name, description, budget, status)
VALUES (
    '0a607a0d-ea6e-46d7-9589-14d16795149e', -- Reemplaza con el ID del usuario creado
    'Proyecto de prueba',
    'Descripción del proyecto de prueba',
    1000, -- Presupuesto inicial
    'activo'
);

SELECT * FROM fintrax.projects WHERE user_id = '0a607a0d-ea6e-46d7-9589-14d16795149e';

INSERT INTO fintrax.transactions (project_id, amount, date, description, category, type)
VALUES (
    '82c185f3-b336-421f-b2d2-21de7504c82a', -- Reemplaza con el ID del proyecto creado
    500, -- Monto de la transacción
    NOW(), -- Fecha actual
    'Transacción de prueba',
    'Categoría de prueba',
    'ingreso'
);

INSERT INTO fintrax.reports (user_id, project_id, report_type, status, filters_used, data)
VALUES 
    (
    '0a607a0d-ea6e-46d7-9589-14d16795149e', 
    '82c185f3-b336-421f-b2d2-21de7504c82a', 
    'balance', 
    'generado', 
    '{"start_date": "2025-01-01", "end_date": "2025-06-01"}', 
    '{"balance": 200}'
    );


