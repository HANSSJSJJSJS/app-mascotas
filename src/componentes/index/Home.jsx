import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Calendar, MapPin, Star } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../stylos/Home.css';
import { useEffect } from 'react';
import Carousel from 'bootstrap/js/dist/carousel';


// Import images directly
import carousel1 from '../../imagenes/carousel-1.jpg';
import carousel2 from '../../imagenes/carousel-2.jpg';
import carousel3 from '../../imagenes/carousel-3.jpg';


export default function Home() {
  useEffect(() => {
    const carouselElement = document.getElementById('heroCarousel');
    const carousel = new Carousel(carouselElement);
    carousel.cycle(); // Para que inicie el ciclo de las imágenes
  }, []);

  return (
    <main className="main-content">
      {/* Hero Section */}
      <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          {/* Primer slide (activo por defecto) */}
          <div className="carousel-item active" style={{
            background: `linear-gradient(#c2d8ff80, #8196eb80), url(${carousel1}) center/cover no-repeat`,
            minHeight: '100vh'
          }}>
            <div className="container h-100 d-flex align-items-center justify-content-center">
              <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                  <h2 className="display-4 hero-title">Cuidado Veterinario de Calidad</h2>
                  <p className="lead">En Moybe nos preocupamos por la salud y bienestar de tu mascota</p>
                  <Link to="/formulario/Login" className="btn btn-primary mt-3">Reservar Cita</Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Segundo slide */}
          <div className="carousel-item" style={{
            background: `linear-gradient(#c2d8ff80, #8196eb80), url(${carousel2}) center/cover no-repeat`,
            minHeight: '100vh'
          }}>
            <div className="container h-100 d-flex align-items-center justify-content-center">
              <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                  <h2 className="display-4 hero-title">Servicios Especializados</h2>
                  <p className="lead">Contamos con equipos de última generación</p>
                  <Link to="/formulario/Login" className="btn btn-primary mt-3">Reservar Cita</Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tercer slide */}
          <div className="carousel-item" style={{
            background: `linear-gradient(#c2d8ff80, #8196eb80), url(${carousel3}) center/cover no-repeat`,
            minHeight: '100vh'
          }}>
            <div className="container h-100 d-flex align-items-center justify-content-center">
              <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                  <h2 className="display-4 hero-title">Atención 24/7</h2>
                  <p className="lead">Emergencias veterinarias cuando las necesites</p>
                  <Link to="/formulario/Login" className="btn btn-primary mt-3">Reservar Cita</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Carousel indicators - inside the carousel container */}
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
        </div>
        
        {/* Controles del carrusel */}
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
      {/* Services */}
      <section className="services py-5">
        <div className="container">
          <h3 className="text-center mb-4 section-title">Nuestros Servicios</h3>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="service-card">
                <Heart size={48} className="service-icon" />
                <h4>Medicina General</h4>
                <p>Consultas, vacunación y tratamientos para todo tipo de mascotas.</p>
                <Link to="/servicios/medicina" className="service-link">Más información</Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service-card">
                <Calendar size={48} className="service-icon" />
                <h4>Spa y Grooming</h4>
                <p>Baños, cortes de pelo y cuidados estéticos para tu mascota.</p>
                <Link to="/servicios/spa" className="service-link">Más información</Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service-card">
                <Phone size={48} className="service-icon" />
                <h4>Emergencias 24/7</h4>
                <p>Atención de urgencias veterinarias las 24 horas del día.</p>
                <Link to="/servicios/emergencias" className="service-link">Más información</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}