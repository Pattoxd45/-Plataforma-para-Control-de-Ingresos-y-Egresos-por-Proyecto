import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthCheck from './hooks/useAuthCheck';
import '../styles/menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const { logout } = useAuthCheck();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // Nuevo estado

  const toggleMenu = () => setIsOpen(!isOpen);
  const navigateAndClose = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`menu ${isScrolled ? 'scrolled' : ''}`}>
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
        <li
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
          className="logout-button"
        >
          Cerrar Sesión
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
