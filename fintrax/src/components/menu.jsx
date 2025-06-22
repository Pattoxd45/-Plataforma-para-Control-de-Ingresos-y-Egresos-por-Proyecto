import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthCheck from './hooks/useAuthCheck';
import '../styles/menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const { logout } = useAuthCheck(); // Obtener la función de cierre de sesión del hook
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú

  const toggleMenu = () => setIsOpen(!isOpen); // Alternar el estado del menú
  const navigateAndClose = (path) => {
    navigate(path);
    setIsOpen(false); // Cerrar el menú después de navegar
  };

  return (
    <nav className="menu">
      <div className="menu-top">
        <div className="menu-logo" onClick={() => navigate('/Inicio')}>Fintrax</div>

        <div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <ul className={`menu-links ${isOpen ? 'show' : ''}`}>
        <li onClick={() => navigateAndClose('/Proyectos')}>Proyectos</li>
        <li onClick={() => navigateAndClose('/ingresos')}>Ingresos</li>
        <li onClick={() => navigateAndClose('/egresos')}>Egresos</li>
        <li onClick={() => navigateAndClose('/reportes')}>Reportes</li>
        <li onClick={() => navigateAndClose('/about')}>About</li>
        <li onClick={() => navigateAndClose('/perfil')}>Perfil</li>
        <li onClick={() => {
          logout();
          setIsOpen(false); // Cerrar el menú después de cerrar sesión
        }} className="logout-button">Cerrar Sesión</li>
      </ul>
    </nav>
  );
};

export default Menu;