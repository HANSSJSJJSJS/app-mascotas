import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const InactivityModal = () => {
  const { showInactivityWarning, setShowInactivityWarning } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    setShowInactivityWarning(false);
    // Cualquier interacción reiniciará los timers automáticamente
  };

  if (!showInactivityWarning) return null;

  return (
    <div className="inactivity-modal-overlay">
      <div className="inactivity-modal">
        <h3>¿Sigues ahí?</h3>
        <p>Tu sesión está a punto de cerrarse por inactividad.</p>
        <div className="modal-actions">
          <button onClick={handleContinue}>Continuar</button>
        </div>
      </div>
    </div>
  );
};

export default InactivityModal;