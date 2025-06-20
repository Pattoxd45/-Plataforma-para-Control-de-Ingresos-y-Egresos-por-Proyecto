import React, { useState } from 'react';
import '../styles/reportes.css';
import { FaFileExcel, FaPlus, FaTrash, FaEdit, FaChartBar } from 'react-icons/fa';

const Reportes = () => {
  const [reportes, setReportes] = useState([
    {
      id: 1,
      firma: "Gordon Foley",
      email: "fellowreport@fellowreport.com",
      sitioWeb: "www.fellowreport.com",
      gastos: [
        { concepto: "Por Pagar A", monto1: 1500000, monto2: 750000, balance: 750000 },
        { concepto: "Por Pagar B", monto1: 800000, monto2: 900000, balance: 900000 },
        { concepto: "Por Pagar C", monto1: 1400000, monto2: 1400000, balance: 0 }
      ]
    }
  ]);

  const [nuevoReporte, setNuevoReporte] = useState({
    firma: "",
    email: "",
    sitioWeb: ""
  });

  const [nuevoGasto, setNuevoGasto] = useState({
    concepto: "",
    monto1: "",
    monto2: "",
    balance: ""
  });

  const [reporteSeleccionado, setReporteSeleccionado] = useState(0);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoReporte(prev => ({ ...prev, [name]: value }));
  };

  const handleGastoChange = (e) => {
    const { name, value } = e.target;
    setNuevoGasto(prev => ({ ...prev, [name]: value }));
  };

  const agregarReporte = () => {
    if (nuevoReporte.firma && nuevoReporte.email) {
      const nuevo = {
        id: reportes.length + 1,
        firma: nuevoReporte.firma,
        email: nuevoReporte.email,
        sitioWeb: nuevoReporte.sitioWeb,
        gastos: []
      };
      setReportes([...reportes, nuevo]);
      setNuevoReporte({ firma: "", email: "", sitioWeb: "" });
      setMostrarFormulario(false);
    }
  };

  const agregarGasto = () => {
    if (nuevoGasto.concepto && reporteSeleccionado >= 0) {
      const gasto = {
        concepto: nuevoGasto.concepto,
        monto1: parseFloat(nuevoGasto.monto1),
        monto2: parseFloat(nuevoGasto.monto2),
        balance: parseFloat(nuevoGasto.balance)
      };
      
      const reportesActualizados = [...reportes];
      reportesActualizados[reporteSeleccionado].gastos.push(gasto);
      setReportes(reportesActualizados);
      setNuevoGasto({ concepto: "", monto1: "", monto2: "", balance: "" });
    }
  };

  const eliminarReporte = (id) => {
    setReportes(reportes.filter(reporte => reporte.id !== id));
  };

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h1 className="reportes-titulo">Reportes Financieros</h1>
        <p className="reportes-subtitulo">Personalización de reportes por país y empresa</p>
      </div>
      
      <section className="reportes-seccion">
        <div className="reportes-acciones">
          <button 
            className="reportes-boton reportes-boton-primario"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            <FaPlus /> {mostrarFormulario ? 'Cancelar' : 'Nuevo Reporte'}
          </button>
          <button className="reportes-boton reportes-boton-secundario">
            <FaFileExcel /> Exportar a Excel
          </button>
        </div>

        {mostrarFormulario && (
          <div className="reportes-formulario">
            <h3 className="reportes-formulario-titulo">
              <FaPlus /> Crear Nuevo Reporte
            </h3>
            <div className="reportes-formulario-grupo">
              <label>Firma:</label>
              <input
                type="text"
                name="firma"
                value={nuevoReporte.firma}
                onChange={handleInputChange}
                placeholder="Nombre de la firma"
              />
            </div>
            <div className="reportes-formulario-grupo">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={nuevoReporte.email}
                onChange={handleInputChange}
                placeholder="Correo electrónico"
              />
            </div>
            <div className="reportes-formulario-grupo">
              <label>Sitio Web:</label>
              <input
                type="text"
                name="sitioWeb"
                value={nuevoReporte.sitioWeb}
                onChange={handleInputChange}
                placeholder="URL del sitio web"
              />
            </div>
            <button 
              className="reportes-boton reportes-boton-primario"
              onClick={agregarReporte}
            >
              Guardar Reporte
            </button>
          </div>
        )}

        {reportes.map((reporte, index) => (
          <div key={reporte.id} className="reportes-tarjeta">
            <div className="reportes-cabecera">
              <h3 className="reportes-encabezado">
                Reporte #{reporte.id} - {reporte.firma}
              </h3>
              <button 
                className="reportes-boton-icono"
                onClick={() => eliminarReporte(reporte.id)}
              >
                <FaTrash />
              </button>
            </div>
            
            <div className="reportes-info">
              <p><strong>Correo electrónico:</strong> {reporte.email}</p>
              <p><strong>Sitio web:</strong> {reporte.sitioWeb}</p>
            </div>

            <div className="reportes-formulario-gasto">
              <h4 className="reportes-subtitulo">
                <FaPlus /> Agregar nuevo gasto
              </h4>
              <div className="reportes-formulario-fila">
                <div className="reportes-formulario-grupo">
                  <label>Concepto:</label>
                  <input
                    type="text"
                    name="concepto"
                    value={nuevoGasto.concepto}
                    onChange={handleGastoChange}
                    placeholder="Descripción del gasto"
                  />
                </div>
                <div className="reportes-formulario-grupo">
                  <label>Monto 1:</label>
                  <input
                    type="number"
                    name="monto1"
                    value={nuevoGasto.monto1}
                    onChange={handleGastoChange}
                    placeholder="Monto inicial"
                  />
                </div>
              </div>
              <div className="reportes-formulario-fila">
                <div className="reportes-formulario-grupo">
                  <label>Monto 2:</label>
                  <input
                    type="number"
                    name="monto2"
                    value={nuevoGasto.monto2}
                    onChange={handleGastoChange}
                    placeholder="Monto secundario"
                  />
                </div>
                <div className="reportes-formulario-grupo">
                  <label>Balance:</label>
                  <input
                    type="number"
                    name="balance"
                    value={nuevoGasto.balance}
                    onChange={handleGastoChange}
                    placeholder="Balance resultante"
                  />
                </div>
              </div>
              <button 
                className="reportes-boton reportes-boton-primario"
                onClick={() => {
                  setReporteSeleccionado(index);
                  agregarGasto();
                }}
              >
                Agregar Gasto
              </button>
            </div>

            <div className="reportes-resultados">
              <h3 className="reportes-subtitulo">
                <FaChartBar /> Resultados Financieros
              </h3>
              
              <div className="reportes-tabla-contenedor">
                <table className="reportes-tabla">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Gastos (1)</th>
                      <th>Gastos (2)</th>
                      <th>Balance</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.gastos.map((gasto, i) => (
                      <tr key={i}>
                        <td>{gasto.concepto}</td>
                        <td>${gasto.monto1.toLocaleString()}</td>
                        <td>${gasto.monto2.toLocaleString()}</td>
                        <td className={
                          gasto.balance > 0 ? 'reportes-balance-positivo' : 
                          gasto.balance < 0 ? 'reportes-balance-negativo' : ''
                        }>
                          ${gasto.balance.toLocaleString()}
                        </td>
                        <td>
                          <button className="reportes-boton-icono">
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Reportes;