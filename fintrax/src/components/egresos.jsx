import React from 'react';
import '../styles/egresos.css';

const Egresos = () => {
  return (
    <div className="egresos-container">
      <h1>Exercise</h1>
      
      <section className="egresos-section">
        <h2>Egresos</h2>
        <p>Registrar o patrimônio público por empresas.</p>
        
        <div className="egresos-nuevo">
          <h3>Nuevo Egreto</h3>
          <p>Proposto</p>
          <ul>
            <li>Monitorar empresa</li>
            <li>Model</li>
            <li>Nominar empresa</li>
            <li>Aplica</li>
            <li>El uso de uso</li>
            <li>Categoría</li>
            <li>Sistemas e valores</li>
            <li>Distribúción</li>
            <li>Encontrar una empresa</li>
          </ul>
        </div>

        <hr className="egresos-separador" />

        <div className="egresos-funcionalidades">
          <h3>Diretor Legal</h3>
          <p><strong>Funcionidades disponíveis:</strong></p>
          <ul>
            <li>Capítulo digitalizado em gestion</li>
            <li>Distribuidores para entregados dados</li>
            <li>Atendido a um conjunto de usuários</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Egresos;