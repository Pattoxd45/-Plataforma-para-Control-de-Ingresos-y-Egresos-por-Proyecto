import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './connections/endpoints';
import '../styles/recoverPassword.css';

function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

const handleRecoverPassword = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setSuccessMessage('');

  try {
    const redirectUrl = `${window.location.origin}/ConfirmacionRecuperacion`; // Detectar automáticamente la URL base
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl, // Usar la URL dinámica
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
    }
  } catch (error) {
    setErrorMessage('Error inesperado. Intenta nuevamente.');
  }
};

  return (
    <div className="recover-password-container">
      <form className="recover-password-form" onSubmit={handleRecoverPassword}>
        <h2>Recuperar Contraseña</h2>
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
        <button type="submit">Recuperar Contraseña</button>
      </form>
      <div className="recover-password-links">
        <p className="link-item">
          <span className="link" onClick={() => navigate('/')}>
            Volver Atrás
          </span>
        </p>
      </div> 
    </div>
  );
}

export default RecoverPassword;