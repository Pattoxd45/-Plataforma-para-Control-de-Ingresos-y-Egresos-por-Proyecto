import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const navigateAndClose = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="menu">
      <div className="menu-top">
        <div className="menu-logo" onClick={() => navigate('/')}>Fintrax</div>

        <div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <ul className={`menu-links ${isOpen ? 'show' : ''}`}>
        <li onClick={() => navigateAndClose('/ingresos')}>Ingresos</li>
        <li onClick={() => navigateAndClose('/egresos')}>Egresos</li>
        <li onClick={() => navigateAndClose('/reportes')}>Reportes</li>
        <li onClick={() => navigateAndClose('/about')}>About</li>
        <li onClick={() => navigateAndClose('/perfil')}>Perfil</li>
      </ul>
    </nav>

  );
};

export default Menu;
