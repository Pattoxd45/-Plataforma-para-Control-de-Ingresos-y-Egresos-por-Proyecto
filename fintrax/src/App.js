import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Menu from './components/menu';
import Inicio from './components/inicio';
import Ingresos from './components/ingresos';
import Egresos from './components/egresos';
import Reportes from './components/reportes';
import Perfil from './components/perfil';
import Copyright from './components/copyright';
import About from './components/about';
import Login from './components/login';
import Proyectos from './components/proyectos';

function App() {
  const location = useLocation(); // Hook para obtener la ruta actual

  return (
    <div className="app-container">
      {/* Renderizar el menú solo si no estamos en la ruta del login */}
      {location.pathname !== '/' && <Menu />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/ingresos" element={<Ingresos />} />
          <Route path="/egresos" element={<Egresos />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/about" element={<About />} />
          <Route path="/Proyectos" element={<Proyectos />} />
        </Routes>
      </main>
      <Copyright />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;