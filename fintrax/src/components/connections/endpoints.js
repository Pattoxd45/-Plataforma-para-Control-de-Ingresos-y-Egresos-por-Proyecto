import { createClient } from '@supabase/supabase-js';

// Importar las credenciales desde el archivo .env
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

// Crear la conexión con Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Endpoints organizados
export const endpoints = {
  projects: {
    // Obtener todos los proyectos
    // Retorna una lista de todos los proyectos disponibles en la tabla `projects`.
    getAll: async () => {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      console.log('Fetched projects:', data);
      return data;
    },

    // Obtener un proyecto por su ID
    // Retorna los detalles de un proyecto específico basado en su ID.
    getById: async (id) => {
      const { data, error } = await supabase.from('projects').select('*').eq('user_id', id);
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      return data;
    },

    // Crear un nuevo proyecto
    // Inserta un nuevo proyecto en la tabla `projects`.
    create: async (project) => {
      const { data, error } = await supabase.from('projects').insert([project]);
      if (error) throw error;
      return data;
    },

    // Actualizar un proyecto existente
    // Actualiza los campos de un proyecto específico basado en su ID.
    update: async (id, updates) => {
      const { data, error } = await supabase.from('projects').update(updates).eq('id', id);
      if (error) throw error;
      return data;
    },

    // Eliminar un proyecto
    // Elimina un proyecto específico basado en su ID.
    delete: async (id) => {
      const { data, error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return data;
    },
  },
  transactions: {
    // Obtener todas las transacciones
    // Retorna una lista de todas las transacciones disponibles en la tabla `transactions`.
    getAll: async () => {
      const { data, error } = await supabase.from('transactions').select('*');
      if (error) throw error;
      return data;
    },

    // Obtener transacciones por ID de proyecto
    // Retorna todas las transacciones asociadas a un proyecto específico.
    getByProjectId: async (projectId) => {
      const { data, error } = await supabase.from('transactions').select('*').eq('project_id', projectId);
      if (error) throw error;
      return data;
    },

    // Crear una nueva transacción
    // Inserta una nueva transacción en la tabla `transactions`.
    create: async (transaction) => {
      const { data, error } = await supabase.from('transactions').insert([transaction]);
      if (error) throw error;
      return data;
    },

    // Actualizar una transacción existente
    // Actualiza los campos de una transacción específica basado en su ID.
    update: async (id, updates) => {
      const { data, error } = await supabase.from('transactions').update(updates).eq('id', id);
      if (error) throw error;
      return data;
    },

    // Eliminar una transacción
    // Elimina una transacción específica basado en su ID.
    delete: async (id) => {
      const { data, error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      return data;
    },
  },
    reports: {
    // Obtener todos los reportes
    getAll: async () => {
        const { data, error } = await supabase.from('reports').select('*');
        if (error) throw error;
        return data;
    },

    // Obtener un reporte por su ID
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
  // Obtener todos los adjuntos de un proyecto
  getByProjectId: async (projectId) => {
    const { data, error } = await supabase.rpc('get_project_attachments', { project_id: projectId });
    if (error) throw error;
    return data;
  },

  // Crear un nuevo adjunto
  create: async (attachment) => {
    const { data, error } = await supabase.from('attachments').insert([attachment]);
    if (error) throw error;
    return data;
  },
},
    accessLogs: {
    // Obtener el historial de accesos de un usuario
    getByUserId: async (userId) => {
        const { data, error } = await supabase.from('access_logs').select('*').eq('user_id', userId);
        if (error) throw error;
        return data;
    },
    },
    categories: {
    // Obtener todas las categorías
    getAll: async () => {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return data;
    },

    // Crear una nueva categoría
    create: async (category) => {
        const { data, error } = await supabase.from('categories').insert([category]);
        if (error) throw error;
        return data;
    },
    },
    notifications: {
    // Obtener todas las notificaciones de un usuario
    getAll: async (userId) => {
        const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId);
        if (error) throw error;
        return data;
    },

    // Marcar notificaciones como leídas
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
    // Sección agregada para usuarios
    users: {
      update: async (id, updates) => {
        const { data, error } = await supabase.from('users').update(updates).eq('id', id);
        if (error) throw error;
        return data;
      },
      changePassword: async (newPassword) => {
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        return data;
      }
    }
};