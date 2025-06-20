import React from 'react';
import '../styles/egresos.css';

const Egresos = () => {
  return (
    <div className="egresos-container">
      <div className="egresos-header">
        <h1 className="egresos-titulo">Egresos</h1>
        <p className="egresos-subtitulo">Gestión del patrimonio público por empresas</p>
      </div>
      
      <section className="egresos-seccion">
        <div className="egresos-tarjeta">
          <h2 className="egresos-encabezado">Registro de Egresos</h2>
          
          <div className="egresos-contenido">
            <div className="nuevo-egreso">
              <h3 className="egresos-subtitulo-tarjeta">Nuevo Egreso</h3>
              <p className="egresos-descripcion">Complete los siguientes campos para registrar un nuevo egreso:</p>
              
              <div className="egresos-lista-contenedor">
                <ul className="egresos-lista">
                  <li><span className="egresos-item-destacado">Monitorizar empresa</span> - Seguimiento continuo</li>
                  <li><span className="egresos-item-destacado">Modelo de negocio</span> - Definición del modelo</li>
                  <li><span className="egresos-item-destacado">Nombre de empresa</span> - Identificación legal</li>
                  <li><span className="egresos-item-destacado">Aplicar filtros</span> - Selección específica</li>
                  <li><span className="egresos-item-destacado">Uso específico</span> - Destino del recurso</li>
                  <li><span className="egresos-item-destacado">Categoría</span> - Clasificación contable</li>
                  <li><span className="egresos-item-destacado">Sistemas y valores</span> - Parámetros técnicos</li>
                  <li><span className="egresos-item-destacado">Distribución geográfica</span> - Ámbito de aplicación</li>
                  <li><span className="egresos-item-destacado">Buscar empresa</span> - Consulta en base de datos</li>
                </ul>
              </div>
            </div>

            <hr className="egresos-separador" />

            <div className="funcionalidades">
              <h3 className="egresos-subtitulo-tarjeta">Director Legal</h3>
              <p className="egresos-descripcion"><strong>Funcionalidades disponibles:</strong></p>
              
              <div className="egresos-lista-contenedor">
                <ul className="egresos-lista">
                  <li>Documentación digitalizada en gestión automatizada</li>
                  <li>Distribuidores autorizados para entrega de información certificada</li>
                  <li>Gestión centralizada de usuarios y permisos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Egresos;