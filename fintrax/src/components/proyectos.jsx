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
  const [editEgresoModalOpen, setEditEgresoModalOpen] = useState(false);
  const [editEgresoForm, setEditEgresoForm] = useState({
    egreso_id: '',
    amount: '',
    date: '',
    description: '',
    category: '',
    currency: 'CLP',
    payment_method: 'efectivo',
    tags: ''
  });
  const [budgetIncreasesOpen, setBudgetIncreasesOpen] = useState(false);
  const [budgetIncreases, setBudgetIncreases] = useState([]);
  const [budgetIncreasesProject, setBudgetIncreasesProject] = useState(null);

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
  // handleChange para el monto a aumentar
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

  // Handler para mostrar detalle de egresos
  const handleVerDetalleEgresos = async (project) => {
    setLoading(true);
    setEgresosDetalleProyecto(project);
    try {
      const data = await endpoints.projects.getProjectEgresos(project.project_id);
      setEgresosDetalle(data || []);
      setEgresosDetalleOpen(true);
    } catch (error) {
      setErrorMessage('Error al obtener el detalle de egresos.');
    }
    setLoading(false);
  };
  // Abrir modal para editar egreso
  const openEditEgresoModal = (egreso) => {
    setEditEgresoForm({
      egreso_id: egreso.egreso_id || egreso.id || egreso.transaction_id,
      amount: egreso.monto || egreso.amount,
      date: egreso.fecha ? egreso.fecha.split('T')[0] : (egreso.date ? egreso.date.split('T')[0] : ''),
      description: egreso.descripcion || egreso.description,
      category: egreso.category || '',
      currency: egreso.currency || 'CLP',
      payment_method: egreso.payment_method || 'efectivo',
      tags: egreso.tags ? (Array.isArray(egreso.tags) ? egreso.tags.join(',') : egreso.tags) : ''
    });
    setEditEgresoModalOpen(true);
  };
  // Guardar edición de egreso
  const handleSubmitEditEgreso = async (e) => {
    e.preventDefault();
    if (!egresosDetalleProyecto || !editEgresoForm.egreso_id) return;
    setLoading(true);
    setErrorMessage('');
    try {
      await endpoints.projects.editEgreso({
        transactionId: editEgresoForm.egreso_id,
        projectId: egresosDetalleProyecto.project_id,
        amount: editEgresoForm.amount,
        date: editEgresoForm.date,
        description: editEgresoForm.description,
        category: editEgresoForm.category,
        currency: editEgresoForm.currency,
        payment_method: editEgresoForm.payment_method,
        tags: editEgresoForm.tags ? editEgresoForm.tags.split(',').map(tag => tag.trim()) : null
      });
      setEditEgresoModalOpen(false);
      // Refrescar detalle de egresos
      await handleVerDetalleEgresos(egresosDetalleProyecto);
      await fetchProjects(user.id);
    } catch (error) {
      setErrorMessage('Error al editar el egreso.');
    }
    setLoading(false);
  };
  // Eliminar egreso
