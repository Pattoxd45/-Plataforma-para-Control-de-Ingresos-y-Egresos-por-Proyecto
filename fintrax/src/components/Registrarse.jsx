import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './connections/endpoints';
import '../styles/register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

const handleRegister = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setSuccessMessage('');

  try {
    // Registrar al usuario directamente
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        setErrorMessage('El correo ya está registrado. Por favor, inicia sesión.');
      } else {
        setErrorMessage(error.message);
      }
    } else {
      setSuccessMessage('Registro exitoso. Redirigiendo al login...');
      setTimeout(() => {
        navigate('/'); // Redirigir al login después de un registro exitoso
      }, 2000); // Esperar 2 segundos antes de redirigir
    }
  } catch (error) {
    setErrorMessage('Error inesperado. Intenta nuevamente.');
  }
};

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Crear Cuenta</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
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
        <button type="submit">Registrarse</button>
      </form>
      <div className="register-links">
        <p className="link-item">
          ¿Ya tienes una cuenta?{' '}
          <span className="link" onClick={() => navigate('/')}>
            Iniciar Sesión
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;