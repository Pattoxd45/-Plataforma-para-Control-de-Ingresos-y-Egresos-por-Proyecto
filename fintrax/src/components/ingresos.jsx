import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import '../styles/ingresos.css';

function Ingresos() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nuevo ingreso temporal para el formulario
  const [nuevoIngreso, setNuevoIngreso] = useState({});

  // Leer archivo Excel y transformar a JSON
  const fetchIngresosData = async () => {
    const response = await fetch('/ingresos.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    return jsonData;
  };

  // Cargar datos, usando localStorage si existe
  const loadIngresos = async () => {
    setLoading(true);
    try {
      const savedData = localStorage.getItem('ingresos');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.length > 0) {
          setHeaders(Object.keys(parsed[0]));
          setData(parsed);
        }
      } else {
        const jsonData = await fetchIngresosData();
        if (jsonData.length > 0) {
          setHeaders(Object.keys(jsonData[0]));
          setData(jsonData);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    if (!loading && data.length > 0) {
      localStorage.setItem('ingresos', JSON.stringify(data));
    }
  }, [data, loading]);

  useEffect(() => {
    loadIngresos();
  }, []);

  // Añadir nuevo ingreso si tiene al menos un campo con contenido
  const handleAddIngreso = (e) => {
    e.preventDefault();
    // Validación: al menos un campo no vacío
    const hasValue = Object.values(nuevoIngreso).some((val) => val.trim() !== '');
    if (!hasValue) return;
    setData((prev) => [...prev, nuevoIngreso]);
    setNuevoIngreso({});
  };

  // Eliminar ingreso por índice
  const handleDeleteIngreso = (index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  // Actualizar nuevo ingreso en formulario
  const handleInputChange = (e, header) => {
    setNuevoIngreso((prev) => ({
      ...prev,
      [header]: e.target.value,
    }));
  };

  return (
    <div className="ingresos-container">
      <h1>Ingresos</h1>

      {loading ? (
        <p className="ingresos-cargando">Cargando datos desde Excel...</p>
      ) : (
        <div className="tabla-ingresos">
          <table className="tabla">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((fila, filaIndex) => (
                <tr key={filaIndex}>
                  {headers.map((header) => (
                    <td key={header}>{fila[header]}</td>
                  ))}
                  <td>
                    <button onClick={() => handleDeleteIngreso(filaIndex)}>Eliminar</button>
                  </td>
                </tr>
              ))}

              {/* Fila para nuevo ingreso */}
              <tr>
                {headers.map((header) => (
                  <td key={header}>
                    <input
                      type="text"
                      value={nuevoIngreso[header] || ''}
                      onChange={(e) => handleInputChange(e, header)}
                      placeholder={header}
                    />
                  </td>
                ))}
                <td>
                  <button
                    onClick={handleAddIngreso}
                    disabled={
                      !Object.values(nuevoIngreso).some((val) => val.trim() !== '')
                    }
                  >
                    Añadir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Ingresos;
