import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthCheck from './hooks/useAuthCheck';
import '../styles/menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const { logout } = useAuthCheck(); // Obtener la función de cierre de sesión del hook

  return (
    <nav className="menu">
      <div className="menu-logo" onClick={() => navigate('/')}>Fintrax</div>
      <ul className="menu-links">
        <li onClick={() => navigate('/Proyectos')}>Proyectos</li>
        <li onClick={() => navigate('/ingresos')}>Ingresos</li>
        <li onClick={() => navigate('/egresos')}>Egresos</li>
        <li onClick={() => navigate('/reportes')}>Reportes</li>
        <li onClick={() => navigate('/perfil')}>Perfil</li>
        <li onClick={logout} className="logout-button">Cerrar Sesión</li>
      </ul>
    </nav>
  );
};

export default Menu;