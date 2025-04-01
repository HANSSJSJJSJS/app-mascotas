import React from "react";
import "../../stylos/SobreNosotros.css";

const SobreNosotros = () => {
  return (
    <div className="sobre-nosotros-container">
      <h1 className="sobre-nosotros-title">Sobre Nosotros</h1>
      <p className="sobre-nosotros-content">
        En <strong>#MOYBE</strong>, nos apasionan los animales.  
        Nuestra misión es mejorar la vida de las mascotas y ayudar a encontrarles hogares amorosos.
      </p>

      <div className="sobre-nosotros-card">
        <h2>❤️ Nuestra Historia</h2>
        <p>Fundada en 2024, nuestra organización ha ayudado a cientos de mascotas a encontrar un hogar seguro.</p>
      </div>

      <div className="sobre-nosotros-card">
        <h2>🐾 Nuestro Compromiso</h2>
        <p>Brindamos servicios de calidad, promovemos la adopción y trabajamos por el bienestar animal.</p>
      </div>

      <div className="sobre-nosotros-card">
        <h2>📍 Visítanos</h2>
        <p>Estamos en tu ciudad, listos para ayudarte a encontrar el mejor amigo peludo.</p>
      </div>
    </div>
  );
};

export default SobreNosotros;
