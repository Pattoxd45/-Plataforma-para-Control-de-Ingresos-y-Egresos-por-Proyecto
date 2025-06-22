-- Insertar un proyecto de prueba en la tabla `projects`
INSERT INTO public.projects (user_id, name, description, budget, status)
VALUES (
    '0a607a0d-ea6e-46d7-9589-14d16795149e', -- Reemplaza con el ID del usuario creado
    'Proyecto de prueba',
    'Descripción del proyecto de prueba',
    1000, -- Presupuesto inicial
    'activo'
);

-- Consultar el proyecto recién creado
SELECT * FROM public.projects WHERE user_id = '0a607a0d-ea6e-46d7-9589-14d16795149e';

-- Insertar una transacción de prueba en la tabla `transactions`
INSERT INTO public.transactions (project_id, amount, date, description, category, type)
VALUES (
    '90c037f1-cc79-47a7-87b9-a8fbd010b1ca', -- Reemplaza con el ID del proyecto creado
    500, -- Monto de la transacción
    NOW(), -- Fecha actual
    'Transacción de prueba',
    'Categoría de prueba',
    'ingreso'
);

-- Insertar un reporte de prueba en la tabla `reports`
INSERT INTO public.reports (user_id, project_id, report_type, status, filters_used, data)
VALUES 
    (
    '0a607a0d-ea6e-46d7-9589-14d16795149e', -- Reemplaza con el ID del usuario creado
    '90c037f1-cc79-47a7-87b9-a8fbd010b1ca', -- Reemplaza con el ID del proyecto creado
    'balance', 
    'generado', 
    '{"start_date": "2025-01-01", "end_date": "2025-06-01"}', 
    '{"balance": 200}'
    );

-- Consultar el reporte recién creado
SELECT * FROM public.reports WHERE user_id = '0a607a0d-ea6e-46d7-9589-14d16795149e';