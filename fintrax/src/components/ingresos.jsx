import React, { useEffect, useState } from 'react';
import { endpoints } from './connections/endpoints';
import '../styles/ingresos.css';

function Ingresos() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const headerLabels = {
    nombre_proyecto: 'Nombre Proyecto',
    fecha_termino: 'Fecha Finalización',
    descripcion: 'Descripción',
    responsable: 'Responsable',
    balance_final: 'Balance Final'
  };

  const loadIngresos = async () => {
    setLoading(true);
    try {
      const result = await endpoints.projects.getArchivedProjectsSummary();
      setData(result || []);
      if (result && result.length > 0) {
        const filteredHeaders = Object.keys(result[0]).filter(
          (header) => header !== 'project_id'
        );
        setHeaders(filteredHeaders);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setData([]);
      setHeaders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngresos();
  }, []);

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

  // 🔎 Filtrar resultados en tiempo real
  const filteredData = data.filter((fila) =>
    headers.some((header) =>
      String(fila[header])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="ingresos-container">
      <h1>Ingresos por Proyectos</h1>

      {/* 🔍 Buscador */}
      <input
        type="text"
        placeholder="Buscar..."
        className="buscador-ingresos"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />

      {loading ? (
        <p className="ingresos-cargando">Cargando datos desde la base de datos...</p>
      ) : (
        <div className="tabla-ingresos">
          <table className="tabla">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{headerLabels[header] || header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((fila, filaIndex) => (
                <tr key={filaIndex}>
                  {headers.map((header) => (
                    <td key={header}>
                      {header === 'fecha_termino' && fila[header]
                        ? formatFecha(fila[header])
                        : fila[header]}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={headers.length} style={{ textAlign: 'center' }}>
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Ingresos;
