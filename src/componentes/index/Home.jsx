import React from 'react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle, ArrowRightCircle, Heart, ToggleRight, Store } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../stylos/Home.css';

export default function Home() {
  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current && window.bootstrap) {
      new window.bootstrap.Carousel(carouselRef.current, {
        interval: 5000,
      });
    }
  }, []);

  return (
    <div className="main-container">
      {/* Sección del Carrusel */}
      <div className="container-carusel">
        <div id="header-carousel" className="carousel slide" data-bs-ride="carousel" ref={carouselRef}>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img 
                src="imagenes/carousel-1.jpg" 
                alt="Emergencias veterinarias" 
                className="w-100"
                style={{ height: "750px", objectFit: "cover" }}
              />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-1" style={{ maxWidth: '900px' }}>
                  <span className="text">24/7 Para ti</span>
                  <h1 className="display">Emergencias veterinarias</h1>
                  <p className="lead">Cuando más nos necesites, estaremos ahí</p>
                  <Link to="/formulario/login" className="boton">Iniciar sesión</Link>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img 
                src="imagenes/carousel-2.jpg" 
                alt="Spa y Grooming" 
                className="w-100"
                style={{ height: "750px", objectFit: "cover" }}
              />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3" style={{ maxWidth: '900px' }}>
                  <span className="textt">Spa & Grooming</span>
                  <h1 className="displayy">Un día de belleza para tu mascota</h1>
                  <p className="leadd">Mimos y cuidados especiales que se merecen</p>
                  <Link to="/formulario/login" className="botton">Reservar Sesión</Link>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
            <div className="primary" style={{ width: '45px', height: '45px' }}>
              <ArrowLeftCircle size={32} />
            </div>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
            <div className="primaryy" style={{ width: '45px', height: '45px' }}>
              <ArrowRightCircle size={32} />
            </div>
          </button>
        </div>
      </div>
      {/* Fin del Carrusel */}
      
      {/* Sección de 'Sobre Nosotros' */}
      <div className="container-ab">
        <div className="about">
          <div className="iconos" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <a href="#"><Heart className="bii" size={42} /></a>
            <a href="#"><ToggleRight className="bii" size={42} /></a>
            <a href="#"><Store className="bii" size={42} /></a>
          </div>
      
          <div className="teetx-container">
            <div className="teetx">
              <span className="saluu">Salud Preventiva</span>
              <h1 className="subsa">Calendario de vacunación al día</h1>
              <p className="subsub">Protección completa para una vida saludable</p>
            </div>
          </div>
      
          <div className="row">
            <div className="vert-text">
              <h4 className="font-weight-bold">Sobre nosotros</h4>
              <h5 className="text-muted mb-3">Moybe: Donde el amor y la salud de tu mascota son nuestra prioridad.</h5>
              <p>En Moybe, nos apasiona el bienestar de tus mascotas...</p>
              <Link to="/formulario/Login" className="shadow__btn">Registrarse</Link>
            </div>
          </div>
        </div>
      </div>
      {/* Fin de la sección 'Sobre Nosotros' */}
      
      {/* Sección de Promoción */}
      <div className="container-pro">
        <div className="imagen-promotion">
          <img 
            className="position-png"
            src="/imagenes/promotion.jpg" 
            alt="Imagen de promoción"
            style={{ width: "100vh", height: "70vh" }}
          />
          <a href="https://youtu.be/sOS9aOIXPEk?si=SEjBAWS-fmCipeVG" target="_blank" rel="noopener noreferrer" className="button">
            <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="30px">
              <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" fill="currentColor"></path>
            </svg>
          </a>
        </div>
        <div className="text-img">
          <h3 className="font-weight-bold text-white mt-3 mb-4">Esterilización de Mascotas</h3>
          <p className="text-white mb-4">¿Tienes una mascota que aún no ha sido esterilizada?...</p>
          <Link to="/formulario/Login" className="shadow__btn">Agendar cita</Link>
        </div>
      </div>
    </div>
  );
}