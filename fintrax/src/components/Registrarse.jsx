import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './connections/endpoints';
import '../styles/register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Verificar si el correo ya está registrado
      const { data: existingUser, error: checkError } = await supabase
        .from('auth.users')
        .select('email')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // Error inesperado al verificar el usuario
        setErrorMessage('Usuario ya registrado. Por favor, inicia sesión.');
        return;
      }

      if (existingUser) {
        // Si el usuario ya existe, mostrar un mensaje de error
        setErrorMessage('El correo ya está registrado. Por favor, inicia sesión.');
        return;
      }

      // Registrar al usuario si no existe
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
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
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      <div className="register-links">
        <p className="link-item">
          ¿Ya tienes una cuenta?{' '}
          <button className="link-button" onClick={() => navigate('/')}>
            Iniciar Sesión
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;