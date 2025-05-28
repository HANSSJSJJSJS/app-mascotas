import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
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

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.setItem('logout-event', Date.now());
    clearTimers();
  };

  const resetTimers = () => {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    setShowInactivityWarning(false);
    
    // Tiempos para pruebas (10s advertencia, 20s logout)
    const WARNING_TIME = 10000; // 10 segundos
    const LOGOUT_TIME = 20000;  // 20 segundos

    warningTimer = setTimeout(() => {
      setShowInactivityWarning(true);
    }, LOGOUT_TIME - WARNING_TIME);

    inactivityTimer = setTimeout(() => {
      logout();
    }, LOGOUT_TIME);
  };

  const clearTimers = () => {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
  };

  const handleActivity = () => {
    if (usuario) {
      resetTimers();
    }
  };

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
  }, [usuario]);

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