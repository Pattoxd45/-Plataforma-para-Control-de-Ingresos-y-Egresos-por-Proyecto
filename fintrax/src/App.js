import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/menu';
import Inicio from './components/inicio';
import Ingresos from './components/ingresos';
import Egresos from './components/egresos';
import Reportes from './components/reportes';
import Perfil from './components/perfil';
import Copyright from './components/copyright';
import About from './components/about';

function App() {
  return (
    
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/ingresos" element={<Ingresos />} />
        <Route path="/" element={<Egresos />} />
        <Route path="/" element={<Reportes />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Perfil />} />
      </Routes>
      <Copyright />
    </Router>
    
  );
}

export default App;
