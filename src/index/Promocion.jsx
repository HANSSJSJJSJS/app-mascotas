import React from 'react';

const Promocion = () => {
  return (
    <div className="container-pro">
      <div className="imagen-promotion">
        <img className="position-png" src="/img/promotion.png" alt="Promotion" />
        <a 
          href="https://youtu.be/sOS9aOIXPEk?si=SEjBAWS-fmCipeVG" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="button"
        >
          <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="30px">
            <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" fill="currentColor"></path>
          </svg>
        </a>
      </div>
      
      <div className="text-img">
        <div className="d-flex align-items-center justify-content-center bg-white rounded-circle mb-4v">
          <h3 className="font-txt">$80.000 COP</h3>
        </div>
        <h3 className="font-weight-bold text-white mt-3 mb-4">Esterilización de Mascotas</h3>
        <p className="text-white mb-4">¿Tienes una mascota que aún no ha sido esterilizada?...</p>
        <a href="/citas" className="shadow__btn">Agendar cita</a>
      </div>
    </div>
  );
};

export default Promocion;