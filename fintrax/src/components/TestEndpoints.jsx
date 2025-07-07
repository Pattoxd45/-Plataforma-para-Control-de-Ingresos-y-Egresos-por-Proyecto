import React, { useState } from 'react';
import { endpoints, supabase } from './connections/endpoints';
import CustomModal from './modals/CustomModal ';
import '../styles/responsiveMedia.css';

function TestEndpoints({ user }) {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [egresoModalOpen, setEgresoModalOpen] = useState(false);
  const [egresos, setEgresos] = useState([]);
  const [egresosModalOpen, setEgresosModalOpen] = useState(false);
  const [editEgresoModalOpen, setEditEgresoModalOpen] = useState(false);
  const [ingresos, setIngresos] = useState([]);
  const [ingresosModalOpen, setIngresosModalOpen] = useState(false);
  const [financialOverview, setFinancialOverview] = useState([]);
  const [financialOverviewModalOpen, setFinancialOverviewModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [editIncreaseModalOpen, setEditIncreaseModalOpen] = useState(false);
  const [editIncreaseForm, setEditIncreaseForm] = useState({increaseId: '',projectId: '',amount: ''});
  const [increaseBudgetModalOpen, setIncreaseBudgetModalOpen] = useState(false);
  const [increaseBudgetForm, setIncreaseBudgetForm] = useState({projectId: '',amount: ''});
  const [budgetIncreases, setBudgetIncreases] = useState([]);
  const [budgetIncreasesModalOpen, setBudgetIncreasesModalOpen] = useState(false);

  const userId = user?.id;

  const handleGetProjectBudgetIncreases = async () => {
  if (!selectedProjectId) {
    setOutput('Selecciona un proyecto para ver sus aumentos de presupuesto.');
    return;
  }
  setLoading(true);
  try {
    const data = await endpoints.projects.getProjectBudgetIncreases(selectedProjectId);
    setBudgetIncreases(data || []);
    setBudgetIncreasesModalOpen(true);
    setOutput(JSON.stringify(data, null, 2));
  } catch (e) {
    setOutput(e.message);
  }
  setLoading(false);
};

  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    budget: '',
    deadline: '',
    status: 'activo'
  });
  const [egresoForm, setEgresoForm] = useState({
    amount: '',
    date: '',
    description: '',
    category: '',
    currency: 'CLP',
    payment_method: 'efectivo',
    tags: ''
  });
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
  //Obtener el resumen financiero de todos los proyectos
  const handleGetProjectFinancialOverview = async () => {
    setLoading(true);
    try {
      const data = await endpoints.projects.getProjectFinancialOverview(userId);
      setFinancialOverview(data || []);
      setFinancialOverviewModalOpen(true);
      setOutput(JSON.stringify(data, null, 2));
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };
  // Handler para obtener ingresos de un proyecto
  const handleGetProjectIngresos = async () => {
    if (!selectedProjectId) {
      setOutput('Selecciona un proyecto para ver sus ingresos.');
      return;
    }
    setLoading(true);
    try {
      const data = await endpoints.projects.getProjectIngresos(selectedProjectId);
      setIngresos([data] || []);
      setIngresosModalOpen(true);
      setOutput(JSON.stringify(data, null, 2));
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };
  // Handler para obtener ingresos de todos los proyectos del usuario
  const handleGetUserProjectsIngresos = async () => {
    setLoading(true);
    try {
      const data = await endpoints.projects.getUserProjectsIngresos(userId);
      setIngresos(data || []);
      setIngresosModalOpen(true);
      setOutput(JSON.stringify(data, null, 2));
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };
  // Handler para abrir el modal
  const openIncreaseBudgetModal = () => {
    setIncreaseBudgetForm({ projectId: '', amount: '' });
    setIncreaseBudgetModalOpen(true);
  };
  const handleIncreaseBudgetChange = e => setIncreaseBudgetForm({ ...increaseBudgetForm, [e.target.name]: e.target.value });
  // Handler para aumentar el presupuesto
  const handleSubmitIncreaseBudget = async (e) => {
    e.preventDefault();
    if (!increaseBudgetForm.projectId || !increaseBudgetForm.amount) {
      setOutput('Selecciona un proyecto y un monto válido.');
      return;
    }
    setLoading(true);
    try {
      await endpoints.projects.increaseProjectBudget({
        projectId: increaseBudgetForm.projectId,
        amount: increaseBudgetForm.amount,
        userId: userId
      });
      setOutput('Presupuesto aumentado correctamente.');
      setIncreaseBudgetModalOpen(false);
      handleGetUserProjectsSummary(); // Refrescar lista
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };
  // ==============================================
  // Abrir modal para crear
  // ==============================================
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
  // ==============================================
  // Abrir modal para editar
  // ==============================================
const openEditModal = async () => {
  if (!selectedProjectId) return;
  setEditMode(true);
  setLoading(true);
  try {
    const project = await endpoints.projects.getProjectDetails(selectedProjectId);
    setForm({
      id: project.project_id,
      name: project.nombre_proyecto,
      description: project.descripcion,
      budget: project.presupuesto_inicial,
      presupuesto_actual: project.presupuesto_actual, // nuevo campo solo lectura
      deadline: project.fecha_termino ? project.fecha_termino.split('T')[0] : '',
      status: 'activo',
    });
    setModalOpen(true);
  } catch (e) {
    setOutput(e.message);
  }
  setLoading(false);
};
  // ==============================================
  // Abrir modal para Editar egreso
  // ==============================================
  const openEditEgresoModal = (egreso) => {
    setEditEgresoForm({
      egreso_id: egreso.egreso_id,
      amount: egreso.monto,
      date: egreso.fecha,
      description: egreso.descripcion,
      category: egreso.category || '',
      currency: egreso.currency || 'CLP',
      payment_method: egreso.payment_method || 'efectivo',
      tags: egreso.tags ? egreso.tags.join(',') : ''
    });
    setEditEgresoModalOpen(true);
  }; 
  // ==============================================
  // Abrir modal para agregar egreso
  // ==============================================
  const openEgresoModal = () => {
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
  // ==============================================
  // Handler para crear o editar proyecto
  // ==============================================
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode && form.id) {
        await endpoints.projects.updateProject({
          id: form.id,
          user_id: userId,
          name: form.name,
          description: form.description,
          budget: Number(form.budget),
          deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
          status: form.status
        });
        setOutput('Proyecto actualizado correctamente');
      } else {
        const { data, error } = await supabase.rpc('create_project', {
          p_user_id: userId,
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
      handleGetUserProjectsSummary(); // Refrescar lista
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };
  // ==============================================
  // Eliminar (soft-delete) proyecto seleccionado
  // ==============================================
  const handleDeleteProject = async () => {
    if (!selectedProjectId || !userId) {
      setOutput('Selecciona un proyecto para eliminar.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.rpc('soft_delete_project', {
        p_project_id: selectedProjectId,
        p_user_id: userId,
        p_reason: 'Eliminado desde TestEndpoints'
      });
      if (error) throw error;
      setOutput('Proyecto eliminado (soft-delete) correctamente.');
      setSelectedProjectId('');
      handleGetUserProjectsSummary(); // Refrescar lista
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };
  // ======================================================
  // Handler para obtener egresos del proyecto seleccionado
  // ======================================================
  const handleGetProjectEgresos = async () => {
    if (!selectedProjectId) {
      setOutput('Selecciona un proyecto para ver sus egresos.');
      return;
    }
    setLoading(true);
    try {
      const data = await endpoints.projects.getProjectEgresos(selectedProjectId);
      setEgresos(data || []);
      setEgresosModalOpen(true);
      setOutput(JSON.stringify(data, null, 2));
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };
  // =========================================================
  // Handler para editar egreso
  // =========================================================
  const handleSubmitEditEgreso = async (e) => {
    e.preventDefault();
    if (!selectedProjectId || !editEgresoForm.egreso_id) {
      setOutput('Selecciona un egreso para editar.');
      return;
    }
    setLoading(true);
    try {
      await endpoints.projects.editEgreso({
        transactionId: editEgresoForm.egreso_id,
        projectId: selectedProjectId,
        amount: editEgresoForm.amount,
        date: editEgresoForm.date,
        description: editEgresoForm.description,
        category: editEgresoForm.category,
        currency: editEgresoForm.currency,
        payment_method: editEgresoForm.payment_method,
        tags: editEgresoForm.tags ? editEgresoForm.tags.split(',').map(tag => tag.trim()) : null
      });
      setOutput('Egreso editado correctamente.');
      setEditEgresoModalOpen(false);
      handleGetProjectEgresos();
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };
  const handleEditEgresoChange = e => setEditEgresoForm({ ...editEgresoForm, [e.target.name]: e.target.value });

  // ===========================
  // Handler para agregar egreso
  // ===========================
  const handleSubmitEgreso = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setOutput('Selecciona un proyecto para agregar egresos.');
      return;
    }
    setLoading(true);
    try {
      // Usar el endpoint centralizado
      const data = await endpoints.projects.addEgreso({
        projectId: selectedProjectId,
        amount: egresoForm.amount,
        date: egresoForm.date,
        description: egresoForm.description,
        category: egresoForm.category,
        currency: egresoForm.currency,
        payment_method: egresoForm.payment_method,
        tags: egresoForm.tags ? egresoForm.tags.split(',').map(tag => tag.trim()) : null
      });
      setOutput(`Egreso agregado correctamente. ID: ${data}`);
      setEgresoModalOpen(false);
      handleGetUserProjectsSummary(); // Refrescar lista
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };
  // =========================================================
  // Handlers para guardar edicion de incremento de presupuesto
  // =========================================================
  const handleSubmitEditIncrease = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log('Edit Increase Form:', editIncreaseForm);
    console.log('Enviando a editProjectBudgetIncrease:', {
    increaseId: editIncreaseForm.increaseId,
    projectId: editIncreaseForm.projectId,
    amount: editIncreaseForm.amount,
    userId: userId
  });
    try {
      await endpoints.projects.editProjectBudgetIncrease({
        increaseId: editIncreaseForm.increaseId,
        projectId: editIncreaseForm.projectId,
        amount: editIncreaseForm.amount,
        userId: userId
      });
      setOutput('Aumento de presupuesto editado correctamente.');
      setEditIncreaseModalOpen(false);
      handleGetProjectIngresos(); // refresca ingresos del proyecto
    } catch (e) {
      setOutput(e.message);
    }
    setLoading(false);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEgresoChange = e => setEgresoForm({ ...egresoForm, [e.target.name]: e.target.value });


  // =========================================================
  // Abrir modal para editar aumento de presupuesto
  // =========================================================
  const openEditIncreaseModal = (increase) => {
    setEditIncreaseForm({
      increaseId: increase.increase_id,
      projectId: increase.project_id,
      amount: increase.amount
    });
    setEditIncreaseModalOpen(true);
  };

  // =========================================================
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
          onClick={handleGetProjectFinancialOverview}
          className="test-endpoints-btn"
          style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 12, background: '#8e44ad', color: '#fff' }}
          disabled={loading}
        >
          Ver Resumen Financiero de Proyectos
        </button>
        <button
          onClick={openCreateModal}
          className="test-endpoints-btn"
          style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 12 }}
        >
          Crear nuevo proyecto (modal)
        </button>
        <button
          onClick={openIncreaseBudgetModal}
          className="test-endpoints-btn"
          style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 12, background: '#f39c12', color: '#fff' }}
          disabled={loading || projects.length === 0}
        >
          Aumentar Presupuesto
        </button>
        <button
          onClick={handleGetProjectIngresos}
          className="test-endpoints-btn"
          style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 12, background: '#16a085', color: '#fff' }}
          disabled={!selectedProjectId || loading}
        >
          Ver Ingresos del Proyecto
        </button>
        <button
          onClick={handleGetUserProjectsIngresos}
          className="test-endpoints-btn"
          style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 12, background: '#2980b9', color: '#fff' }}
          disabled={loading || !userId}
        >
          Ver Ingresos de Todos Mis Proyectos
        </button>
        <button
          onClick={handleGetProjectBudgetIncreases}
          className="test-endpoints-btn"
          style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 12, background: '#f1c40f', color: '#fff' }}
          disabled={!selectedProjectId || loading}
        >
          Ver Aumentos de Presupuesto
        </button>
        <button
          onClick={async () => {
            setLoading(true);
            try {
              const data = await endpoints.projects.getArchivedProjectsSummary();
              setOutput(JSON.stringify(data, null, 2));
            } catch (e) {
              setOutput(e.message);
            }
            setLoading(false);
          }}
          className="test-endpoints-btn"
          style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 12, background: '#7f8c8d', color: '#fff' }}
          disabled={loading}
        >
          Ver Todos los Proyectos Archivados (ingresos)
        </button>
        <button
          onClick={async () => {
            setLoading(true);
            try {
              const data = await endpoints.projects.getUserArchivedProjectsSummary(userId);
              setOutput(JSON.stringify(data, null, 2));
            } catch (e) {
              setOutput(e.message);
            }
            setLoading(false);
          }}
          className="test-endpoints-btn"
          style={{ width: '100%', padding: 12, fontSize: 16, marginBottom: 12, background: '#34495e', color: '#fff' }}
          disabled={loading || !userId}
        >
          Ver Mis Proyectos Archivados (ingresos)
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            style={{ width: '40%' }}
            disabled={projects.length === 0}
          >
            <option value="">-- Selecciona proyecto --</option>
            {projects.map(p => (
              <option key={p.project_id} value={p.project_id}>
                {p.project_name}
              </option>
            ))}
          </select>
          <button
            onClick={openEditModal}
            className="test-endpoints-btn"
            style={{ width: '20%', padding: 12, fontSize: 16 }}
            disabled={!selectedProjectId}
          >
            Editar
          </button>
          <button
            onClick={handleDeleteProject}
            className="test-endpoints-btn"
            style={{ width: '20%', padding: 12, fontSize: 16, background: '#e74c3c', color: '#fff' }}
            disabled={!selectedProjectId || loading}
          >
            Eliminar
          </button>
          <button
            onClick={openEgresoModal}
            className="test-endpoints-btn"
            style={{ width: '20%', padding: 12, fontSize: 16, background: '#27ae60', color: '#fff' }}
            disabled={!selectedProjectId}
          >
            Agregar Egreso
          </button>
          <button
            onClick={handleGetProjectEgresos}
            className="test-endpoints-btn"
            style={{ width: '20%', padding: 12, fontSize: 16, background: '#2980b9', color: '#fff' }}
            disabled={!selectedProjectId}
          >
            Ver Egresos
          </button>
        </div>
      </div>
      {/* Modals */}
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
            <label>Presupuesto Inicial:</label>
            <input
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label>Presupuesto Actual:</label>
            <input
              name="presupuesto_actual"
              type="number"
              value={form.presupuesto_actual}
              readOnly
              disabled
              style={{ width: '100%', background: '#eee' }}
            />
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
      <CustomModal open={egresoModalOpen} onClose={() => setEgresoModalOpen(false)} title="Agregar Egreso">
        <form className="test-endpoints-form" onSubmit={handleSubmitEgreso}>
          <div>
            <label>Monto:</label>
            <input name="amount" type="number" value={egresoForm.amount} onChange={handleEgresoChange} required style={{ width: '100%' }} />
          </div>
          <div>
            <label>Fecha:</label>
            <input name="date" type="date" value={egresoForm.date} onChange={handleEgresoChange} required style={{ width: '100%' }} />
          </div>
          <div>
            <label>Descripción:</label>
            <textarea name="description" value={egresoForm.description} onChange={handleEgresoChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label>Categoría:</label>
            <input name="category" value={egresoForm.category} onChange={handleEgresoChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label>Moneda:</label>
            <select name="currency" value={egresoForm.currency} onChange={handleEgresoChange} style={{ width: '100%' }}>
              <option value="CLP">CLP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="BTC">BTC</option>
            </select>
          </div>
          <div>
            <label>Método de pago:</label>
            <select name="payment_method" value={egresoForm.payment_method} onChange={handleEgresoChange} style={{ width: '100%' }}>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <div>
            <label>Tags (separados por coma):</label>
            <input name="tags" value={egresoForm.tags} onChange={handleEgresoChange} style={{ width: '100%' }} />
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: 16, width: '100%' }}>
            {loading ? 'Agregando...' : 'Agregar Egreso'}
          </button>

        </form>
      </CustomModal>
      <CustomModal open={egresosModalOpen} onClose={() => setEgresosModalOpen(false)} title="Egresos del Proyecto">
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {egresos.length === 0 ? (
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
                {egresos.map(e => (
                  <tr key={e.egreso_id}>
                    <td>{e.monto}</td>
                    <td>{e.fecha}</td>
                    <td>{e.descripcion}</td>
                    <td>{e.category}</td>
                    <td>{e.responsable}</td>
                    <td>
                      <button
                        style={{ fontSize: 12, padding: '4px 8px' }}
                        onClick={() => openEditEgresoModal(e)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CustomModal>
      <CustomModal open={editEgresoModalOpen} onClose={() => setEditEgresoModalOpen(false)} title="Editar Egreso">
        <form className="test-endpoints-form" onSubmit={handleSubmitEditEgreso}>
          <div>
            <label>Monto:</label>
            <input name="amount" type="number" value={editEgresoForm.amount} onChange={handleEditEgresoChange} required style={{ width: '100%' }} />
          </div>
          <div>
            <label>Fecha:</label>
            <input name="date" type="date" value={editEgresoForm.date} onChange={handleEditEgresoChange} required style={{ width: '100%' }} />
          </div>
          <div>
            <label>Descripción:</label>
            <textarea name="description" value={editEgresoForm.description} onChange={handleEditEgresoChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label>Categoría:</label>
            <input name="category" value={editEgresoForm.category} onChange={handleEditEgresoChange} style={{ width: '100%' }} />
          </div>
          <div>
            <label>Moneda:</label>
            <select name="currency" value={editEgresoForm.currency} onChange={handleEditEgresoChange} style={{ width: '100%' }}>
              <option value="CLP">CLP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="BTC">BTC</option>
            </select>
          </div>
          <div>
            <label>Método de pago:</label>
            <select name="payment_method" value={editEgresoForm.payment_method} onChange={handleEditEgresoChange} style={{ width: '100%' }}>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <div>
            <label>Tags (separados por coma):</label>
            <input name="tags" value={editEgresoForm.tags} onChange={handleEditEgresoChange} style={{ width: '100%' }} />
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: 16, width: '100%' }}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </CustomModal>
      <CustomModal open={ingresosModalOpen} onClose={() => setIngresosModalOpen(false)} title="Ingresos de tus Proyectos">
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {ingresos.length === 0 ? (
            <p>No hay ingresos registrados para tus proyectos.</p>
          ) : (
            <table style={{ width: '100%', fontSize: 14 }}>
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Monto Ingreso</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Responsable</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.map(i => (
                  <tr key={i.project_id}>
                    <td>{i.proyecto}</td>
                    <td>{i.monto}</td>
                    <td>{i.fecha}</td>
                    <td>{i.descripcion}</td>
                    <td>{i.responsable}</td>
                    <td>
                      <button
                        style={{ fontSize: 12, padding: '4px 8px' }}
                        onClick={() => openEditIncreaseModal(i)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CustomModal>
      <CustomModal open={financialOverviewModalOpen} onClose={() => setFinancialOverviewModalOpen(false)} title="Resumen Financiero de Proyectos">
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {financialOverview.length === 0 ? (
            <p>No hay datos de resumen financiero.</p>
          ) : (
            <table style={{ width: '100%', fontSize: 14 }}>
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Presupuesto Inicial</th>
                  <th>Gastos</th>
                  <th>Total Aumentos</th>
                  <th>Presupuesto Actual</th>
                  <th>Fecha Término</th>
                  <th>Categorías</th>
                  <th>Responsable</th>
                </tr>
              </thead>
              <tbody>
                {financialOverview.map(f => (
                  <tr key={f.project_id}>
                    <td>{f.nombre_proyecto}</td>
                    <td>{f.presupuesto_inicial}</td>
                    <td>{f.gastos}</td>
                    <td>{f.total_aumentos_presupuesto}</td>
                    <td>{f.presupuesto_actual}</td>
                    <td>{f.fecha_termino ? f.fecha_termino.split('T')[0] : ''}</td>
                    <td>{f.categorias}</td>
                    <td>{f.responsable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CustomModal>
      <CustomModal open={increaseBudgetModalOpen} onClose={() => setIncreaseBudgetModalOpen(false)} title="Aumentar Presupuesto del Proyecto">
        <form className="test-endpoints-form" onSubmit={handleSubmitIncreaseBudget}>
          <div>
            <label>Proyecto:</label>
            <select
              name="projectId"
              value={increaseBudgetForm.projectId}
              onChange={handleIncreaseBudgetChange}
              required
              style={{ width: '100%' }}
            >
              <option value="">-- Selecciona proyecto --</option>
              {projects.map(p => (
                <option key={p.project_id} value={p.project_id}>
                  {p.project_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Monto a aumentar:</label>
            <input
              name="amount"
              type="number"
              min="1"
              value={increaseBudgetForm.amount}
              onChange={handleIncreaseBudgetChange}
              required
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: 16, width: '100%' }}>
            {loading ? 'Aumentando...' : 'Aumentar Presupuesto'}
          </button>
        </form>
      </CustomModal>
      <CustomModal open={editIncreaseModalOpen} onClose={() => setEditIncreaseModalOpen(false)} title="Editar Aumento de Presupuesto">
        <form className="test-endpoints-form" onSubmit={handleSubmitEditIncrease}>
          <div>
            <label>Monto:</label>
            <input
              name="amount"
              type="number"
              value={editIncreaseForm.amount}
              onChange={e => setEditIncreaseForm({ ...editIncreaseForm, amount: e.target.value })}
              required
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: 16, width: '100%' }}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </CustomModal>
      <CustomModal open={budgetIncreasesModalOpen} onClose={() => setBudgetIncreasesModalOpen(false)} title="Aumentos de Presupuesto del Proyecto">
  <div style={{ maxHeight: 400, overflowY: 'auto' }}>
    {budgetIncreases.length === 0 ? (
      <p>No hay aumentos registrados para este proyecto.</p>
    ) : (
      <table style={{ width: '100%', fontSize: 14 }}>
        <thead>
          <tr>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {budgetIncreases.map(inc => (
            <tr key={inc.increase_id}>
              <td>{inc.amount}</td>
              <td>{inc.created_at ? inc.created_at.split('T')[0] : ''}</td>
              <td>
                <button
                  style={{ fontSize: 12, padding: '4px 8px' }}
                  onClick={() => openEditIncreaseModal(inc)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
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