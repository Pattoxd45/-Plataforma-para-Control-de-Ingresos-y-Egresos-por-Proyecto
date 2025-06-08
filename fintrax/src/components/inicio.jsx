import React from 'react';
import '../styles/inicio.css';

const Inicio = () => {
  return (
    <div className="inicio-container">
      <h1 className="inicio-titulo">Bienvenido a Fintrax</h1>
      <p className="inicio-descripcion">
        Fintrax es una plataforma diseñada para el control de ingresos y egresos por proyecto. 
        Su objetivo es facilitar la gestión financiera de múltiples iniciativas desde una interfaz clara y eficiente.
      </p>

      <div className="inicio-secciones">
        <div className="seccion">
          <h2>🎯 Objetivo</h2>
          <p>Controlar y visualizar los movimientos financieros (ingresos y egresos) de cada proyecto registrado.</p>
        </div>

        <div className="seccion">
          <h2>🧰 Funcionalidades</h2>
          <ul>
            <li>Registro de ingresos y egresos por proyecto</li>
            <li>Visualización de balances</li>
            <li>Gestión de usuarios y roles</li>
            <li>Reportes financieros personalizados</li>
          </ul>
        </div>

        <div className="seccion">
          <h2>🚀 Cómo empezar</h2>
          <p>Crea un proyecto, agrega tus movimientos financieros, y deja que Fintrax se encargue del resto.</p>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
