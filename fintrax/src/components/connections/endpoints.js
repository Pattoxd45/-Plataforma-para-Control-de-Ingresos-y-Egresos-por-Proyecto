import { createClient } from '@supabase/supabase-js';

// Importar las credenciales desde el archivo .env
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

// Crear la conexión con Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Endpoints organizados
export const endpoints = {
  projects: {
    // ============================================================
    // Endpoints para manejar proyectos
    // ============================================================
    // Obtener todos los proyectos (usando la vista project_status_summary)
    getUserProjectsSummary: async (userId) => {
      const { data, error } = await supabase
        .from('user_projects_summary')
        .select('*')
        .eq('user_id', userId);
      if (error) {
        console.error('Error fetching user projects summary:', error);
        throw error;
      }
      return data;  
    },
    // Obtener detalles de un proyecto específico
    getProjectDetails: async (projectId) => {
      const { data, error } = await supabase
        .from('project_details')
        .select('*')
        .eq('id', projectId)
        .single();
      if (error) {
        console.error('Error fetching project details:', error);
        throw error;
      }
      return data;
    },
    // actualizar un proyecto existente
    updateProject: async (project) => {
      const { data, error } = await supabase.rpc('update_project', {
        p_project_id: project.id,
        p_user_id: project.user_id,
        p_name: project.name,
        p_description: project.description,
        p_budget: project.budget,
        p_deadline: project.deadline,
        p_status: project.status
      });
      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }
      return data;
    },
    // =============================================================
    // Manejo de Egresos
    // ============================================================
    // Obtener egresos de un proyecto
    getProjectEgresos: async (projectId) => {
      const { data, error } = await supabase
        .from('project_egresos_view')
        .select('*')
        .eq('project_id', projectId);
      if (error) {
        console.error('Error fetching project egresos:', error);
        throw error;
      }
      return data;
    },
    // Editar un egreso existente
    editEgreso: async ({
      transactionId,
      projectId,
      amount,
      date,
      description,
      category,
      currency = 'CLP',
      payment_method = 'efectivo',
      tags = null
    }) => {
      const { error } = await supabase.rpc('edit_egreso', {
        p_transaction_id: transactionId,
        p_project_id: projectId,
        p_amount: amount !== undefined ? Number(amount) : null,
        p_date: date ? new Date(date).toISOString() : null,
        p_description: description ?? null,
        p_category: category ?? null,
        p_currency: currency,
        p_payment_method: payment_method,
        p_tags: tags && Array.isArray(tags)
          ? tags
          : (typeof tags === 'string' && tags.length > 0
              ? tags.split(',').map(tag => tag.trim())
              : null)
      });
      if (error) {
        console.error('Error editing egreso:', error);
        throw error;
      }
      return true;
    },   
    // Agregar un nuevo egreso a un proyecto
    addEgreso: async ({
      projectId,
      amount,
      date,
      description,
      category,
      currency = 'CLP',
      payment_method = 'efectivo',
      tags = null
    }) => {
      const { data, error } = await supabase.rpc('add_egreso', {
        p_project_id: projectId,
        p_amount: Number(amount),
        p_date: date ? new Date(date).toISOString() : new Date().toISOString(),
        p_description: description,
        p_category: category || null,
        p_currency: currency,
        p_payment_method: payment_method,
        p_tags: tags && Array.isArray(tags)
          ? tags
          : (typeof tags === 'string' && tags.length > 0
              ? tags.split(',').map(tag => tag.trim())
              : null)
      });
      if (error) {
        console.error('Error adding egreso:', error);
        throw error;
      }
      return data;
    },
        // ============================================================
    // Manejo de Ingresos
    // ============================================================
    // Obtener ingresos de un proyecto
    getProjectIngresos: async (projectId) => {
      const { data, error } = await supabase
        .from('project_ingresos_view')
        .select('*')
        .eq('project_id', projectId)
        .single();
      if (error) {
        console.error('Error fetching project ingresos:', error);
        throw error;
      }
      return data;
    },    
    
    // ============================================================
    // Manejo de Ingresos
    // ============================================================
    // Obtener ingresos de un proyecto
    getProjectIngresos: async (projectId) => {
      const { data, error } = await supabase
        .from('project_ingresos_view')
        .select('*')
        .eq('project_id', projectId)
        .single();
      if (error) {
        console.error('Error fetching project ingresos:', error);
        throw error;
      }
      return data;
    }, 
    // Editar un ingreso existente  
    getUserProjectsIngresos: async (userId) => {
      const { data, error } = await supabase
        .from('user_projects_ingresos_view')
        .select('*')
        .eq('user_id', userId);
      if (error) {
        console.error('Error fetching user projects ingresos:', error);
        throw error;
      }
      return data;
    }, 
  }
};