import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import '../styles/ingresos.css';

function Ingresos() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Añadir nuevo ingreso solo si TODOS los campos están llenos, monto es numérico y fecha válida
  const handleAddIngreso = (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    const allFilled =
      headers.length > 0 &&
      headers.every((header) => (nuevoIngreso[header] || '').trim() !== '');

    // Validar que el campo 'Monto' sea numérico
    const montoValido =
      nuevoIngreso['Monto'] !== undefined &&
      !isNaN(Number(nuevoIngreso['Monto'])) &&
      nuevoIngreso['Monto'].toString().trim() !== '';

    // Validar que el campo 'Fecha' sea una fecha válida (YYYY-MM-DD o similar)
    const fechaValida =
      nuevoIngreso['Fecha'] !== undefined &&
      !isNaN(Date.parse(nuevoIngreso['Fecha'])) &&
      /^\d{4}-\d{2}-\d{2}$/.test(nuevoIngreso['Fecha'].trim());

    if (!allFilled || !montoValido || !fechaValida) return;

    setData((prev) => [...prev, nuevoIngreso]);
    setNuevoIngreso({});
  };

  // Eliminar ingreso por índice
  const handleDeleteIngreso = (index) => {
    setDeleteIndex(index);
    setShowPopup(true);
  };

  const confirmDelete = () => {
    setData((prev) => prev.filter((_, i) => i !== deleteIndex));
    setShowPopup(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setShowPopup(false);
    setDeleteIndex(null);
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
      {showPopup && (
        <div className="popup-confirm">
          <div className="popup-content">
            <p>¿Estás seguro de que deseas eliminar este ingreso?</p>
            <button onClick={confirmDelete}>Sí, eliminar</button>
            <button onClick={cancelDelete}>Cancelar</button>
          </div>
        </div>
      )}
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
                    <td key={header}>
                      {header === 'Fecha' && fila[header]
                        ? (() => {
                            const [y, m, d] = fila[header].split('-');
                            return `${d}-${m}-${y}`;
                          })()
                        : fila[header]}
                    </td>
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
                    {header === 'Fecha' ? (
                      <input
                        type="date"
                        value={nuevoIngreso[header] || ''}
                        onChange={(e) => handleInputChange(e, header)}
                        placeholder={header}
                      />
                    ) : (
                      <input
                        type="text"
                        value={nuevoIngreso[header] || ''}
                        onChange={(e) => handleInputChange(e, header)}
                        placeholder={header}
                      />
                    )}
                  </td>
                ))}
                <td>
                  <button
                    onClick={handleAddIngreso}
                    disabled={
                      !(
                        headers.length > 0 &&
                        headers.every((header) => (nuevoIngreso[header] || '').trim() !== '') &&
                        nuevoIngreso['Monto'] !== undefined &&
                        !isNaN(Number(nuevoIngreso['Monto'])) &&
                        nuevoIngreso['Monto'].toString().trim() !== '' &&
                        nuevoIngreso['Fecha'] !== undefined &&
                        !isNaN(Date.parse(nuevoIngreso['Fecha'])) &&
                        /^\d{4}-\d{2}-\d{2}$/.test(nuevoIngreso['Fecha'].trim())
                      )
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
