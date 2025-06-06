import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  debugger;
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('userData');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  let inactivityTimer;
  let warningTimer;

  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    resetTimers();
  };

  const logout = useCallback(() => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.setItem('logout-event', Date.now());
    clearTimers();
  }, []);

  const clearTimers = () => {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
  };

  const resetTimers = useCallback(() => {
    clearTimers();
    setShowInactivityWarning(false);
    
    if (!usuario) return;

    // Tiempos de inactividad (5 min para advertencia, 10 min para logout)
    const WARNING_TIME = 5 * 60 * 1000; // 5 minutos
    const LOGOUT_TIME = 10 * 60 * 1000; // 10 minutos

    warningTimer = setTimeout(() => {
      setShowInactivityWarning(true);
    }, LOGOUT_TIME - WARNING_TIME);

    inactivityTimer = setTimeout(() => {
      logout();
    }, LOGOUT_TIME);
  }, [usuario, logout]);

  const handleActivity = useCallback(() => {
    if (usuario) {
      resetTimers();
    }
  }, [usuario, resetTimers]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    const handleStorageChange = (e) => {
      if (e.key === 'logout-event') {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    if (usuario) {
      resetTimers();
    }

    return () => {
      clearTimers();
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [usuario, handleActivity, logout, resetTimers]);

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      logout,
      showInactivityWarning,
      setShowInactivityWarning
    }}>
      {children}
    </AuthContext.Provider>
  );
};