"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import "animate.css"
import { InView } from "react-intersection-observer"
import { Heart, Phone, Calendar, Star, Clock, Award, Users, MessageSquare, CheckCircle } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"
import "../../stylos/cssIndex/Home.css"
import Carousel from "bootstrap/js/dist/carousel"
import Header from "../index/Header"

// Import images
import imgAbout from "../../imagenes/about.png"
import carousel1 from "../../imagenes/carousel-1.jpg"
import carousel2 from "../../imagenes/carousel-2.jpg"
import carousel3 from "../../imagenes/carousel-3.jpg"

export default function Home() {
  useEffect(() => {
    // Inicializar el carrusel cuando el componente se monta
    const carouselElement = document.getElementById("heroCarousel")
    if (carouselElement) {
      const carousel = new Carousel(carouselElement)
      carousel.cycle()
    }

    // Ajustar el padding-top del contenido principal basado en la altura del header
    const adjustContentPadding = () => {
      const header = document.querySelector(".header-wrapper")
      if (header) {
        const headerHeight = header.offsetHeight
        document.querySelector(".main-content").style.paddingTop = `${headerHeight}px`
      }
    }

    // Ejecutar al cargar y al cambiar el tamaño de la ventana
    adjustContentPadding()
    window.addEventListener("resize", adjustContentPadding)

    // Limpiar event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", adjustContentPadding)
    }
  }, [])

  return (
    <main className="main-content">
      <Header />

      {/* Hero Section */}
      <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div
            className="carousel-item active"
            style={{
              background: `linear-gradient(rgba(194, 216, 255, 0.5), rgba(129, 150, 235, 0.5)), url(${carousel1}) center/cover no-repeat`,
              minHeight: "100vh",
            }}
          >
            <div className="container h-100 d-flex align-items-center justify-content-center carousel-content">
              <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                  <h2 className="hero-title">Cuidado Veterinario de Calidad</h2>
                  <p className="lead text-white">En Moybe nos preocupamos por la salud y bienestar de tu mascota</p>
                  <div className="button-container">
                    <Link to="/Login" className="button type1">
                      <span className="btn-txt">Reservar Cita</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="carousel-item"
            style={{
              background: `linear-gradient(rgba(194, 216, 255, 0.5), rgba(129, 150, 235, 0.5)), url(${carousel2}) center/cover no-repeat`,
              minHeight: "100vh",
            }}
          >
            <div className="container h-100 d-flex align-items-center justify-content-center carousel-content">
              <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                  <h2 className="hero-title">Servicios Especializados</h2>
                  <p className="lead text-white">Contamos con equipos de última generación</p>
                  <div className="button-container">
                    <Link to="/Login" className="button type1">
                      <span className="btn-txt">Reservar Cita</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="carousel-item"
            style={{
              background: `linear-gradient(rgba(194, 216, 255, 0.5), rgba(129, 150, 235, 0.5)), url(${carousel3}) center/cover no-repeat`,
              minHeight: "100vh",
            }}
          >
            <div className="container h-100 d-flex align-items-center justify-content-center carousel-content">
              <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                  <h2 className="hero-title">Atención 24/7</h2>
                  <p className="lead text-white">Emergencias veterinarias cuando las necesites</p>
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

        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <div className="section-title-container">
            <InView
              as="div"
              onChange={(inView, entry) => {
                if (inView) {
                  entry.target.classList.add("animate__animated", "animate__backInLeft")
                } else {
                  entry.target.classList.remove("animate__animated", "animate__backInLeft")
                }
              }}
              triggerOnce={true}
            >
              <h3 className="section">Nuestros Servicios</h3>
            </InView>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="service-card">
                <Heart className="service-icon" size={48} color="#8196eb" />
                <h4>Medicina General</h4>
                <p>Consultas, vacunación y tratamientos para todo tipo de mascotas.</p>
                <Link to="/Servicios" className="service-link">
                  Más información
                </Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="service-card">
                <Calendar className="service-icon" size={48} color="#8196eb" />
                <h4>Spa y Grooming</h4>
                <p>Baños, cortes de pelo y cuidados estéticos para tu mascota.</p>
                <Link to="/Servicios" className="service-link">
                  Más información
                </Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="service-card">
                <Phone className="service-icon" size={48} color="#8196eb" />
                <h4>Emergencias 24/7</h4>
                <p>Atención de urgencias veterinarias las 24 horas del día.</p>
                <Link to="/Servicios" className="service-link">
                  Más información
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
              <img src={imgAbout || "/placeholder.svg"} alt="Veterinario Moybe" className="img-fluid rounded shadow" />
            </div>
            <div className="col-lg-6 col-md-12 ps-lg-5">
              <h3 className="section">Sobre Nosotros</h3>
              <p>
                Moybe es una clínica veterinaria comprometida con ofrecer el mejor cuidado para tu mascota. Contamos con
                un equipo de profesionales altamente calificados y las instalaciones más modernas.
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

      {/* Why Choose Us Section */}
      <section className="why-choose-us py-5">
        <div className="container">
          <div className="section-title-container text-center">
            <h3 className="section">¿Por qué elegir MOYBE?</h3>
            <p className="section-subtitle">
              Nos distinguimos por nuestra dedicación y excelencia en el cuidado animal
            </p>
          </div>
          <div className="row g-4 mt-4">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="choose-card">
                <Award className="choose-icon" />
                <h4>Experiencia</h4>
                <p>Más de 15 años brindando servicios veterinarios de calidad.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="choose-card">
                <Users className="choose-icon" />
                <h4>Equipo Profesional</h4>
                <p>Veterinarios certificados con especialidades diversas.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="choose-card">
                <Clock className="choose-icon" />
                <h4>Horario Extendido</h4>
                <p>Atención de lunes a domingo, incluyendo feriados.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="choose-card">
                <CheckCircle className="choose-icon" />
                <h4>Tecnología Avanzada</h4>
                <p>Equipos de diagnóstico y tratamiento de última generación.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials py-5">
        <div className="container">
          <div className="section-title-container text-center mb-5">
            <h3 className="section">Lo que dicen nuestros clientes</h3>
          </div>

          <div className="row g-4">
            {/* Testimonio 1 */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <MessageSquare className="testimonial-quote-icon" />
                  <p>
                    "La atención que recibió mi perrito Max fue excepcional. El Dr. Martínez fue muy amable y
                    profesional, explicándonos todo el proceso de tratamiento. Definitivamente recomiendo MOYBE a todos
                    los dueños de mascotas."
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      <span>CG</span>
                    </div>
                    <div className="testimonial-info">
                      <h5>Carlos González</h5>
                      <div className="testimonial-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="star-icon" size={16} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="col-lg-4 col-md-6 mb-4">
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
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="star-icon" size={16} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <MessageSquare className="testimonial-quote-icon" />
                  <p>
                    "El servicio de peluquería canina es increíble. Mi perro Rocky siempre vuelve feliz y con un corte
                    impecable. El personal es muy cariñoso con los animales y los precios son justos. 100% recomendado."
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      <span>AP</span>
                    </div>
                    <div className="testimonial-info">
                      <h5>Ana Pérez</h5>
                      <div className="testimonial-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="star-icon" size={16} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
