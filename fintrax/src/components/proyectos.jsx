import React, { useState, useEffect } from 'react';
import { supabase, endpoints } from './connections/endpoints'; // Importar los endpoints
import '../styles/proyectos.css';
import useAuthCheck from './hooks/useAuthCheck'; // Importar el hook de verificación de sesión

function Proyectos() {
  const [userId, setUserId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');



  // Obtener la ID del usuario autenticado
  const fetchUserId = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user?.id) {
        setUserId(session.session.user.id);
      } else {
        setErrorMessage('No se pudo obtener la sesión del usuario.');
      }
    } catch (error) {
      setErrorMessage('Error inesperado al obtener la sesión del usuario.');
    }
  };

  // Obtener los proyectos asociados al usuario usando el endpoint
  const fetchProjects = async (userId) => {
    try {
      const data = await endpoints.projects.getById(userId); // Usar el endpoint para obtener proyectos
      const userProjects = data.filter((project) => project.user_id === userId); // Filtrar por user_id
      setProjects(userProjects);
    } catch (error) {
      console.error('Error fetching projects:', error); // Imprimir el error
      setErrorMessage('Error inesperado al obtener los proyectos.');
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar la ID del usuario y los proyectos
  useEffect(() => {
    const loadData = async () => {
      await fetchUserId();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProjects(userId);
    }
  }, [userId]);

  useAuthCheck(); // Verificar sesión

  return (
    <div className="proyectos-container">
      <h1>Proyectos</h1>
      {loading && <p>Cargando proyectos...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!loading && projects.length === 0 && <p>No hay proyectos asociados.</p>}
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="project-item">
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p><strong>Presupuesto:</strong> {project.budget}</p>
            <p><strong>Estado:</strong> {project.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Proyectos;