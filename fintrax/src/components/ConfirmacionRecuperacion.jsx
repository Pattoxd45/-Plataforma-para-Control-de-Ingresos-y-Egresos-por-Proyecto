import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './connections/endpoints';
import '../styles/recoverPassword.css';

const ConfirmacionRecuperacion = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar confirmación de contraseña
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Contraseña cambiada exitosamente. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/'); // Redirigir al login después de cambiar la contraseña
        }, 3000);
      }
    } catch (error) {
      setErrorMessage('Error inesperado. Intenta nuevamente.');
    }
  };

  return (
    <div className="recover-password-container">
      <form className="recover-password-form" onSubmit={handleChangePassword}>
        <h2>Cambiar Contraseña</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="form-group">
          <label htmlFor="password">Nueva Contraseña</label>
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <div className="password-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'} // Cambiar entre texto y contraseña
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Alternar estado
            >
              {showConfirmPassword ? '👁️' : '🙈'} {/* Ícono para mostrar/ocultar */}
            </button>
          </div>
        </div>
        <button type="submit">Cambiar Contraseña</button>
      </form>
    </div>
  );
};

export default ConfirmacionRecuperacion;