import React from "react";
import "../../stylos/Servicios.css";

const Servicios = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Nuestros Servicios</h1>
      <p className="page-content">
        Ofrecemos los mejores servicios para el bienestar de tu mascota.  
        Desde atención veterinaria hasta grooming y guardería.
      </p>

      <div className="card">
        <h2>🐾 Atención Veterinaria</h2>
        <p>Consulta general, vacunación y emergencias.</p>
      </div>

      <div className="card">
        <h2>✂️ Grooming</h2>
        <p>Baños, cortes de pelo y cuidado estético.</p>
      </div>

      <div className="card">
        <h2>🏠 Guardería</h2>
        <p>Cuidado y entretenimiento para tu mascota cuando lo necesites.</p>
      </div>
    </div>
  );
};

export default Servicios;
