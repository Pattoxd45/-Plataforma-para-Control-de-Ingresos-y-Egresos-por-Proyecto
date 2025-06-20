import React from 'react';
import '../styles/perfil.css';

const Perfil = () => {
  return (
    <div className="perfil-container">
      <h1>CU</h1>
      
      <section className="perfil-section">
        <h2>Mi Perfil</h2>
        
        <div className="perfil-info">
          <h3>Información Personal</h3>
          <p><strong>Nombre:</strong> Carlos Ulloa</p>
          <p><strong>Email:</strong> carlos@fintrax.com</p>
          <p><strong>Rol:</strong> Administrator</p>
        </div>

        <hr className="perfil-separador" />

        <div className="perfil-actividad">
          <h3>Actividad</h3>
          <p><strong>Último acceso:</strong> 15/06/2023 10:30 AM</p>
          <p><strong>Proyectos activos:</strong> 3</p>
        </div>

        <div className="perfil-botones">
          <button className="perfil-boton">Editar Perfil</button>
          <button className="perfil-boton">Cambiar Contraseña</button>
        </div>
      </section>
    </div>
  );
};

export default Perfil;