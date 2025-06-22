import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../connections/endpoints';

const useAuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ruta actual

  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      const unauthenticatedRoutes = ['/Registrarse', '/Recuperar_Contrasena']; // Rutas que no requieren autenticación

      if (!session?.session?.user && !unauthenticatedRoutes.includes(location.pathname)) {
        navigate('/'); // Redirigir al login si no hay sesión activa y no está en una ruta permitida
      }
    };

    checkSession();
  }, [navigate, location]);

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