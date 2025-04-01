import React from 'react';
import { Link } from "react-router-dom";
import { FaCut, FaBath, FaHeartbeat, FaTeeth, FaClock, FaUserMd, FaPaw } from 'react-icons/fa';
import { MdLocationOn,  MdPhone } from 'react-icons/md';
import '../../stylos/Servicios.css';

const Servicios = () => {
  const servicios = [
    {
      id: 1,
      icon: FaCut,
      title: "Cirugía",
      description: "Procedimientos quirúrgicos realizados por especialistas con equipamiento de última generación."
    },
    {
      id: 2,
      icon: FaBath,
      title: "Peluquería",
      description: "Baño, corte y cepillado profesional para mantener a tu mascota limpia y saludable."
    },
    {
      id: 3,
      icon: FaHeartbeat,
      title: "Emergencias",
      description: "Atención inmediata para situaciones críticas que requieren intervención urgente."
    },
    {
      id: 4,
      icon: FaTeeth,
      title: "Especialidades",
      description: "Dermatología, odontología, cardiología y otras especialidades para cuidados específicos."
    }
  ];

  const razones = [
    {
      id: 1,
      icon: FaUserMd,
      title: "Profesionales Calificados",
      description: "Nuestro equipo está formado por veterinarios con amplia experiencia y especialización."
    },
    {
      id: 2,
      icon: FaPaw,
      title: "Atención Personalizada",
      description: "Tratamos a cada mascota como única, adaptando nuestros servicios a sus necesidades específicas."
    },
    {
      id: 3,
      icon: FaClock,
      title: "Horarios Flexibles",
      description: "Ofrecemos horarios amplios y servicio de emergencia para estar siempre disponibles cuando nos necesites."
    }
  ];

  return (
    <div className="servicios-container">
      
      <main className='container_server'>
        {/* Título Principal */}
        <h1 className="servicios-titulo-principal">PET MOYBE</h1>
        <p className="servicios-subtitulo" style={{ textAlign: 'center', marginBottom: '40px' }}>
          Clínica veterinaria especializada en el cuidado de tus mascotas
        </p>
        
        {/* Sección de Servicios */}
        <section className="servicios-seccion">
          <h2 className="servicios-subtitulo">Nuestros Servicios</h2>
          
          <div className="servicios-lista">
            {servicios.map(servicio => (
              <div key={servicio.id} className="servicio-item">
                <div className="servicio-icono">
                  <servicio.icon />
                </div>
                <div className="servicio-contenido">
                  <h3 className="servicio-titulo">{servicio.title}</h3>
                  <p className="servicio-descripcion">{servicio.description}</p>
                  <Link to="/Login" className="servicio-boton">
                    Más información
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección: ¿Por qué elegirnos? */}
        <section className="servicios-seccion">
          <h2 className="servicios-subtitulo">¿Por qué elegirnos?</h2>
          
          <div className="servicios-lista">
            {razones.map(razon => (
              <div key={razon.id} className="servicio-item">
                <div className="servicio-icono">
                  <razon.icon />
                </div>
                <div className="servicio-contenido">
                  <h3 className="servicio-titulo">{razon.title}</h3>
                  <p className="servicio-descripcion">{razon.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Llamado a la acción */}
        <section className="servicios-llamado">
          <h2 className="servicios-subtitulo">¿Listo para cuidar la salud de tu mascota?</h2>
          <p>Agenda una cita hoy mismo y déjanos cuidar de tu compañero fiel con el mejor servicio veterinario.</p>
          
          <div className="botones-accion">
            <button className="boton-accion">
              <MdPhone style={{ marginRight: '8px' }} /> Contactar
            </button>
            <button className="boton-accion">
              <MdLocationOn style={{ marginRight: '8px' }} /> Ver Ubicación
            </button>
          </div>
        </section>
      </main>
      
    </div>
  );
};

export default Servicios;