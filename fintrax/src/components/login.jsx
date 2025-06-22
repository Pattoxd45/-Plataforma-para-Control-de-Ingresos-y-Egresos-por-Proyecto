import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './connections/endpoints';
import '../styles/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        navigate('/Inicio'); // Redirigir al inicio después del login
      }
    } catch (error) {
      setErrorMessage('Error inesperado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'} // Cambiar entre texto y contraseña
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)} // Alternar estado
            >
              {showPassword ? '👁️' : '🙈'} {/* Ícono para mostrar/ocultar */}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
      <div className="login-links">
        <p className="link-item">
          ¿No tienes una cuenta?{' '}
          <span className="link" onClick={() => navigate('/Registrarse')}>
            Registrarse
          </span>
        </p>
        <p className="link-item">
          ¿Olvidaste tu contraseña?{' '}
          <span className="link" onClick={() => navigate('/Recuperar_Contrasena')}>
            Recuperar Contraseña
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;