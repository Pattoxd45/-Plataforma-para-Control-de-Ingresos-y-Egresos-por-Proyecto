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
    // endpoints.js
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
  }
};