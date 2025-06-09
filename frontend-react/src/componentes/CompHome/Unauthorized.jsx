import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../stylos/cssHome/NotFound.css'; // Reutilizamos estilos de NotFound para consistencia

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">403</h1>
        <p className="not-found-subtitle">Acceso Denegado</p>
        <p className="not-found-text">
          Lo sentimos, no tienes los permisos necesarios para acceder a esta página.
        </p>
        <div className="not-found-buttons">
            <button onClick={() => navigate(-1)} className="not-found-button primary">
                Volver a la Página Anterior
            </button>
            <Link to="/" className="not-found-button secondary">
                Ir a la Página Principal
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;