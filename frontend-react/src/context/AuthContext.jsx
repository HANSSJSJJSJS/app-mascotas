import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// 1. Creación del contexto
const AuthContext = createContext(null);

// 2. Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// 3. Proveedor del Contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para saber si se está cargando la sesión inicial
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);

  // Usamos useRef para los IDs de los timers para que no causen re-renderizados al cambiar
  const inactivityTimer = useRef(null);
  const warningTimer = useRef(null);

  // Clave unificada para localStorage
  const LOCAL_STORAGE_KEY = 'pet-app-user';

  // Carga inicial del usuario desde localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedUser) {
        setUsuario(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al leer datos de usuario desde localStorage", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } finally {
      setLoading(false); // Terminamos la carga inicial
    }
  }, []);

  const clearTimers = () => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  };

  const logout = useCallback(() => {
    setUsuario(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    // Este evento ayuda a que si el usuario cierra sesión en una pestaña, se cierre en todas.
    localStorage.setItem('logout-event', Date.now()); 
    clearTimers();
  }, []);

  const resetTimers = useCallback(() => {
    clearTimers();
    setShowInactivityWarning(false);

    // Tiempos de inactividad (14 min para advertencia, 15 min para logout)
    const WARNING_TIME = 14 * 60 * 1000; // 14 minutos
    const LOGOUT_TIME = 15 * 60 * 1000; // 15 minutos

    warningTimer.current = setTimeout(() => {
      setShowInactivityWarning(true);
    }, WARNING_TIME);

    inactivityTimer.current = setTimeout(() => {
      logout();
    }, LOGOUT_TIME);
  }, [logout]);

  // Efecto que maneja la actividad del usuario para reiniciar los timers
  useEffect(() => {
    const handleActivity = () => {
      if (usuario) {
        resetTimers();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Solo agregar listeners si hay un usuario logueado
    if (usuario) {
      events.forEach(event => window.addEventListener(event, handleActivity));
      resetTimers(); // Inicia los timers cuando el usuario se loguea
    }

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearTimers(); // Limpia los timers cuando el componente se desmonta o el usuario hace logout
    };
  }, [usuario, resetTimers]);

  // Efecto para sincronizar el logout entre pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'logout-event') {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [logout]);

  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datosUsuario));
  };
  
  // Valores derivados para fácil acceso en la app
  const isAuthenticated = !!usuario;
  const isAdmin = usuario?.id_rol === 1;

  const value = {
    usuario,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading,
    showInactivityWarning,
    setShowInactivityWarning,
    resetTimers // Se exporta para que el modal de inactividad pueda reiniciar el timer
  };

  return (
    <AuthContext.Provider value={value}>
      {/* No renderizar los componentes hijos hasta que se haya verificado la sesión */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
