import React from 'react';
import '../styles/reportes.css';

const Reportes = () => {
  // Datos de ejemplo para la tabla
  const reportData = [
    { id: 1, proyecto: 'Proyecto A', ingresos: 1500000, egresos: 750000, balance: 750000 },
    { id: 2, proyecto: 'Proyecto B', ingresos: 800000, egresos: 500000, balance: 300000 },
    { id: 3, proyecto: 'Proyecto C', ingresos: 2000000, egresos: 1800000, balance: 200000 }
  ];

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h1>Reportes Financieros</h1>
        <p className="reportes-subtitulo">Genera y visualiza reportes personalizados</p>
      </div>
      
      <div className="reportes-filtros">
        <h2>Filtrar Reporte</h2>
        <form>
          <div className="form-group">
            <label>Rango de fechas</label>
            <div className="date-range">
              <input type="date" />
              <span>a</span>
              <input type="date" />
            </div>
          </div>
          
          <div className="form-group">
            <label>Proyecto</label>
            <select>
              <option value="">Todos los proyectos</option>
              <option value="1">Proyecto A</option>
              <option value="2">Proyecto B</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Tipo de reporte</label>
            <select>
              <option value="balance">Balance general</option>
              <option value="ingresos">Solo ingresos</option>
              <option value="egresos">Solo egresos</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary">Generar Reporte</button>
        </form>
      </div>
      
      <div className="reportes-resultados">
        <h2>Resultados</h2>
        
        <div className="reportes-grafico">
          {/* Aquí iría un gráfico en una implementación real */}
          <p>Gráfico de resultados aparecerá aquí</p>
        </div>
        
        <table className="reportes-tabla">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Ingresos</th>
              <th>Egresos</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map(item => (
              <tr key={item.id}>
                <td>{item.proyecto}</td>
                <td>${item.ingresos.toLocaleString()}</td>
                <td>${item.egresos.toLocaleString()}</td>
                <td>${item.balance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="reportes-acciones">
          <button className="btn-primary">Exportar a Excel</button>
          <button className="btn-primary">Generar PDF</button>
          <button className="btn-secondary">Compartir</button>
        </div>
      </div>
    </div>
  );
};

export default Reportes;