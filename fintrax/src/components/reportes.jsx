import React, { useState } from 'react';
import '../styles/reportes.css';

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

  return (
    <div className="reportes-container">
      <h1>Reportes Financieros</h1>
      
      <section className="seccion-reportes">
        <h2>Personalización de reportes por país</h2>
        
        <div className="botones-reportes">
          <button 
            className="boton-gasto" 
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? 'Cancelar' : 'Nuevo Reporte'}
          </button>
        </div>

        {mostrarFormulario && (
          <div className="formulario-reporte">
            <h3>Crear Nuevo Reporte</h3>
            <div>
              <label>Firma:</label>
              <input
                type="text"
                name="firma"
                value={nuevoReporte.firma}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={nuevoReporte.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Sitio Web:</label>
              <input
                type="text"
                name="sitioWeb"
                value={nuevoReporte.sitioWeb}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={agregarReporte}>Guardar Reporte</button>
          </div>
        )}

        {reportes.map((reporte, index) => (
          <div key={reporte.id} className="reporte-fellow">
            <p><strong>Reporte {reporte.id}</strong></p>
            <p>Reporte correspondiente a:</p>
            <p><strong>Firma:</strong> "{reporte.firma}"</p>
            <p><strong>Email:</strong> {reporte.email}</p>
            <p><strong>Sitio web:</strong> {reporte.sitioWeb}</p>

            <div className="formulario-gasto">
              <h4>Agregar nuevo gasto</h4>
              <div>
                <label>Concepto:</label>
                <input
                  type="text"
                  name="concepto"
                  value={nuevoGasto.concepto}
                  onChange={handleGastoChange}
                />
              </div>
              <div>
                <label>Monto 1:</label>
                <input
                  type="number"
                  name="monto1"
                  value={nuevoGasto.monto1}
                  onChange={handleGastoChange}
                />
              </div>
              <div>
                <label>Monto 2:</label>
                <input
                  type="number"
                  name="monto2"
                  value={nuevoGasto.monto2}
                  onChange={handleGastoChange}
                />
              </div>
              <div>
                <label>Balance:</label>
                <input
                  type="number"
                  name="balance"
                  value={nuevoGasto.balance}
                  onChange={handleGastoChange}
                />
              </div>
              <button 
                onClick={() => {
                  setReporteSeleccionado(index);
                  agregarGasto();
                }}
              >
                Agregar Gasto
              </button>
            </div>

            <hr className="separador" />

            <div className="resultados">
              <h3>Resultados</h3>
              <ul>
                <li>Oficina de mandatos generales:</li>
              </ul>

              <div className="tabla-reportes">
                <table className="tabla-financiera">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Gastos</th>
                      <th>Gastos</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.gastos.map((gasto, i) => (
                      <tr key={i}>
                        <td>{gasto.concepto}</td>
                        <td>${gasto.monto1.toLocaleString()}</td>
                        <td>${gasto.monto2.toLocaleString()}</td>
                        <td>${gasto.balance.toLocaleString()}</td>
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