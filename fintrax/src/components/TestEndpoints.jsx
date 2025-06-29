import React, { useState } from 'react';
import { endpoints, supabase } from './connections/endpoints';
import CustomModal from './modals/CustomModal ';
import '../styles/responsiveMedia.css';

function TestEndpoints({ user }) {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    budget: '',
    deadline: '',
    status: 'activo'
  });
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const userId = user?.id;

  // Obtener proyectos del usuario y guardarlos en el estado
  const handleGetUserProjectsSummary = async () => {
    setLoading(true);
    try {
      const data = await endpoints.projects.getUserProjectsSummary(userId);
      setProjects(data || []);
      setOutput(JSON.stringify(data, null, 2));
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };

  // Abrir modal para crear
  const openCreateModal = () => {
    setEditMode(false);
    setForm({
      id: '',
      name: '',
      description: '',
      budget: '',
      deadline: '',
      status: 'activo'
    });
    setModalOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = () => {
    const project = projects.find(p => p.project_id === selectedProjectId);
    if (!project) return;
    setEditMode(true);
    setForm({
      id: project.project_id,
      name: project.project_name,
      description: project.project_description,
      budget: project.budget,
      deadline: project.deadline ? project.deadline.split('T')[0] : '',
      status: project.status || 'activo',
    });
    setModalOpen(true);
  };

  // Handler para crear o editar proyecto
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode && form.id) {
        console.log({
  id: form.id,
  user_id: userId,
  name: form.name,
  description: form.description,
  budget: Number(form.budget),
  deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
  status: form.status
});
      await endpoints.projects.updateProject({
        id: form.id,
        user_id: userId, // <-- este debe tener valor
        name: form.name,
        description: form.description,
        budget: Number(form.budget),
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
        status: form.status
      });        
        setOutput('Proyecto actualizado correctamente');
      } else {
        const { data, error } = await supabase.rpc('create_project', {
          p_user_id: userId, // Siempre enviar el userId del usuario logeado
          p_name: form.name,
          p_description: form.description,
          p_budget: Number(form.budget),
          p_deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
          p_status: form.status
        });
        if (error) throw error;
        setOutput(`Proyecto creado con ID: ${data}`);
      }
      setModalOpen(false);
      setForm({ id: '', name: '', description: '', budget: '', deadline: '', status: 'activo' });
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="test-endpoints-container" style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h2 className="test-endpoints-title">Test de Endpoints</h2>
      <div
        className="test-endpoints-buttons"
        style={{
          maxHeight: 200,
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          background: '#fafafa'
        }}
      >
        <button
          onClick={handleGetUserProjectsSummary}
          disabled={loading || !userId}
          className="test-endpoints-btn"
          style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 12 }}
        >
          Obtener proyectos del usuario
        </button>
        <button
          onClick={openCreateModal}
          className="test-endpoints-btn"
          style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 12 }}
        >
          Crear nuevo proyecto (modal)
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            style={{ width: '70%' }}
            disabled={projects.length === 0}
          >
            <option value="">-- Selecciona proyecto para editar --</option>
            {projects.map(p => (
              <option key={p.project_id} value={p.project_id}>
                {p.project_name}
              </option>
            ))}
          </select>
          <button
            onClick={openEditModal}
            className="test-endpoints-btn"
            style={{ width: '30%', padding: 12, fontSize: 16 }}
            disabled={!selectedProjectId}
          >
            Editar proyecto
          </button>
        </div>
      </div>
      <CustomModal open={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? "Editar Proyecto" : "Crear Proyecto"}>
        <form className="test-endpoints-form" onSubmit={handleSubmitProject}>
          <div>
            <label>Nombre:</label>
            <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%' }} />
          </div>
          <div>
            <label>Descripción:</label>
            <textarea name="description" value={form.description} onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label>Presupuesto:</label>
            <input name="budget" type="number" value={form.budget} onChange={handleChange} required style={{ width: '100%' }} />
          </div>
          <div>
            <label>Fecha límite:</label>
            <input name="deadline" type="date" value={form.deadline} onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label>Estado:</label>
            <select name="status" value={form.status} onChange={handleChange} style={{ width: '100%' }}>
              <option value="activo">Activo</option>
              <option value="archivado">Archivado</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: 16, width: '100%' }}>
            {loading ? (editMode ? 'Actualizando...' : 'Creando...') : (editMode ? 'Actualizar Proyecto' : 'Crear Proyecto')}
          </button>
        </form>
      </CustomModal>
      <div style={{ marginTop: 16 }}>
        <strong>Output:</strong>
        <pre
          className="test-endpoints-output"
          style={{
            background: '#eee',
            padding: 12,
            maxHeight: 400,
            overflow: 'auto',
            borderRadius: 8
          }}
        >
          {output}
        </pre>
      </div>
    </div>
  );
}

export default TestEndpoints;