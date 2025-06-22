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
      <div className="app-container">
        <Menu />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/ingresos" element={<Ingresos />} />
            <Route path="/egresos" element={<Egresos />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Copyright />
      </div>
    </Router>
  );
}

export default App;