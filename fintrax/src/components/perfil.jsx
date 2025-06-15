import React from 'react';
import '../styles/perfil.css';

const Perfil = () => {
  // Datos de ejemplo - en una aplicación real estos vendrían de un estado o API
  const userData = {
    nombre: 'Carlos Ulloa',
    email: 'carlos@fintrax.com',
    rol: 'Administrador',
    ultimoAcceso: '15/06/2023 10:30 AM',
    proyectosActivos: 3
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <img 
          src="https://ui-avatars.com/api/?name=Carlos+Ulloa&background=3f51b5&color=fff" 
          alt="Avatar" 
          className="perfil-avatar"
        />
        <h1>Mi Perfil</h1>
      </div>
      
      <div className="perfil-seccion">
        <h2>Información Personal</h2>
        <div className="perfil-info-item">
          <strong>Nombre:</strong> {userData.nombre}
        </div>
        <div className="perfil-info-item">
          <strong>Email:</strong> {userData.email}
        </div>
        <div className="perfil-info-item">
          <strong>Rol:</strong> {userData.rol}
        </div>
      </div>
      
      <div className="perfil-seccion">
        <h2>Actividad</h2>
        <div className="perfil-info-item">
          <strong>Último acceso:</strong> {userData.ultimoAcceso}
        </div>
        <div className="perfil-info-item">
          <strong>Proyectos activos:</strong> {userData.proyectosActivos}
        </div>
      </div>
      
      <div className="perfil-acciones">
        <button className="btn-primary">Editar Perfil</button>
        <button className="btn-secondary">Cambiar Contraseña</button>
      </div>
    </div>
  );
};

export default Perfil;