const handleDeleteEgreso = async (egreso) => {
  if (!window.confirm('¿Seguro que deseas eliminar este egreso?')) return;
  setLoading(true);
  setErrorMessage('');
  try {
    await endpoints.projects.deleteEgreso({
      transactionId: egreso.egreso_id || egreso.id || egreso.transaction_id,
      projectId: egresosDetalleProyecto.project_id
    });
    await handleVerDetalleEgresos(egresosDetalleProyecto);
    await fetchProjects(user.id);
  } catch (error) {
    setErrorMessage('Error al eliminar el egreso.');
  }
  setLoading(false);
};

  // Handler para mostrar detalle de aumentos de presupuesto
  const handleVerDetalleAumentos = async (project) => {
    setLoading(true);
    setBudgetIncreasesProject(project);
    try {
      const data = await endpoints.projects.getProjectBudgetIncreases(project.project_id);
      setBudgetIncreases(data || []);
      setBudgetIncreasesOpen(true);
    } catch (error) {
      setErrorMessage('Error al obtener los aumentos de presupuesto.');
    }
    setLoading(false);
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
                <th>Aumentos Presupuesto</th>
                <th>Balance</th>
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
                  <td>
                    <div className="total-gastos-detalle">
                      <span>{project.total_gastos}</span>
                      <button
                        className="btn-detalles-gastos"
                        onClick={() => handleVerDetalleEgresos(project)}
                        title="Ver detalle de egresos"
                      >
                        Detalles
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="total-gastos-detalle">
                      <span>{project.total_aumentos_presupuesto}</span>
                      <button
                        className="btn-detalles-gastos"
                        onClick={() => handleVerDetalleAumentos(project)}
                        title="Ver detalle de aumentos"
                      >
                        Detalles
                      </button>
                    </div>
                  </td>
                  <td>{project.balance}</td>
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
      {/* Modal para detalle de egresos */}
      <CustomModal
        open={egresosDetalleOpen}
        onClose={() => setEgresosDetalleOpen(false)}
        title={
          egresosDetalleProyecto
            ? `Egresos de "${egresosDetalleProyecto.project_name}"`
            : 'Detalle de Egresos'
        }
      >
        <div style={{ maxHeight: 350, overflowY: 'auto' }}>
          {egresosDetalle.length === 0 ? (
            <p>No hay egresos registrados para este proyecto.</p>
          ) : (
            <table style={{ width: '100%', fontSize: 14 }}>
              <thead>
                <tr>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Responsable</th>
                </tr>
              </thead>
              <tbody>
                {egresosDetalle.map(e => (
                  <tr key={e.egreso_id || e.id || e.transaction_id}>
                    <td>{e.monto || e.amount}</td>
                    <td>{e.fecha ? e.fecha.split('T')[0] : (e.date ? e.date.split('T')[0] : '')}</td>
                    <td>{e.descripcion || e.description}</td>
                    <td>{e.category}</td>
                    <td>{e.responsable || e.user_name || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CustomModal>
      {/* Modal para detalle de egresos */}
      <CustomModal
        open={egresosDetalleOpen}
        onClose={() => setEgresosDetalleOpen(false)}
        title={
          egresosDetalleProyecto
            ? `Gastos de "${egresosDetalleProyecto.project_name}"`
            : 'Detalle de Gastos'
        }
      >
        <div style={{ maxHeight: 350, overflowY: 'auto' }}>
          {egresosDetalle.length === 0 ? (
            <p>No hay egresos registrados para este proyecto.</p>
          ) : (
            <table style={{ width: '100%', fontSize: 14 }}>
              <thead>
                <tr>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Responsable</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {egresosDetalle.map(e => (
                  <tr key={e.egreso_id || e.id || e.transaction_id}>
                    <td>{e.monto || e.amount}</td>
                    <td>{e.fecha ? e.fecha.split('T')[0] : (e.date ? e.date.split('T')[0] : '')}</td>
                    <td>{e.descripcion || e.description}</td>
                    <td>{e.category}</td>
                    <td>{e.responsable || e.user_name || ''}</td>
                    <td>
                      <button
                        style={{ fontSize: 12, padding: '4px 8px', marginRight: 4 }}
                        onClick={() => openEditEgresoModal(e)}
                      >
                        Editar
                      </button>
                      <button
                        style={{ fontSize: 12, padding: '4px 8px', background: '#e74c3c', color: '#fff' }}
                        onClick={() => handleDeleteEgreso(e)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CustomModal>

      {/* Modal para editar egreso */}
      <CustomModal open={editEgresoModalOpen} onClose={() => setEditEgresoModalOpen(false)} title="Editar Egreso">
        <form className="form-modal" onSubmit={handleSubmitEditEgreso}>
          <label>Monto:</label>
          <input
            name="amount"
            type="number"
            value={editEgresoForm.amount}
            onChange={e => setEditEgresoForm({ ...editEgresoForm, amount: e.target.value })}
            required
          />
          <label>Fecha:</label>
          <input
            name="date"
            type="date"
            value={editEgresoForm.date}
            onChange={e => setEditEgresoForm({ ...editEgresoForm, date: e.target.value })}
            required
          />
          <label>Descripción:</label>
          <textarea
            name="description"
            value={editEgresoForm.description}
            onChange={e => setEditEgresoForm({ ...editEgresoForm, description: e.target.value })}
            required
          />
          <label>Categoría:</label>
          <input
            name="category"
            value={editEgresoForm.category}
            onChange={e => setEditEgresoForm({ ...editEgresoForm, category: e.target.value })}
          />
          <label>Moneda:</label>
          <select
            name="currency"
            value={editEgresoForm.currency}
            onChange={e => setEditEgresoForm({ ...editEgresoForm, currency: e.target.value })}
          >
            <option value="CLP">CLP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BTC">BTC</option>
          </select>
          <label>Método de pago:</label>
          <select
            name="payment_method"
            value={editEgresoForm.payment_method}
            onChange={e => setEditEgresoForm({ ...editEgresoForm, payment_method: e.target.value })}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="otros">Otros</option>
          </select>
          <label>Tags (separados por coma):</label>
          <input
            name="tags"
            value={editEgresoForm.tags}
            onChange={e => setEditEgresoForm({ ...editEgresoForm, tags: e.target.value })}
          />
          <button type="submit" className="btn-guardar-proyecto" style={{ background: '#34495e', color: '#fff', marginTop: 12 }}>
            Guardar Cambios
          </button>
        </form>
      </CustomModal>

      {/* Modal para detalle de aumentos de presupuesto */}
      <CustomModal
        open={budgetIncreasesOpen}
        onClose={() => setBudgetIncreasesOpen(false)}
        title={
          budgetIncreasesProject
            ? `Aumentos de presupuesto de "${budgetIncreasesProject.project_name}"`
            : 'Detalle de Aumentos de Presupuesto'
        }
      >
        <div style={{ maxHeight: 350, overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {budgetIncreases.length === 0 ? (
            <p>No hay aumentos registrados para este proyecto.</p>
          ) : (
            <table className="tabla" style={{ width: 'auto', minWidth: 320, margin: '0 auto' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Monto</th>
                  <th style={{ textAlign: 'center' }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {budgetIncreases.map(inc => (
                  <tr key={inc.increase_id}>
                    <td style={{ textAlign: 'center' }}>{inc.amount}</td>
                    <td style={{ textAlign: 'center' }}>{inc.created_at ? inc.created_at.split('T')[0] : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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