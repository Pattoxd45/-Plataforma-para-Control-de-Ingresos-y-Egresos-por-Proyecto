import React, { useState, useEffect } from 'react';
import { endpoints } from '<source />/connections/endpoints';
import '../styles/reportes.css';

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    projectId: '',
    reportType: 'financial',
    startDate: '',
    endDate: ''
  });

  // Cargar reportes al inicio
  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const data = await endpoints.reports.getAll();
        setReportes(data);
      } catch (error) {
        console.error('Error cargando reportes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportes();
  }, []);

  // Generar nuevo reporte
  const generarReporte = async () => {
    try {
      setLoading(true);
      const { projectId, reportType, startDate, endDate } = filters;
      const nuevoReporte = await endpoints.reports.generate(
        projectId, 
        reportType, 
        startDate, 
        endDate
      );
      setReportes([...reportes, nuevoReporte]);
    } catch (error) {
      console.error('Error generando reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando reportes...</div>;

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h1>Reportes Financieros</h1>
        <div className="filtros">
          <select 
            value={filters.reportType}
            onChange={(e) => setFilters({...filters, reportType: e.target.value})}
          >
            <option value="financial">Financiero</option>
            <option value="expenses">Gastos</option>
          </select>
          <input 
            type="date" 
            value={filters.startDate}
            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
          />
          <input 
            type="date" 
            value={filters.endDate}
            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
          />
          <button onClick={generarReporte}>Generar Reporte</button>
        </div>
      </div>

      <div className="reportes-list">
        {reportes.map((reporte) => (
          <div key={reporte.id} className="reporte-card">
            <h3>{reporte.name}</h3>
            <p>Tipo: {reporte.type}</p>
            <p>Fecha: {new Date(reporte.created_at).toLocaleDateString()}</p>
            {/* Aquí iría la tabla con los datos del reporte */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reportes;