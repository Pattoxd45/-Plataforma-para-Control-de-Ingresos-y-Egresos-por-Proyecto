import React from 'react';
import '../styles/perfil.css';

const Perfil = () => {
  return (
    <div className="perfil-container">
      <h1>CU</h1>
      
      <section className="seccion-perfil">
        <h2>Mi Perfil</h2>
        
        <div className="informacion-personal">
          <h3>Información Personal</h3>
          <p><strong>Nombre:</strong> Carlos Ulloa</p>
          <p><strong>Email:</strong> carlos@fintrax.com</p>
          <p><strong>Rol:</strong> Administrador</p>
        </div>

        <hr className="separador" />

        <div className="actividad-reciente">
          <h3>Actividad</h3>
          <p><strong>Último acceso:</strong> 15/06/2023 10:30 AM</p>
          <p><strong>Proyectos activos:</strong> 3</p>
        </div>

        <div className="botones-perfil">
          <button className="boton-editar">Editar Perfil</button>
          <button className="boton-contrasena">Cambiar Contraseña</button>
        </div>
      </section>
    </div>
  );
};

export default Perfil;