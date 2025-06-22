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
import Register from './components/Registrarse';
import RecoverPassword from './components/recuperarContrasena'; // Importar la página de recuperación de contraseña
import ConfirmacionRecuperacion from './components/ConfirmacionRecuperacion';


function App() {
  const location = useLocation(); // Hook para obtener la ruta actual

  const hideMenuRoutes = ['/Registrarse', '/Recuperar_Contrasena','/ConfirmacionRecuperacion', '/']; // Rutas donde no se debe mostrar el menú

  return (
    <div className="app-container">
      {/* Renderizar el menú solo si no estamos en la ruta del login */}
      {!hideMenuRoutes.includes(location.pathname) && <Menu />}
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
          <Route path="/Registrarse" element={<Register />} /> {/* Ruta para registro */}
          <Route path="/Recuperar_Contrasena" element={<RecoverPassword />} /> {/* Ruta para recuperación de contraseña */}
          <Route path="/ConfirmacionRecuperacion" element={<ConfirmacionRecuperacion />} />        
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