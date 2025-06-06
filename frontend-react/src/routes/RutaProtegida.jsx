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
const RutaProtegida = ({ roles }) => {
  const { isAuthenticated, usuario, loading, isAdmin } = useAuth();
  const location = useLocation();

  // 1. Mientras se verifica el estado de autenticación, mostramos un indicador de carga.
  //    Esto previene un "parpadeo" a la página de login para usuarios ya autenticados.
  if (loading) {
    return <Loading />;
  }

  // 2. Si el usuario no está autenticado, lo redirigimos a la página de login.
  //    Guardamos la ubicación actual para poder redirigirlo de vuelta después del login.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Si la ruta requiere roles específicos (ej. [1] para Admin), verificamos el rol del usuario.
  //    El objeto 'usuario' debe tener una propiedad 'id_rol'.
  //    `isAdmin` es un helper que ya verifica si usuario.id_rol === 1.
  const tieneRolRequerido = roles ? roles.includes(usuario?.id_rol) : true;

  if (!tieneRolRequerido) {
    // 4. Si el usuario está autenticado pero no tiene el rol correcto,
    //    lo redirigimos a una página de "No Autorizado" o al home.
    //    Usar 'replace' para que no pueda volver atrás a la página no autorizada.
    console.warn(`Acceso denegado a la ruta ${location.pathname} para el rol ${usuario?.id_rol}`);
    return <Navigate to="/unauthorized" replace />; // O a "/" si prefieres
  }
  
  // 5. Si el usuario está autenticado y tiene el rol correcto (si es requerido),
  //    le damos acceso a la ruta solicitada usando <Outlet />.
  return <Outlet />;
};

export default RutaProtegida;
