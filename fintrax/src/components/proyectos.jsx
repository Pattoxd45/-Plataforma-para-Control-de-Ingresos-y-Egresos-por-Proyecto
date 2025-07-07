import React, { useState, useEffect } from 'react';
import { endpoints } from './connections/endpoints';
import '../styles/proyectos.css';
import useAuthCheck from './hooks/useAuthCheck';
import useCurrentUser from './hooks/useCurrentUser';
import CustomModal from './modals/CustomModal .js';

function CustomAlert({ open, onClose, onConfirm, title, message }) {
  if (!open) return null;
  return (
    <CustomModal open={open} onClose={onClose} title={title}>
      <div style={{ marginBottom: 16 }}>{message}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onConfirm}
          style={{
            background: '#34495e',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            padding: '8px 18px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Sí, finalizar
        </button>
        <button
          onClick={onClose}
          style={{
            background: '#bbb',
            color: '#222',
            border: 'none',
            borderRadius: 5,
            padding: '8px 18px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Cancelar
        </button>
      </div>
    </CustomModal>
  );
}

function Proyectos() {
  const user = useCurrentUser();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [increaseModalOpen, setIncreaseModalOpen] = useState(false);
  const [egresoModalOpen, setEgresoModalOpen] = useState(false);
  const [increaseProject, setIncreaseProject] = useState(null);
  const [egresoProject, setEgresoProject] = useState(null);
  const [increaseAmount, setIncreaseAmount] = useState('');
  const [egresoForm, setEgresoForm] = useState({
    amount: '',
    date: '',
    description: '',
    category: '',
    currency: 'CLP',
    payment_method: 'efectivo',
    tags: ''
  });
  const [form, setForm] = useState({
    project_name: '',
    project_description: '',
    budget: '',
    deadline: '',
    status: 'activo'
  });
  const [editProject, setEditProject] = useState(null);
  const [finalizarModalOpen, setFinalizarModalOpen] = useState(false);
  const [finalizarProject, setFinalizarProject] = useState(null);
  const [egresosDetalleOpen, setEgresosDetalleOpen] = useState(false);
  const [egresosDetalle, setEgresosDetalle] = useState([]);
  const [egresosDetalleProyecto, setEgresosDetalleProyecto] = useState(null);

  // Obtener los proyectos asociados al usuario usando el endpoint correcto
  const fetchProjects = async (userId) => {
    setLoading(true);
    try {
      const data = await endpoints.projects.getUserProjectsSummary(userId);
      setProjects(data || []);
    } catch (error) {
      setErrorMessage('Error inesperado al obtener los proyectos.');
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo proyecto
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await endpoints.projects.createProject({
        user_id: user.id,
        name: form.project_name,
        description: form.project_description,
        budget: Number(form.budget),
        deadline: form.deadline,
        status: form.status
      });
      if (error) throw error;
      setModalOpen(false);
      setForm({ project_name: '', project_description: '', budget: '', deadline: '', status: 'activo' });
      await fetchProjects(user.id);
    } catch (error) {
      setErrorMessage('Error al crear el proyecto.');
    } finally {
      setLoading(false);
    }
  };


  // Abrir modal de edición y cargar datos
  const openEditModal = (project) => {
    setEditProject(project);
    setForm({
      project_name: project.project_name || '',
      project_description: project.project_description || '',
      budget: project.budget || '',
      deadline: project.deadline ? project.deadline.split('T')[0] : '',
      status: project.status || 'activo'
    });
    setEditModalOpen(true);
  };

  // Editar un proyecto existente
  const handleEditProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await endpoints.projects.updateProject({
        id: editProject.project_id,
        user_id: user.id,
        name: form.project_name,
        description: form.project_description,
        budget: Number(form.budget),
        deadline: form.deadline,
        status: form.status
      });
      setEditModalOpen(false);
      setEditProject(null);
      setForm({ project_name: '', project_description: '', budget: '', deadline: '', status: 'activo' });
      await fetchProjects(user.id);
    } catch (error) {
      setErrorMessage('Error al editar el proyecto.');
    } finally {
      setLoading(false);
    }
  };

  // Modal para aumentar presupuesto
  const openIncreaseModal = (project) => {
    setIncreaseProject(project);
    setIncreaseAmount('');
    setIncreaseModalOpen(true);
  };

  const handleIncreaseBudget = async (e) => {
    e.preventDefault();
    if (!increaseProject || !increaseAmount) return;
    setLoading(true);
    setErrorMessage('');
    try {
      await endpoints.projects.increaseProjectBudget({
        projectId: increaseProject.project_id,
        amount: increaseAmount,
        userId: user.id
      });
      setIncreaseModalOpen(false);
      setIncreaseProject(null);
      setIncreaseAmount('');
      await fetchProjects(user.id);
    } catch (error) {
      setErrorMessage('Error al aumentar el presupuesto.');
    } finally {
      setLoading(false);
    }
  };

  // Modal para agregar egreso
  const openEgresoModal = (project) => {
    setEgresoProject(project);
    setEgresoForm({
      amount: '',
      date: '',
      description: '',
      category: '',
      currency: 'CLP',
      payment_method: 'efectivo',
      tags: ''
    });
    setEgresoModalOpen(true);
  };

  const handleEgresoChange = e => setEgresoForm({ ...egresoForm, [e.target.name]: e.target.value });

  const handleSubmitEgreso = async (e) => {
    e.preventDefault();
    if (!egresoProject) return;
    setLoading(true);
    setErrorMessage('');
    try {
      await endpoints.projects.addEgreso({
        projectId: egresoProject.project_id,
        amount: egresoForm.amount,
        date: egresoForm.date,
        description: egresoForm.description,
        category: egresoForm.category,
        currency: egresoForm.currency,
        payment_method: egresoForm.payment_method,
        tags: egresoForm.tags ? egresoForm.tags.split(',').map(tag => tag.trim()) : null
      });
      setEgresoModalOpen(false);
      setEgresoProject(null);
      setEgresoForm({
        amount: '',
        date: '',
        description: '',
        category: '',
        currency: 'CLP',
        payment_method: 'efectivo',
        tags: ''
      });
      await fetchProjects(user.id);
    } catch (error) {
      setErrorMessage('Error al agregar el gasto.');
    } finally {
      setLoading(false);
    }
  };

  // Finalizar proyecto (archivar)
  const handleFinalizarProyecto = (project) => {
    setFinalizarProject(project);
    setFinalizarModalOpen(true);
  };

  const confirmFinalizarProyecto = async () => {
    if (!finalizarProject) return;
    setLoading(true);
    setErrorMessage('');
    try {
      await endpoints.projects.updateProject({
        id: finalizarProject.project_id,
        user_id: user.id,
        name: finalizarProject.project_name,
        description: finalizarProject.project_description,
        budget: finalizarProject.budget,
        deadline: finalizarProject.deadline,
        status: 'archivado'
      });
      setFinalizarModalOpen(false);
      setFinalizarProject(null);
      await fetchProjects(user.id);
    } catch (error) {
      setErrorMessage('Error al finalizar el proyecto.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchProjects(user.id);
    }
  }, [user]);

  useAuthCheck();

  // Formatear fecha a "dia de mes del año"
  const formatFecha = (fecha) => {
    if (!fecha) return '';
    const soloFecha = fecha.split('T')[0];
    const [y, m, d] = soloFecha.split('-');
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const mesNombre = meses[parseInt(m, 10) - 1];
    return `${parseInt(d, 10)} de ${mesNombre} del ${y}`;
  };

  return (
    <div className="proyectos-container">
      <h1>Proyectos</h1>
      <button onClick={() => setModalOpen(true)} className="btn-crear-proyecto">
        Crear Proyecto
      </button>
      {loading && <p>Cargando proyectos...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!loading && projects.length === 0 && <p>No hay proyectos asociados.</p>}
{!loading && projects.length > 0 && (
  <div className="tabla-proyectos">
    <table className="tabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Fecha de finalización</th>
          <th>Presupuesto</th>
          <th>Total Gastos</th>
          <th>Balance</th> {/* Nueva columna */}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.project_id}>
            <td>{project.project_name}</td>
            <td>{project.project_description}</td>
            <td>{formatFecha(project.deadline)}</td>
            <td>{project.budget}</td>
            <td>{project.total_gastos}</td>
            <td>{project.balance}</td> {/* Nuevo dato */}
            <td>
              <div className="acciones-grid">
                <button onClick={() => openEditModal(project)} className="btn-editar-proyecto">
                  Editar
                </button>
                <button
                  onClick={() => openIncreaseModal(project)}
                  className="btn-aumentar-presupuesto"
                >
                  Aumentar Presupuesto
                </button>
                <button
                  onClick={() => openEgresoModal(project)}
                  className="btn-agregar-egreso"
                >
                  Agregar Gastos
                </button>
                <button
                  onClick={() => handleFinalizarProyecto(project)}
                  className="btn-finalizar-proyecto"
                >
                  Finalizar Proyecto
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      {/* Modal para crear proyecto */}
      <CustomModal open={modalOpen} onClose={() => setModalOpen(false)} title="Crear Proyecto">
        <form onSubmit={handleCreateProject} className="form-modal">
          <label>Nombre:</label>
          <input
            type="text"
            value={form.project_name}
            onChange={e => setForm({ ...form, project_name: e.target.value })}
            required
          />
          <label>Descripción:</label>
          <textarea
            value={form.project_description}
            onChange={e => setForm({ ...form, project_description: e.target.value })}
            required
          />
          <label>Presupuesto:</label>
          <input
            type="number"
            value={form.budget}
            onChange={e => setForm({ ...form, budget: e.target.value })}
            required
          />
          <label>Fecha de finalización:</label>
          <input
            type="date"
            value={form.deadline}
            onChange={e => setForm({ ...form, deadline: e.target.value })}
            required
          />
          <button type="submit" className="btn-guardar-proyecto">Guardar</button>
        </form>
      </CustomModal>

      {/* Modal para editar proyecto */}
      <CustomModal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Proyecto">
        <form onSubmit={handleEditProject} className="form-modal">
          <label>Nombre:</label>
          <input
            type="text"
            value={form.project_name}
            onChange={e => setForm({ ...form, project_name: e.target.value })}
            required
          />
          <label>Descripción:</label>
          <textarea
            value={form.project_description}
            onChange={e => setForm({ ...form, project_description: e.target.value })}
            required
          />
          <label>Presupuesto:</label>
          <input
            type="number"
            value={form.budget}
            onChange={e => setForm({ ...form, budget: e.target.value })}
            required
          />
          <label>Fecha de finalización:</label>
          <input
            type="date"
            value={form.deadline}
            onChange={e => setForm({ ...form, deadline: e.target.value })}
            required
          />
          <button type="submit" className="btn-guardar-proyecto">Guardar Cambios</button>
        </form>
      </CustomModal>

      {/* Modal para aumentar presupuesto */}
      <CustomModal open={increaseModalOpen} onClose={() => setIncreaseModalOpen(false)} title="Aumentar Presupuesto">
        <form onSubmit={handleIncreaseBudget} className="form-modal">
          <label>Monto a aumentar:</label>
          <input
            type="number"
            value={increaseAmount}
            onChange={e => setIncreaseAmount(e.target.value)}
            min="1"
            required
          />
          <button type="submit" className="btn-guardar-proyecto" style={{ background: '#f39c12', color: '#fff', marginTop: 12 }}>
            Aumentar
          </button>
        </form>
      </CustomModal>

      {/* Modal para agregar egreso */}
      <CustomModal open={egresoModalOpen} onClose={() => setEgresoModalOpen(false)} title="Agregar Gasto">
        <form className="form-modal" onSubmit={handleSubmitEgreso}>
          <label>Monto:</label>
          <input
            name="amount"
            type="number"
            value={egresoForm.amount}
            onChange={handleEgresoChange}
            required
          />
          <label>Fecha:</label>
          <input
            name="date"
            type="date"
            value={egresoForm.date}
            onChange={handleEgresoChange}
            required
          />
          <label>Descripción:</label>
          <textarea
            name="description"
            value={egresoForm.description}
            onChange={handleEgresoChange}
            required
          />
          <label>Categoría:</label>
          <input
            name="category"
            value={egresoForm.category}
            onChange={handleEgresoChange}
          />
          <label>Moneda:</label>
          <select
            name="currency"
            value={egresoForm.currency}
            onChange={handleEgresoChange}
          >
            <option value="CLP">CLP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BTC">BTC</option>
          </select>
          <label>Método de pago:</label>
          <select
            name="payment_method"
            value={egresoForm.payment_method}
            onChange={handleEgresoChange}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="otros">Otros</option>
          </select>
          <label>Tags (separados por coma):</label>
          <input
            name="tags"
            value={egresoForm.tags}
            onChange={handleEgresoChange}
          />
          <button type="submit" className="btn-guardar-proyecto" style={{ background: '#16a085', color: '#fff', marginTop: 12 }}>
            Agregar Gasto
          </button>
        </form>
      </CustomModal>

      {/* CustomAlert para finalizar proyecto */}
      <CustomAlert
        open={finalizarModalOpen}
        onClose={() => setFinalizarModalOpen(false)}
        onConfirm={confirmFinalizarProyecto}
        title="Finalizar Proyecto"
        message="¿Está seguro de que desea finalizar este proyecto? Esta acción no se puede deshacer."
      />
    </div>
  );
}

export default Proyectos;