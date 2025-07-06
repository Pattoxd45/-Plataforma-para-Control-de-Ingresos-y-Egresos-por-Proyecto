CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    budget NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deadline TIMESTAMPTZ DEFAULT NULL,
    status TEXT DEFAULT 'activo' CHECK (status IN ('activo', 'archivado'))
);

CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    description TEXT,
    category TEXT,
    type TEXT CHECK (type IN ('ingreso', 'egreso')),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    deletion_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    currency TEXT DEFAULT 'CLP' CHECK (currency IN ('CLP', 'USD', 'EUR', 'BTC')),
    payment_method TEXT CHECK (payment_method IN ('efectivo', 'tarjeta', 'transferencia', 'otros')),
    tags TEXT[]
);

CREATE TABLE public.transactions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    change_type TEXT CHECK (change_type IN ('update', 'delete')),
    old_values JSONB,
    new_values JSONB,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id INT REFERENCES public.categories(id)
);

CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id UUID REFERENCES public.projects(id),
    report_type TEXT CHECK (report_type IN ('balance', 'summary')),    
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'generado' CHECK (status IN ('en_proceso', 'generado', 'fallido')),
    filters_used JSONB,
    data JSONB
);

CREATE TABLE public.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    role TEXT CHECK (role IN ('admin', 'user')),
    preferences JSONB,
    last_login TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    type TEXT DEFAULT 'informativa' CHECK (type IN ('informativa', 'alerta', 'error')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'alta', 'urgente')),
    expiration_date TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- opcional: tabla para adjuntos de transacciones
CREATE TABLE public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id),
    transaction_id UUID REFERENCES public.transactions(id),
    file_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    accessed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    action TEXT CHECK (action IN ('login', 'logout', 'view_project', 'view_transaction', 'create_transaction', 'update_transaction', 'delete_transaction'))
);

CREATE TABLE public.failed_logins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);