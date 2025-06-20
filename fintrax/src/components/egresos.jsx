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
            <li>Modelo de negocio</li>
            <li>Nombre de empresa</li>
            <li>Aplicar filtros</li>
            <li>Uso específico</li>
            <li>Categoría</li>
            <li>Sistemas y valores</li>
            <li>Distribución geográfica</li>
            <li>Buscar empresa</li>
          </ul>
        </div>

        <hr className="separador" />

        <div className="funcionalidades">
          <h3>Director Legal</h3>
          <p><strong>Funcionalidades disponibles:</strong></p>
          <ul>
            <li>Documentación digitalizada en gestión</li>
            <li>Distribuidores para entrega de información</li>
            <li>Gestión de usuarios</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Egresos;