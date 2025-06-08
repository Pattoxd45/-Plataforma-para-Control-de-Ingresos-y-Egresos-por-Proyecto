import React from 'react';
import '../styles/ingresos.css';

const Ingresos = () => {
  return (
    <div className="ingresos-container">
      <h1>Ingresos</h1>
      <p className="ingresos-subtitulo">Esta sección estará disponible próximamente.</p>
      <div className="ingresos-contenido">
        <p>En futuras versiones podrás:</p>
        <ul>
          <li>Registrar nuevos ingresos por proyecto</li>
          <li>Visualizar ingresos por fecha, categoría o responsable</li>
          <li>Generar reportes descargables</li>
          <li>Ver estadísticas de ingresos en tiempo real</li>
        </ul>
        <p className="ingresos-footer">Estamos trabajando para traerte estas funcionalidades pronto.</p>
      </div>
    </div>
  );
};

export default Ingresos;
