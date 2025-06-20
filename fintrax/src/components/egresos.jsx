import React from 'react';
import '../styles/egresos.css';

const Egresos = () => {
  return (
    <div className="egresos-container">
      <h1>Egresos</h1>
      
      <section className="seccion-egresos">
        <h2>Registro del patrimonio público por empresas</h2>
        
        <div className="nuevo-egreso">
          <h3>Nuevo Egreso</h3>
          <p>Propuesta</p>
          <ul>
            <li>Monitorizar empresa</li>
            <li>Modelo</li>
            <li>Nombrar empresa</li>
            <li>Aplicar</li>
            <li>Uso específico</li>
            <li>Categoría</li>
            <li>Sistemas y valores</li>
            <li>Distribución</li>
            <li>Encontrar una empresa</li>
          </ul>
        </div>

        <hr className="separador" />

        <div className="funcionalidades">
          <h3>Director Legal</h3>
          <p><strong>Funcionalidades disponibles:</strong></p>
          <ul>
            <li>Capítulo digitalizado en gestión</li>
            <li>Distribuidores para entrega de datos</li>
            <li>Atender a un conjunto de usuarios</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Egresos;