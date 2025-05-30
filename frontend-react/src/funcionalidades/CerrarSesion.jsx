// src/funcionalidades/CerrarSesion.jsx
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Constantes para evitar magic strings
const SESSION_KEYS = {
  SESSION_STORAGE: 'userSession',
  LOCAL_STORAGE: 'userSession'
};

const PATHS = {
  LOGIN: '/Login'
};

const useCerrarSesionAlRetroceder = () => {
  const navigate = useNavigate();

  // Usar useCallback para memoizar la función y evitar recreaciones innecesarias
  const cerrarSesion = useCallback(() => {
    try {
      // Limpiar datos de sesión de manera más segura
      sessionStorage.removeItem(SESSION_KEYS.SESSION_STORAGE);
      localStorage.removeItem(SESSION_KEYS.LOCAL_STORAGE);
      
      // Redirigir al login sin posibilidad de retroceder
      navigate(PATHS.LOGIN, { 
        replace: true,
        state: { from: 'session_expired' } // Estado adicional para tracking
      });
      
      // Forzar recarga para limpiar completamente el estado de la aplicación
      window.location.reload();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Podrías agregar aquí un manejo de errores más sofisticado
    }
  }, [navigate]);

  useEffect(() => {
    const manejarRetroceso = (evento) => {
      try {
        // Verificación más robusta de sesión activa
        const tieneSesion = (
          sessionStorage.getItem(SESSION_KEYS.SESSION_STORAGE) || 
          localStorage.getItem(SESSION_KEYS.LOCAL_STORAGE)
        );
        
        if (tieneSesion) {
          // Prevenir el comportamiento por defecto del navegador
          evento.preventDefault();
          cerrarSesion();
        }
      } catch (error) {
        console.error('Error al manejar retroceso:', error);
      }
    };

    // Agregar el listener con opción capture para mayor seguridad
    window.addEventListener('popstate', manejarRetroceso, { capture: true });
    
    // Limpieza del efecto
    return () => {
      window.removeEventListener('popstate', manejarRetroceso, { capture: true });
    };
  }, [cerrarSesion]);

  return { cerrarSesion };
};

export default useCerrarSesionAlRetroceder;