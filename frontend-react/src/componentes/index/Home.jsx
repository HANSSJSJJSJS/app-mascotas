"use client"

import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import "animate.css"
import { InView } from "react-intersection-observer"
import {
  Phone,
  Calendar,
  Star,
  Clock,
  Award,
  Users,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  PawPrintIcon as Paw,
  Stethoscope,
  Syringe,
} from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"
import "../../stylos/cssIndex/Home.css"
import Carousel from "bootstrap/js/dist/carousel"
import Header from "../index/Header"
import { Emergencia } from "./Emergencia"
import "../../stylos/cssIndex/Emergencia.css"

// Import images
import imgAbout from "../../imagenes/about.png"
import carousel1 from "../../imagenes/carousel-1.jpg"
import carousel2 from "../../imagenes/carousel-2.jpg"
import carousel3 from "../../imagenes/carousel-3.jpg"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeService, setActiveService] = useState(0)
  const servicesRef = useRef(null)
  const services = [
    {
      icon: <Stethoscope className="service-icon" size={48} color="#8196eb" />,
      title: "Medicina General",
      description: "Consultas, vacunación y tratamientos para todo tipo de mascotas.",
      link: "/Servicios",
    },
    {
      icon: <Calendar className="service-icon" size={48} color="#8196eb" />,
      title: "Spa y Grooming",
      description: "Baños, cortes de pelo y cuidados estéticos para tu mascota.",
      link: "/Servicios",
    },
    {
      icon: <Phone className="service-icon" size={48} color="#8196eb" />,
      title: "Emergencias 24/7",
      description: "Atención de urgencias veterinarias las 24 horas del día.",
      link: "/Servicios",
    },
    {
      icon: <Syringe className="service-icon" size={48} color="#8196eb" />,
      title: "Cirugía Especializada",
      description: "Procedimientos quirúrgicos con equipos de última generación.",
      link: "/Servicios",
    },
  ]

  useEffect(() => {
    // Inicializar el carrusel cuando el componente se monta
    const carouselElement = document.getElementById("heroCarousel")
    if (carouselElement) {
      const carousel = new Carousel(carouselElement, {
        interval: 5000,
        ride: "carousel",
        wrap: true,
      })
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

    // Marcar como cargado para activar animaciones
    setIsLoaded(true)

    // Configurar intervalo para cambiar el servicio activo
    const serviceInterval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length)
    }, 3000)

    // Limpiar event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", adjustContentPadding)
      clearInterval(serviceInterval)
    }
  }, [])

  // Función para desplazarse a la sección de servicios
  const scrollToServices = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <main className="main-content">
      <Header />

      {/* Hero Section */}
      <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div
            className="carousel-item active"
            style={{
              background: `linear-gradient(rgba(194, 216, 255, 0.6), rgba(129, 150, 235, 0.7)), url(${carousel1}) center/cover no-repeat`,
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
              background: `linear-gradient(rgba(194, 216, 255, 0.6), rgba(129, 150, 235, 0.7)), url(${carousel2}) center/cover no-repeat`,
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
              background: `linear-gradient(rgba(194, 216, 255, 0.6), rgba(129, 150, 235, 0.7)), url(${carousel3}) center/cover no-repeat`,
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

        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
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
      <section className="services" ref={servicesRef}>
        <div className="container">
          <div className="section-title-container text-center">
            <InView
              as="div"
              onChange={(inView, entry) => {
                if (inView) {
                  entry.target.classList.add("animate__animated", "animate__fadeInDown")
                } else {
                  entry.target.classList.remove("animate__animated", "animate__fadeInDown")
                }
              }}
              triggerOnce={true}
            >
              <h3 className="section">Nuestros Servicios</h3>
              <p className="section-subtitle">Ofrecemos atención integral para el bienestar de tu mascota</p>
            </InView>
          </div>

          <div className="services-showcase">
            <div className="services-tabs">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`service-tab ${activeService === index ? "active" : ""}`}
                  onClick={() => setActiveService(index)}
                >
                  <div className="service-tab-icon">{service.icon}</div>
                  <h4>{service.title}</h4>
                </div>
              ))}
            </div>

            <div className="service-content">
              {services.map((service, index) => (
                <div key={index} className={`service-detail ${activeService === index ? "active" : ""}`}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <Link to={service.link} className="service-link">
                    Más información <ChevronRight size={16} />
                  </Link>
                </div>
              ))}
              <div className="service-background">
                <Paw size={200} color="rgba(194, 216, 255, 0.2)" />
              </div>
            </div>
          </div>
        </div>
        <div className="services-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="about py-5">
        <div className="container">
          <InView triggerOnce={true}>
            {({ inView, ref }) => (
              <div ref={ref} className="row align-items-center">
                <div
                  className={`col-lg-6 col-md-12 mb-4 mb-lg-0 ${inView ? "animate__animated animate__fadeInLeft" : ""}`}
                >
                  <div className="about-image-container">
                    <img
                      src={imgAbout || "/placeholder.svg"}
                      alt="Veterinario Moybe"
                      className="img-fluid rounded shadow"
                    />
                    <div className="about-image-overlay">
                      <span>Moybe</span>
                    </div>
                  </div>
                </div>
                <div className={`col-lg-6 col-md-12 ps-lg-5 ${inView ? "animate__animated animate__fadeInRight" : ""}`}>
                  <h3 className="section">Sobre Nosotros</h3>
                  <p className="about-text">
                    Moybe es una clínica veterinaria comprometida con ofrecer el mejor cuidado para tu mascota. Contamos
                    con un equipo de profesionales altamente calificados y las instalaciones más modernas.
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
            )}
          </InView>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us py-5">
        <div className="container">
          <div className="section-title-container text-center">
            <InView
              as="div"
              onChange={(inView, entry) => {
                if (inView) {
                  entry.target.classList.add("animate__animated", "animate__fadeInDown")
                }
              }}
              triggerOnce={true}
            >
              <h3 className="section">¿Por qué elegir MOYBE?</h3>
              <p className="section-subtitle">
                Nos distinguimos por nuestra dedicación y excelencia en el cuidado animal
              </p>
            </InView>
          </div>
          <div className="row g-4 mt-4">
            <InView triggerOnce={true}>
              {({ inView, ref }) => (
                <div ref={ref} className="col-lg-3 col-md-6 mb-4">
                  <div className={`choose-card ${inView ? "animate__animated animate__zoomIn animate__delay-1s" : ""}`}>
                    <Award className="choose-icon" />
                    <h4>Experiencia</h4>
                    <p>Más de 15 años brindando servicios veterinarios de calidad.</p>
                  </div>
                </div>
              )}
            </InView>
            <InView triggerOnce={true}>
              {({ inView, ref }) => (
                <div ref={ref} className="col-lg-3 col-md-6 mb-4">
                  <div className={`choose-card ${inView ? "animate__animated animate__zoomIn animate__delay-2s" : ""}`}>
                    <Users className="choose-icon" />
                    <h4>Equipo Profesional</h4>
                    <p>Veterinarios certificados con especialidades diversas.</p>
                  </div>
                </div>
              )}
            </InView>
            <InView triggerOnce={true}>
              {({ inView, ref }) => (
                <div ref={ref} className="col-lg-3 col-md-6 mb-4">
                  <div className={`choose-card ${inView ? "animate__animated animate__zoomIn animate__delay-3s" : ""}`}>
                    <Clock className="choose-icon" />
                    <h4>Horario Extendido</h4>
                    <p>Atención de lunes a domingo, incluyendo feriados.</p>
                  </div>
                </div>
              )}
            </InView>
            <InView triggerOnce={true}>
              {({ inView, ref }) => (
                <div ref={ref} className="col-lg-3 col-md-6 mb-4">
                  <div className={`choose-card ${inView ? "animate__animated animate__zoomIn animate__delay-4s" : ""}`}>
                    <CheckCircle className="choose-icon" />
                    <h4>Tecnología Avanzada</h4>
                    <p>Equipos de diagnóstico y tratamiento de última generación.</p>
                  </div>
                </div>
              )}
            </InView>
          </div>
        </div>
        <div className="choose-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials py-5">
        <div className="container">
          <div className="section-title-container text-center mb-5">
            <InView
              as="div"
              onChange={(inView, entry) => {
                if (inView) {
                  entry.target.classList.add("animate__animated", "animate__fadeInDown")
                }
              }}
              triggerOnce={true}
            >
              <h3 className="section">Lo que dicen nuestros clientes</h3>
            </InView>
          </div>

          <div className="row g-4">
            {/* Testimonio 1 */}
            <InView triggerOnce={true}>
              {({ inView, ref }) => (
                <div ref={ref} className="col-lg-4 col-md-6 mb-4">
                  <div
                    className={`testimonial-card ${inView ? "animate__animated animate__fadeInUp animate__delay-1s" : ""}`}
                  >
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
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="star-icon" size={16} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </InView>

            {/* Testimonio 2 */}
            <InView triggerOnce={true}>
              {({ inView, ref }) => (
                <div ref={ref} className="col-lg-4 col-md-6 mb-4">
                  <div
                    className={`testimonial-card ${inView ? "animate__animated animate__fadeInUp animate__delay-2s" : ""}`}
                  >
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
              )}
            </InView>

            {/* Testimonio 3 */}
            <InView triggerOnce={true}>
              {({ inView, ref }) => (
                <div ref={ref} className="col-lg-4 col-md-6 mb-4">
                  <div
                    className={`testimonial-card ${inView ? "animate__animated animate__fadeInUp animate__delay-3s" : ""}`}
                  >
                    <div className="testimonial-content">
                      <MessageSquare className="testimonial-quote-icon" />
                      <p>
                        "El servicio de peluquería canina es increíble. Mi perro Rocky siempre vuelve feliz y con un
                        corte impecable. El personal es muy cariñoso con los animales y los precios son justos. 100%
                        recomendado."
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
              )}
            </InView>
          </div>
        </div>
      </section>

      {/* Nuevas secciones */}
      <Emergencia />
    </main>
  )
}
