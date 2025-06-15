import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Menu from './components/menu';
import Inicio from './components/inicio';
import Ingresos from './components/ingresos';
import Egresos from './components/egresos';
import Reportes from './components/reportes';
import Perfil from './components/perfil';
import Login from './components/login';
import Proyectos from './components/proyectos';

function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Mostrar el menú solo si no estamos en la ruta de login */}
      {location.pathname !== '/' && <Menu />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Proyectos" element={<Proyectos />} />
        <Route path="/Ingresos" element={<Ingresos />} />
        <Route path="/Egresos" element={<Egresos />} />
        <Route path="/Reportes" element={<Reportes />} />
        <Route path="/Perfil" element={<Perfil />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;