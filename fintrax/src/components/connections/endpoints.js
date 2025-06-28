import { createClient } from '@supabase/supabase-js';

// Importar las credenciales desde el archivo .env
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

// Crear la conexión con Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Endpoints organizados
export const endpoints = {
  projects: {
    // Obtener todos los proyectos (usando la vista project_status_summary)
    getAll: async () => {
      const { data, error } = await supabase.from('project_status_summary').select('*');
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      return data;
    },

    // Obtener un proyecto por su ID (usando la vista project_status_summary)
    getById: async (projectId, userId) => {
  const { data, error } = await supabase
    .from('project_status_summary')
    .select('*')
    .eq('project_id', projectId)
    .eq('user_id', userId) // <--- Filtra por usuario
    .single();
  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
  return data;
},

    // Crear, actualizar y eliminar siguen igual porque son operaciones de escritura
    create: async (project) => {
      const { data, error } = await supabase.from('projects').insert([project]);
      if (error) throw error;
      return data;
    },
    update: async (id, updates) => {
      const { data, error } = await supabase.from('projects').update(updates).eq('id', id);
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { data, error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return data;
    },
  },
  transactions: {
    // Obtener todas las transacciones activas (usando la vista active_transactions)
    getAll: async () => {
      const { data, error } = await supabase.from('active_transactions').select('*');
      if (error) throw error;
      return data;
    },

    // Obtener transacciones por ID de proyecto (usando la vista active_transactions)
    getByProjectId: async (projectId) => {
      const { data, error } = await supabase
        .from('active_transactions')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data;
    },

    // Obtener historial de una transacción (usando la RPC get_transaction_history)
    getHistory: async (transactionId) => {
      const { data, error } = await supabase.rpc('get_transaction_history', { transaction_id: transactionId });
      if (error) throw error;
      return data;
    },

    // Crear, actualizar y eliminar siguen igual
    create: async (transaction) => {
      const { data, error } = await supabase.from('transactions').insert([transaction]);
      if (error) throw error;
      return data;
    },
    update: async (id, updates) => {
      const { data, error } = await supabase.from('transactions').update(updates).eq('id', id);
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { data, error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      return data;
    },
  },
  reports: {
    getAll: async () => {
      const { data, error } = await supabase.from('reports').select('*');
      if (error) throw error;
      return data;
    },
    getById: async (id) => {
      const { data, error } = await supabase.from('reports').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    generate: async (projectId, reportType, startDate, endDate) => {
      const { data, error } = await supabase.rpc('generate_financial_report', {
        project_id: projectId,
        report_type: reportType,
        start_date: startDate,
        end_date: endDate,
      });
      if (error) throw error;
      return data;
    },
  },
  attachments: {
    // Obtener todos los adjuntos de un proyecto (usando la RPC get_project_attachments)
    getByProjectId: async (projectId) => {
      const { data, error } = await supabase.rpc('get_project_attachments', { project_id: projectId });
      if (error) throw error;
      return data;
    },
    create: async (attachment) => {
      const { data, error } = await supabase.from('attachments').insert([attachment]);
      if (error) throw error;
      return data;
    },
  },
  accessLogs: {
    getByUserId: async (userId) => {
      const { data, error } = await supabase.from('user_access_history').select('*').eq('user_id', userId);
      if (error) throw error;
      return data;
    },
  },
  categories: {
    getAll: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data;
    },
    // Puedes agregar aquí una vista para resumen por categoría si lo necesitas
    getSummary: async (projectId) => {
      const { data, error } = await supabase
        .from('category_summary')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data;
    },
    create: async (category) => {
      const { data, error } = await supabase.from('categories').insert([category]);
      if (error) throw error;
      return data;
    },
  },
  notifications: {
    // Obtener todas las notificaciones activas de un usuario (usando la vista active_notifications)
    getAll: async (userId) => {
      const { data, error } = await supabase
        .from('active_notifications')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    },
    markAsRead: async (userId) => {
      const { data, error } = await supabase.rpc('mark_notifications_as_read', { user_id: userId });
      if (error) throw error;
      return data;
    },
  },
  statistics: {
    getByProjectId: async (projectId) => {
      const { data, error } = await supabase.rpc('get_project_statistics', { project_id: projectId });
      if (error) throw error;
      return data;
    },
  },
};