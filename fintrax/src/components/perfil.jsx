import React from 'react';
import '../styles/perfil.css';

const Perfil = () => {
  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1 className="perfil-titulo">Perfil de Usuario</h1>
        <p className="perfil-subtitulo">Administra tu información personal y preferencias</p>
      </div>
      
      <section className="perfil-seccion">
        <div className="perfil-tarjeta">
          <h2 className="perfil-encabezado">Mi Cuenta</h2>
          
          <div className="perfil-contenido">
            <div className="informacion-personal">
              <h3 className="perfil-subtitulo-tarjeta">
                <i className="fas fa-user perfil-icono"></i> Información Personal
              </h3>
              
              <div className="perfil-datos">
                <div className="perfil-dato">
                  <span className="perfil-dato-etiqueta">Nombre:</span>
                  <span className="perfil-dato-valor">Carlos Ulloa</span>
                </div>
                <div className="perfil-dato">
                  <span className="perfil-dato-etiqueta">Correo electrónico:</span>
                  <span className="perfil-dato-valor">carlos@fintrax.com</span>
                </div>
                <div className="perfil-dato">
                  <span className="perfil-dato-etiqueta">Rol:</span>
                  <span className="perfil-dato-valor perfil-rol">Administrador</span>
                </div>
              </div>
            </div>

            <hr className="perfil-separador" />

            <div className="actividad-reciente">
              <h3 className="perfil-subtitulo-tarjeta">
                <i className="fas fa-chart-line perfil-icono"></i> Actividad Reciente
              </h3>
              
              <div className="perfil-datos">
                <div className="perfil-dato">
                  <span className="perfil-dato-etiqueta">Último acceso:</span>
                  <span className="perfil-dato-valor">15/06/2023 10:30 AM</span>
                </div>
                <div className="perfil-dato">
                  <span className="perfil-dato-etiqueta">Proyectos activos:</span>
                  <span className="perfil-dato-valor">3</span>
                </div>
              </div>
            </div>

            <div className="perfil-botones">
              <button className="perfil-boton perfil-boton-primario">
                <i className="fas fa-edit"></i> Editar Perfil
              </button>
              <button className="perfil-boton perfil-boton-secundario">
                <i className="fas fa-key"></i> Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Perfil;