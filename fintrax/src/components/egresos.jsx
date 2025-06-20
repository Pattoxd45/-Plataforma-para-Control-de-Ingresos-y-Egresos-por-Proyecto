import React, { useState } from 'react';
import '../styles/egresos.css';

const Egresos = () => {
  // Estados para el formulario de nuevo egreso
  const [nuevoEgreso, setNuevoEgreso] = useState({
    empresa: '',
    modeloNegocio: '',
    usoEspecifico: '',
    categoria: '',
    sistemasValores: '',
    distribucionGeografica: '',
    monto: '',
    fecha: '',
    descripcion: ''
  });

  // Estado para búsqueda de empresas
  const [busquedaEmpresa, setBusquedaEmpresa] = useState('');
  const [empresasEncontradas, setEmpresasEncontradas] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Estado para filtros
  const [filtros, setFiltros] = useState({
    categoria: '',
    fechaInicio: '',
    fechaFin: '',
    montoMinimo: '',
    montoMaximo: ''
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoEgreso(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Buscar empresas
  const buscarEmpresas = () => {
    // Aquí iría la llamada a la API para buscar empresas
    // Ejemplo simulado:
    const resultadosSimulados = [
      { id: 1, nombre: 'Empresa Ejemplo 1', ruc: '12345678901' },
      { id: 2, nombre: 'Empresa Ejemplo 2', ruc: '98765432109' }
    ];
    setEmpresasEncontradas(resultadosSimulados);
    setMostrarResultados(true);
  };

  // Seleccionar empresa de los resultados
  const seleccionarEmpresa = (empresa) => {
    setNuevoEgreso(prev => ({
      ...prev,
      empresa: empresa.nombre
    }));
    setMostrarResultados(false);
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación básica
    if (!nuevoEgreso.empresa || !nuevoEgreso.monto || !nuevoEgreso.fecha) {
      alert('Por favor complete los campos obligatorios');
      return;
    }
    
    // Aquí iría la llamada a la API para registrar el egreso
    console.log('Egreso a registrar:', nuevoEgreso);
    alert('Egreso registrado exitosamente');
    
    // Limpiar formulario después del envío
    setNuevoEgreso({
      empresa: '',
      modeloNegocio: '',
      usoEspecifico: '',
      categoria: '',
      sistemasValores: '',
      distribucionGeografica: '',
      monto: '',
      fecha: '',
      descripcion: ''
    });
  };

  // Aplicar filtros
  const aplicarFiltros = () => {
    // Aquí iría la llamada a la API con los filtros aplicados
    console.log('Filtros aplicados:', filtros);
    alert('Filtros aplicados correctamente');
  };

  return (
    <div className="egresos-container">
      <div className="egresos-header">
        <h1 className="egresos-titulo">Egresos</h1>
        <p className="egresos-subtitulo">Gestión del patrimonio público por empresas</p>
      </div>
      
      <section className="egresos-seccion">
        <div className="egresos-tarjeta">
          <h2 className="egresos-encabezado">Registro de Egresos</h2>
          
          <div className="egresos-contenido">
            <div className="nuevo-egreso">
              <h3 className="egresos-subtitulo-tarjeta">Nuevo Egreso</h3>
              <p className="egresos-descripcion">Complete los siguientes campos para registrar un nuevo egreso:</p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="buscarEmpresa">Buscar Empresa:</label>
                  <div className="busqueda-empresa">
                    <input
                      type="text"
                      id="buscarEmpresa"
                      value={busquedaEmpresa}
                      onChange={(e) => setBusquedaEmpresa(e.target.value)}
                      placeholder="Ingrese nombre o RUC"
                    />
                    <button type="button" onClick={buscarEmpresas}>Buscar</button>
                  </div>
                  {mostrarResultados && (
                    <div className="resultados-busqueda">
                      {empresasEncontradas.length > 0 ? (
                        <ul>
                          {empresasEncontradas.map(empresa => (
                            <li key={empresa.id} onClick={() => seleccionarEmpresa(empresa)}>
                              {empresa.nombre} - {empresa.ruc}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No se encontraron empresas</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="empresa">Empresa seleccionada:</label>
                  <input
                    type="text"
                    id="empresa"
                    name="empresa"
                    value={nuevoEgreso.empresa}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modeloNegocio">Modelo de Negocio:</label>
                  <input
                    type="text"
                    id="modeloNegocio"
                    name="modeloNegocio"
                    value={nuevoEgreso.modeloNegocio}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="usoEspecifico">Uso Específico:</label>
                  <textarea
                    id="usoEspecifico"
                    name="usoEspecifico"
                    value={nuevoEgreso.usoEspecifico}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoria">Categoría:</label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={nuevoEgreso.categoria}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="servicios">Servicios</option>
                    <option value="bienes">Bienes</option>
                    <option value="obras">Obras</option>
                    <option value="consultorias">Consultorías</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="monto">Monto:</label>
                    <input
                      type="number"
                      id="monto"
                      name="monto"
                      value={nuevoEgreso.monto}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="fecha">Fecha:</label>
                    <input
                      type="date"
                      id="fecha"
                      name="fecha"
                      value={nuevoEgreso.fecha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion">Descripción:</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={nuevoEgreso.descripcion}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <button type="submit" className="btn-primary">Registrar Egreso</button>
              </form>
            </div>

            <hr className="egresos-separador" />

            <div className="funcionalidades">
              <h3 className="egresos-subtitulo-tarjeta">Filtros y Búsqueda</h3>
              
              <div className="filtros-container">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="filtroCategoria">Categoría:</label>
                    <select
                      id="filtroCategoria"
                      name="categoria"
                      value={filtros.categoria}
                      onChange={handleFilterChange}
                    >
                      <option value="">Todas</option>
                      <option value="servicios">Servicios</option>
                      <option value="bienes">Bienes</option>
                      <option value="obras">Obras</option>
                      <option value="consultorias">Consultorías</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="fechaInicio">Fecha Inicio:</label>
                    <input
                      type="date"
                      id="fechaInicio"
                      name="fechaInicio"
                      value={filtros.fechaInicio}
                      onChange={handleFilterChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="fechaFin">Fecha Fin:</label>
                    <input
                      type="date"
                      id="fechaFin"
                      name="fechaFin"
                      value={filtros.fechaFin}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="montoMinimo">Monto Mínimo:</label>
                    <input
                      type="number"
                      id="montoMinimo"
                      name="montoMinimo"
                      value={filtros.montoMinimo}
                      onChange={handleFilterChange}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="montoMaximo">Monto Máximo:</label>
                    <input
                      type="number"
                      id="montoMaximo"
                      name="montoMaximo"
                      value={filtros.montoMaximo}
                      onChange={handleFilterChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <button type="button" onClick={aplicarFiltros} className="btn-secondary">
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Egresos;