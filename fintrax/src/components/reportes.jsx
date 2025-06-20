// components/reportes.jsx
import React from 'react';
import '../styles/reportes.css';

const Reportes = () => {
  return (
    <div className="reportes-container">
      <h1>Reports Financieros</h1>
      
      <section className="reportes-section">
        <h2>Country Financial reporting personalization</h2>
        
        <div className="reportes-fellow">
          <p><strong>Fellow Reports</strong></p>
          <p>Report during:</p>
          <p><strong>Signature:</strong> "Gordon Foley"</p>
          <p><strong>Email:</strong> fellowreport@fellowreport.com</p>
          <p><strong>Website:</strong> www.fellowreport.com</p>
        </div>

        <hr className="reportes-separador" />

        <div className="reportes-resultados">
          <h3>Resultados</h3>
          <ul>
            <li>Office de mandatos generales que:</li>
          </ul>

          <div className="reportes-tabla-container">
            <table className="reportes-tabla">
              <thead>
                <tr>
                  <th>Expenses</th>
                  <th>Expenses</th>
                  <th>Expenses</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Payable A</td>
                  <td>$1,500,000</td>
                  <td>$750,000</td>
                  <td>$750,000</td>
                </tr>
                <tr>
                  <td>Payable B</td>
                  <td>$800,000</td>
                  <td>$900,000</td>
                  <td>$900,000</td>
                </tr>
                <tr>
                  <td>Payable C</td>
                  <td>$1,400,000</td>
                  <td>$1,400,000</td>
                  <td>$0.00%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="reportes-botones">
            <button className="reportes-boton">Expense 2023</button>
            <button className="reportes-boton">Expense 201</button>
            <button className="reportes-boton">Expense</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reportes;