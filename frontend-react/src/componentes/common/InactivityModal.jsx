import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../common/InactivityModal';

const InactivityModal = () => {
  const { showInactivityWarning, setShowInactivityWarning, logout } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    setShowInactivityWarning(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/Login');
  };

  if (!showInactivityWarning) return null;

  return (
    <div className="inactivity-modal-overlay">
      <div className="inactivity-modal">
        <h3>¿Sigues ahí?</h3>
        <p>Tu sesión se cerrará automáticamente en 5 minutos por inactividad.</p>
        <div className="modal-actions">
          <button className="continue-btn" onClick={handleContinue}>
            Continuar sesión
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default InactivityModal;