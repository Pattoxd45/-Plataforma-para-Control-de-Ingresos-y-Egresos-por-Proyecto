import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import '../styles/ingresos.css';

const Ingresos = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const response = await fetch('/ingresos.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }); // para evitar undefined

        if (jsonData.length > 0) {
          setHeaders(Object.keys(jsonData[0]));
          setData(jsonData);
        }
      } catch (error) {
        console.error('Error al leer el archivo Excel:', error);
      }
    };

    fetchExcel();
  }, []);

  return (
    <div className="ingresos-container">
      <h1>Ingresos</h1>

      {data.length === 0 ? (
        <p className="ingresos-cargando">Cargando datos desde Excel...</p>
      ) : (
        <div className="tabla-ingresos">
          <table className="tabla">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((fila, filaIndex) => (
                <tr key={filaIndex}>
                  {headers.map((header, colIndex) => (
                    <td key={colIndex}>{fila[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="ingresos-contenido">
        <h2>Próximas funcionalidades:</h2>
        <ul>
          <li>Registrar nuevos ingresos por proyecto</li>
          <li>Filtrar ingresos por fecha, categoría o responsable</li>
          <li>Generar reportes descargables</li>
          <li>Ver estadísticas de ingresos en tiempo real</li>
        </ul>
        <p className="ingresos-footer">Estamos trabajando para traerte estas funcionalidades pronto.</p>
      </div>
    </div>
  );
};

export default Ingresos;
