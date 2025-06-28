import React, { useState } from 'react';
import { endpoints } from './connections/endpoints';

function TestEndpoints({ user }) {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');

  const userId = user?.id;

  // Obtener todos los proyectos del usuario logeado
  const handleGetProjects = async () => {
    setLoading(true);
    try {
      const data = await endpoints.projects.getAll(userId);
      setProjects(data);
      setOutput(JSON.stringify(data, null, 2));
      if (data.length > 0) setProjectId(data[0].project_id || data[0].id);
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };

  // Obtener un proyecto por su ID y usuario
  const handleGetProjectById = async () => {
    if (!projectId) return setOutput('No hay projectId seleccionado');
    setLoading(true);
    try {
      const data = await endpoints.projects.getById(projectId, userId);
      setOutput(JSON.stringify(data, null, 2));
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Test de Endpoints</h2>
      <button onClick={handleGetProjects} disabled={loading || !userId}>
        Obtener proyectos del usuario
      </button>
      <div style={{ margin: '12px 0' }}>
        <label>Selecciona un proyecto:&nbsp;</label>
        <select
          value={projectId}
          onChange={e => setProjectId(e.target.value)}
          disabled={projects.length === 0}
        >
          <option value="">-- Selecciona --</option>
          {projects.map(p => (
            <option key={p.project_id || p.id} value={p.project_id || p.id}>
              {p.project_name || p.name}
            </option>
          ))}
        </select>
        <button onClick={handleGetProjectById} disabled={loading || !projectId}>
          Obtener proyecto por ID
        </button>
      </div>
      <div style={{ marginTop: 16 }}>
        <strong>Output:</strong>
        <pre style={{ background: '#eee', padding: 12, maxHeight: 400, overflow: 'auto' }}>{output}</pre>
      </div>
    </div>
  );
}

export default TestEndpoints;