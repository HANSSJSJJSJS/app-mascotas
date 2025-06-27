import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useCerrarSesionAlRetroceder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lista de rutas públicas donde no debe actuar
  const publicRoutes = [
    '/login',
    '/home',
    '/servicios',
    '/adopcion',
    '/sobrenosotros',
    '/propietario',
    '/olvidecontrasena',
    '/cambiocontraseña'
  ];

  const cerrarSesion = useCallback(() => {
    // Limpiar almacenamiento
    sessionStorage.removeItem('userSession');
    localStorage.removeItem('userSession');
    
    // Redirigir al login sin recargar la página
    navigate('/login', { 
      replace: true,
      state: { from: 'session_expired' }
    });
  }, [navigate]);

  useEffect(() => {
    const handleBackOrClose = (event) => {
      const tieneSesion = sessionStorage.getItem('userSession') || 
                        localStorage.getItem('userSession');
      
      // Solo actuar si hay sesión y no es ruta pública
      if (tieneSesion && !publicRoutes.includes(location.pathname)) {
        event.preventDefault();
        cerrarSesion();
        
        // Forzar una nueva entrada en el historial
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    // Manejar botón atrás del navegador
    window.addEventListener('popstate', handleBackOrClose);
    
    // Manejar cierre de pestaña/ventana
    window.addEventListener('beforeunload', handleBackOrClose);

    return () => {
      window.removeEventListener('popstate', handleBackOrClose);
      window.removeEventListener('beforeunload', handleBackOrClose);
    };
  }, [cerrarSesion, location.pathname]);

  return { cerrarSesion };
};

export default useCerrarSesionAlRetroceder;