import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../connections/endpoints';

const useAuthCheck = () => {
  const navigate = useNavigate();

  // Verificar si el usuario está logueado
  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        navigate('/'); // Redirigir al login si no hay sesión activa
      }
    };

    checkSession();
  }, [navigate]);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await supabase.auth.signOut(); // Cerrar sesión
      navigate('/'); // Redirigir al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return { logout };
};

export default useAuthCheck;