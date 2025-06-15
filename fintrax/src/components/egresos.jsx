import React from 'react';
import '../styles/egresos.css';

const Egresos = () => {
  return (
    <div className="egresos-container">
      <h1>Egresos</h1>
      <p className="egresos-subtitulo">Registro y gestión de gastos por proyecto</p>
      
      <div className="egreso-form">
        <h2>Nuevo Egreso</h2>
        <form>
          <label>Proyecto</label>
          <select>
            <option value="">Seleccionar proyecto</option>
            <option value="1">Proyecto A</option>
            <option value="2">Proyecto B</option>
          </select>
          
          <label>Monto</label>
          <input type="number" placeholder="Ingrese el monto" />
          
          <label>Fecha</label>
          <input type="date" />
          
          <label>Categoría</label>
          <select>
            <option value="">Seleccionar categoría</option>
            <option value="materiales">Materiales</option>
            <option value="servicios">Servicios</option>
            <option value="personal">Personal</option>
          </select>
          
          <label>Descripción</label>
          <input type="text" placeholder="Descripción del egreso" />
          
          <button type="submit" className="btn-primary">Registrar Egreso</button>
        </form>
      </div>
      
      <div className="egresos-contenido">
        <p>Funcionalidades disponibles:</p>
        <ul>
          <li>Registro detallado de gastos</li>
          <li>Clasificación por categorías</li>
          <li>Visualización por rangos de fecha</li>
          <li>Alertas de presupuesto excedido</li>
        </ul>
      </div>
    </div>
  );
};

export default Egresos;