import React from 'react';
import { Link } from 'react-router-dom';
import 'animate.css';
import { InView } from 'react-intersection-observer';
import { Heart, Phone, Calendar, MapPin, Star, Clock, Award, Users, MessageSquare, CheckCircle } from "lucide-react"
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../stylos/Home.css';
import { useEffect } from 'react';
import imgAbout from '../../imagenes/about.png'
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
            minHeight: '100vh',
          }}>
            <div className="container h-100 d-flex align-items-center justify-content-center">
              <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                  <h2 className="hero-title">Cuidado Veterinario de Calidad</h2>
                  <p className="lead">En Moybe nos preocupamos por la salud y bienestar de tu mascota</p>
                  <div className="button-container">
                  <Link to="/Login" className="button type1">
                    <span className="btn-txt">Reservar Cita</span>
                  </Link>
                  </div>
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
                  <div className="button-container">
                  <Link to="/Login" className="button type1">
                    <span className="btn-txt">Reservar Cita</span>
                  </Link>
                  </div>
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
                  <div className="button-container">
                  <Link to="/Login" className="button type1">
                    <span className="btn-txt">Reservar Cita</span>
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        <section className="services">
          <div className="container">
          <div className="section-title-container">
            <InView
              as="div"
              onChange={(inView, entry) => {
                if (inView) {
                  entry.target.classList.add('animate__animated', 'animate__backInLeft');
                } else {
                  entry.target.classList.remove('animate__animated', 'animate__backInLeft');
                }
              }}
              triggerOnce={true}  // Esto asegura que la animación se ejecute solo una vez
            >
              <h3 className="section">Nuestros Servicios</h3>
            </InView>
          </div>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="service-card">
                <Heart className="service-icon" size={48} />
                  <h4>Medicina General</h4>
                  <p>Consultas, vacunación y tratamientos para todo tipo de mascotas.</p>
                  <Link to="/Servicios" className="service-link">Más información</Link>
                </div>
              </div>
            <div className="col-md-4">
              <div className="service-card">
                <Calendar className="service-icon" size={48} />
                <h4>Spa y Grooming</h4>
                <p>Baños, cortes de pelo y cuidados estéticos para tu mascota.</p>
                <Link to="/Servicios" className="service-link">Más información</Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service-card">
                <Phone className="service-icono" size={48} />
                <h4>Emergencias 24/7</h4>
                <p>Atención de urgencias veterinarias las 24 horas del día.</p>
                <Link to="/Servicios" className="service-link">Más información</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about py-5">
        <div className="container-about">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img src={imgAbout} alt="Veterinario Moybe" className="img-fluid rounded shadow" />
            </div>
            <div className="col-md-6">
              <h3 className="section">Sobre Nosotros</h3>
              <p>
                Moybe es una clínica veterinaria comprometida con ofrecer el mejor cuidado para 
                tu mascota. Contamos con un equipo de profesionales altamente calificados y 
                las instalaciones más modernas.
              </p>
              <div className="features mt-4">
                <div className="feature-item">
                  <Star size={20} className="feature-icon" />
                  <span>Atención personalizada</span>
                </div>
                <div className="feature-item">
                  <Star size={20} className="feature-icon" />
                  <span>Equipamiento de última generación</span>
                </div>
                <div className="feature-item">
                  <Star size={20} className="feature-icon" />
                  <span>Médicos especialistas</span>
                </div>
              </div>
              <Link to="/SobreNosotros">
                <button id="btn-about">Conocer más</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Por qué elegirnos - NUEVO */}
      <section className="why-choose-us py-5">
        <div className="container">
          <div className="section-title-container text-center">
            <h3 className="section">¿Por qué elegir MOYBE?</h3>
            <p className="section-subtitle">
              Nos distinguimos por nuestra dedicación y excelencia en el cuidado animal
            </p>
          </div>
          <div className="row g-4 mt-4">
            <div className="col-md-3">
              <div className="choose-card">
                <Award className="choose-icon" />
                <h4>Experiencia</h4>
                <p>Más de 15 años brindando servicios veterinarios de calidad.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="choose-card">
                <Users className="choose-icon" />
                <h4>Equipo Profesional</h4>
                <p>Veterinarios certificados con especialidades diversas.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="choose-card">
                <Clock className="choose-icon" />
                <h4>Horario Extendido</h4>
                <p>Atención de lunes a domingo, incluyendo feriados.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="choose-card">
                <CheckCircle className="choose-icon" />
                <h4>Tecnología Avanzada</h4>
                <p>Equipos de diagnóstico y tratamiento de última generación.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Testimonios - NUEVO */}
        <section className="testimonials py-5">
        <div className="container">
          <div className="section-title-container text-center">
            <h3 className="section">Lo que dicen nuestros clientes</h3>
          </div>

          <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <MessageSquare className="testimonial-quote-icon" />
                    <p>
                      "La atención que recibió mi perrito Max fue excepcional. El Dr. Martínez fue muy amable y
                      profesional, explicándonos todo el proceso de tratamiento. Definitivamente recomiendo MOYBE a
                      todos los dueños de mascotas."
                    </p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">
                        <span>CG</span>
                      </div>
                      <div className="testimonial-info">
                        <h5>Carlos González</h5>
                        <div className="testimonial-stars">
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <MessageSquare className="testimonial-quote-icon" />
                    <p>
                      "Mi gatita Luna necesitaba una cirugía de emergencia y el equipo de MOYBE actuó con rapidez y
                      profesionalismo. El seguimiento post-operatorio fue excelente y ahora Luna está completamente
                      recuperada. ¡Gracias por salvar a mi mascota!"
                    </p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">
                        <span>MR</span>
                      </div>
                      <div className="testimonial-info">
                        <h5>María Rodríguez</h5>
                        <div className="testimonial-stars">
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <MessageSquare className="testimonial-quote-icon" />
                    <p>
                      "Llevo a mis mascotas a MOYBE desde hace años. El servicio de grooming es fantástico y los precios
                      son muy razonables. El personal siempre es amable y mis mascotas salen felices y hermosas. No
                      cambiaría esta veterinaria por ninguna otra."
                    </p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">
                        <span>JL</span>
                      </div>
                      <div className="testimonial-info">
                        <h5>Javier López</h5>
                        <div className="testimonial-stars">
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                          <Star className="star-icon" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-indicators testimonial-indicators">
              <button
                type="button"
                data-bs-target="#testimonialCarousel"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Testimonio 1"
              ></button>
              <button
                type="button"
                data-bs-target="#testimonialCarousel"
                data-bs-slide-to="1"
                aria-label="Testimonio 2"
              ></button>
              <button
                type="button"
                data-bs-target="#testimonialCarousel"
                data-bs-slide-to="2"
                aria-label="Testimonio 3"
              ></button>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}