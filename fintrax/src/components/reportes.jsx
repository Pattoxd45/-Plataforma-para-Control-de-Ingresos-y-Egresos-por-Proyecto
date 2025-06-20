import React from 'react';
import '../styles/reportes.css';

const Reportes = () => {
  return (
    <div className="reportes-container">
      <h1>Reportes Financieros</h1>
      
      <section className="seccion-reportes">
        <h2>Personalización de reportes por país</h2>
        
        <div className="reporte-fellow">
          <p><strong>Reportes Fellow</strong></p>
          <p>Reporte correspondiente a:</p>
          <p><strong>Firma:</strong> "Gordon Foley"</p>
          <p><strong>Email:</strong> fellowreport@fellowreport.com</p>
          <p><strong>Sitio web:</strong> www.fellowreport.com</p>
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
                  <th>Gastos</th>
                  <th>Gastos</th>
                  <th>Gastos</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Por Pagar A</td>
                  <td>$1,500,000</td>
                  <td>$750,000</td>
                  <td>$750,000</td>
                </tr>
                <tr>
                  <td>Por Pagar B</td>
                  <td>$800,000</td>
                  <td>$900,000</td>
                  <td>$900,000</td>
                </tr>
                <tr>
                  <td>Por Pagar C</td>
                  <td>$1,400,000</td>
                  <td>$1,400,000</td>
                  <td>$0.00%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="botones-reportes">
            <button className="boton-gasto">Gasto 2023</button>
            <button className="boton-gasto">Gasto 2021</button>
            <button className="boton-gasto">Gasto</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reportes;