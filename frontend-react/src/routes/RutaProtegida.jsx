import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../componentes/index/Loading'; // Asegúrate de que la ruta a tu componente Loading sea correcta

/**
 * Componente de orden superior para proteger rutas según la autenticación y los roles.
 * @param {object} props - Propiedades del componente.
 * @param {Array<number>} [props.roles] - Un array de IDs de rol que tienen permitido el acceso.
 * Si no se provee, solo se requiere autenticación.
 */
const RutaProtegida = ({ rolPermitido }) => {
  const { isAuthenticated, usuario, loading } = useAuth();
  const location = useLocation();

  // 1. Mientras se verifica el estado de autenticación, mostramos un indicador de carga.
  //    Esto previene un "parpadeo" a la página de login para usuarios ya autenticados.
  if (loading) {
    return <Loading />;
  }

  // 2. Si el usuario no está autenticado, lo redirigimos a la página de login.
  //    Guardamos la ubicación actual para poder redirigirlo de vuelta después del login.
  if (!isAuthenticated || usuario.rol !== rolPermitido) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  // 5. Si el usuario está autenticado y tiene el rol correcto (si es requerido),
  //    le damos acceso a la ruta solicitada usando <Outlet />.
  return <Outlet />;
};

export default RutaProtegida;
