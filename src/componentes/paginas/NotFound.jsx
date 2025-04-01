import React from 'react';
import { Link } from 'react-router-dom';
import '../../stylos/NotFound.css'; 

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">¡Ups! Página no encontrada</h2>
        <p className="notfound-text">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <div className="notfound-animation">
          {/* Animación de mascota triste */}
          <div className="pet-animation">
            <div className="pet-face">
              <div className="pet-eyes">
                <div className="pet-eye"></div>
                <div className="pet-eye"></div>
              </div>
              <div className="pet-mouth"></div>
            </div>
          </div>
        </div>
        <Link to="/" className="notfound-button">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;