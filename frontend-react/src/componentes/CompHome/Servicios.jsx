import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaCut, FaBath, FaHeartbeat, FaTeeth, FaClock, FaUserMd, FaPaw, FaQuoteLeft, FaChevronRight } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdPets, MdOutlineHealthAndSafety } from 'react-icons/md';
import '../../stylos/cssHome/Servicios.css';

const Servicios = () => {
  const [activeService, setActiveService] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Efecto para manejar la animación de entrada al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75;
        
        if (isInView) {
          setIsVisible(prev => ({ ...prev, [index]: true }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificar visibilidad inicial
    
    // Cambiar servicio activo cada 4 segundos
    const interval = setInterval(() => {
      setActiveService(prev => (prev + 1) % servicios.length);
    }, 4000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const servicios = [
    {
      id: 1,
      icon: FaCut,
      title: "Cirugía",
      description: "Procedimientos quirúrgicos realizados por especialistas con equipamiento de última generación.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 2,
      icon: FaBath,
      title: "Peluquería",
      description: "Baño, corte y cepillado profesional para mantener a tu mascota limpia y saludable.",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 3,
      icon: FaHeartbeat,
      title: "Emergencias",
      description: "Atención inmediata para situaciones críticas que requieren intervención urgente.",
      image: "https://images.unsplash.com/photo-1612531822129-ec4e4c9b5026?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 4,
      icon: FaTeeth,
      title: "Especialidades",
      description: "Dermatología, odontología, cardiología y otras especialidades para cuidados específicos.",
      image: "https://images.unsplash.com/photo-1576073719676-aa95576db207?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];

  const razones = [
    {
      id: 1,
      icon: FaUserMd,
      title: "Profesionales Calificados",
      description: "Nuestro equipo está formado por veterinarios con amplia experiencia y especialización.",
      image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 2,
      icon: FaPaw,
      title: "Atención Personalizada",
      description: "Tratamos a cada mascota como única, adaptando nuestros servicios a sus necesidades específicas.",
      image: "https://images.unsplash.com/photo-1587764379873-97837921fd44?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 3,
      icon: FaClock,
      title: "Horarios Flexibles",
      description: "Ofrecemos horarios amplios y servicio de emergencia para estar siempre disponibles cuando nos necesites.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];

  const testimonios = [
    {
      id: 1,
      nombre: "Carlos Rodríguez",
      mascota: "Max (Labrador)",
      texto: "La atención que recibió mi perro fue excepcional. El equipo de PET MOYBE es profesional y cariñoso.",
      imagen: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      nombre: "María González",
      mascota: "Luna (Gato Persa)",
      texto: "Gracias al tratamiento especializado, mi gata se recuperó rápidamente. Recomiendo totalmente sus servicios.",
      imagen: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      mascota: "Rocky (Bulldog)",
      texto: "El servicio de peluquería es increíble. Mi perro siempre sale feliz y con un aspecto impecable.",
      imagen: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="servicios-container">
      
      {/* Hero Section */}
      <div className="servicios-hero">
        <div className="servicios-hero-overlay"></div>
        <div className="servicios-hero-content">
          <h1 className="servicios-titulo-principal">PET MOYBE</h1>
          <p className="servicios-hero-subtitulo">
            Cuidado veterinario de excelencia para tu mejor amigo
          </p>
          <Link to="/Login" className="servicios-hero-button">
            Reservar Cita <FaChevronRight className="icon-right" />
          </Link>
        </div>
      </div>
      
      <main className='container_server'>
        {/* Introducción */}
        <div className="servicios-intro animate-on-scroll" style={{ opacity: isVisible[0] ? 1 : 0 }}>
          <div className="servicios-intro-content">
            <MdPets className="servicios-intro-icon" />
            <h2>Clínica veterinaria especializada en el cuidado de tus mascotas</h2>
            <p>
              En PET MOYBE nos dedicamos a proporcionar atención médica de alta calidad para tus compañeros peludos.
              Nuestro equipo de profesionales está comprometido con la salud y el bienestar de cada paciente.
            </p>
          </div>
        </div>
        
        {/* Sección de Servicios Destacados */}
        <section className="servicios-destacados animate-on-scroll" style={{ opacity: isVisible[1] ? 1 : 0 }}>
          <div className="servicios-destacados-header">
            <h2 className="servicios-subtitulo">Servicios Destacados</h2>
            <p>Conoce nuestros servicios principales diseñados para el cuidado integral de tu mascota</p>
          </div>
          
          <div className="servicios-tabs">
            {servicios.map((servicio, index) => (
              <div 
                key={servicio.id} 
                className={`servicio-tab ${activeService === index ? 'active' : ''}`}
                onClick={() => setActiveService(index)}
              >
                <servicio.icon className="servicio-tab-icon" />
                <span>{servicio.title}</span>
              </div>
            ))}
          </div>
          
          <div className="servicios-content-wrapper">
            {servicios.map((servicio, index) => (
              <div 
                key={servicio.id} 
                className={`servicio-content ${activeService === index ? 'active' : ''}`}
                style={{
                  backgroundImage: `linear-gradient(rgba(26, 37, 64, 0.8), rgba(73, 90, 144, 0.8)), url(${servicio.image})`
                }}
              >
                <div className="servicio-content-inner">
                  <h3>{servicio.title}</h3>
                  <p>{servicio.description}</p>
                  <Link to="/Login" className="servicio-content-button">
                    Más información
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Sección de Servicios Detallados */}
        <section className="servicios-seccion animate-on-scroll" style={{ opacity: isVisible[2] ? 1 : 0 }}>
          <h2 className="servicios-subtitulo">Nuestros Servicios</h2>
          
          <div className="servicios-lista">
            {servicios.map(servicio => (
              <div key={servicio.id} className="servicio-item">
                <div className="servicio-imagen" style={{ backgroundImage: `url(${servicio.image})` }}>
                  <div className="servicio-imagen-overlay">
                    <servicio.icon className="servicio-imagen-icon" />
                  </div>
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
        <section className="servicios-seccion animate-on-scroll" style={{ opacity: isVisible[3] ? 1 : 0 }}>
          <h2 className="servicios-subtitulo">¿Por qué elegirnos?</h2>
          
          <div className="servicios-razones">
            {razones.map(razon => (
              <div key={razon.id} className="razon-item">
                <div className="razon-imagen" style={{ backgroundImage: `url(${razon.image})` }}></div>
                <div className="razon-contenido">
                  <div className="razon-icono">
                    <razon.icon />
                  </div>
                  <h3 className="razon-titulo">{razon.title}</h3>
                  <p className="razon-descripcion">{razon.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Sección de Testimonios */}
        <section className="servicios-testimonios animate-on-scroll" style={{ opacity: isVisible[4] ? 1 : 0 }}>
          <h2 className="servicios-subtitulo">Lo que dicen nuestros clientes</h2>
          
          <div className="testimonios-lista">
            {testimonios.map(testimonio => (
              <div key={testimonio.id} className="testimonio-item">
                <div className="testimonio-imagen" style={{ backgroundImage: `url(${testimonio.imagen})` }}></div>
                <div className="testimonio-contenido">
                  <FaQuoteLeft className="testimonio-icono" />
                  <p className="testimonio-texto">{testimonio.texto}</p>
                  <div className="testimonio-autor">
                    <strong>{testimonio.nombre}</strong>
                    <span>{testimonio.mascota}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Llamado a la acción */}
        <section className="servicios-llamado animate-on-scroll" style={{ opacity: isVisible[5] ? 1 : 0 }}>
          <div className="llamado-content">
            <MdOutlineHealthAndSafety className="llamado-icon" />
            <h2 className="servicios-subtitulo">¿Listo para cuidar la salud de tu mascota?</h2>
            <p>Agenda una cita hoy mismo y déjanos cuidar de tu compañero fiel con el mejor servicio veterinario.</p>
            
            <div className="botones-accion">
              <button className="boton-accion">
                <MdPhone className="boton-icon" /> Contactar
              </button>
              <button className="boton-accion secundario">
                <MdLocationOn className="boton-icon" /> Ver Ubicación
              </button>
            </div>
          </div>
        </section>
        
        {/* Horarios */}
        <section className="servicios-horarios animate-on-scroll" style={{ opacity: isVisible[6] ? 1 : 0 }}>
          <h2 className="servicios-subtitulo">Horarios de Atención</h2>
          
          <div className="horarios-grid">
            <div className="horario-dia">
              <div className="horario-dia-nombre">Lunes a Viernes</div>
              <div className="horario-dia-horas">8:00 AM - 8:00 PM</div>
            </div>
            <div className="horario-dia">
              <div className="horario-dia-nombre">Sábados</div>
              <div className="horario-dia-horas">9:00 AM - 6:00 PM</div>
            </div>
            <div className="horario-dia">
              <div className="horario-dia-nombre">Domingos</div>
              <div className="horario-dia-horas">10:00 AM - 2:00 PM</div>
            </div>
            <div className="horario-dia emergencia">
              <div className="horario-dia-nombre">Emergencias</div>
              <div className="horario-dia-horas">24/7</div>
            </div>
          </div>
        </section>
      </main>
      
    </div>
  );
};

export default Servicios;