import { useEffect } from "react"
import { useState } from "react"
import { useInView } from "react-intersection-observer"
import { Heart, Phone, Calendar, Thermometer, PawPrintIcon as Paw } from 'lucide-react'
import { Link } from "react-router-dom"

export const Emergencia = () => {
  const [animatedStats, setAnimatedStats] = useState({
    patients: 0,
    years: 0,
    specialists: 0,
    satisfaction: 0,
  })

  const stats = {
    patients: 5000,
    years: 15,
    specialists: 12,
    satisfaction: 98,
  }

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  useEffect(() => {
    if (!inView) return

    const duration = 2000 // ms
    const frameDuration = 1000 / 60
    const totalFrames = Math.round(duration / frameDuration)
    let frame = 0

    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      setAnimatedStats({
        patients: Math.floor(progress * stats.patients),
        years: Math.floor(progress * stats.years),
        specialists: Math.floor(progress * stats.specialists),
        satisfaction: Math.floor(progress * stats.satisfaction),
      })

      if (frame === totalFrames) {
        clearInterval(timer)
      }
    }, frameDuration)

    return () => clearInterval(timer)
  }, [inView])

  // Función para animar estadísticas desde otro InView
  const animateStat = (isInView) => {
    if (!isInView) return

    const duration = 2000 // ms
    const frameDuration = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration / frameDuration)
    let frame = 0

    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      setAnimatedStats({
        patients: Math.floor(progress * stats.patients),
        years: Math.floor(progress * stats.years),
        specialists: Math.floor(progress * stats.specialists),
        satisfaction: Math.floor(progress * stats.satisfaction),
      })

      if (frame === totalFrames) {
        clearInterval(timer)
      }
    }, frameDuration)

    return () => clearInterval(timer)
  }

  return (
    <>
      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="section-title-container text-center mb-5">
            <div
              ref={ref}
              className={inView ? "animate__animated animate__fadeInDown" : ""}
            >
              <h3 className="section">Moybe en Números</h3>
              <p className="section-subtitle">
                Nuestro compromiso con la excelencia se refleja en nuestras estadísticas
              </p>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-6 col-md-3 mb-4">
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Paw className="stat-icon" />
                </div>
                <div className="stat-number">
                  <span className="counter">{animatedStats.patients.toLocaleString()}+</span>
                </div>
                <div className="stat-title">Pacientes Atendidos</div>
              </div>
            </div>

            <div className="col-6 col-md-3 mb-4">
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Calendar className="stat-icon" />
                </div>
                <div className="stat-number">
                  <span className="counter">{animatedStats.years}</span>
                </div>
                <div className="stat-title">Años de Experiencia</div>
              </div>
            </div>

            <div className="col-6 col-md-3 mb-4">
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Thermometer className="stat-icon" />
                </div>
                <div className="stat-number">
                  <span className="counter">{animatedStats.specialists}</span>
                </div>
                <div className="stat-title">Especialistas</div>
              </div>
            </div>

            <div className="col-6 col-md-3 mb-4">
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <Heart className="stat-icon" />
                </div>
                <div className="stat-number">
                  <span className="counter">{animatedStats.satisfaction}%</span>
                </div>
                <div className="stat-title">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Call Section */}
      <section className="emergency-section">
        <div className="emergency-overlay"></div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="emergency-content">
                <h3 className="emergency-title">¿Emergencia Veterinaria?</h3>
                <p className="emergency-text">
                  Estamos disponibles 24/7 para atender cualquier emergencia. Nuestro equipo de veterinarios está listo
                  para ayudar a tu mascota en momentos críticos.
                </p>
                <div className="emergency-phone">
                  <div className="phone-icon-wrapper">
                    <Phone className="phone-icon" />
                  </div>
                  <a href="tel:+123456789" className="phone-number">
                    (57) 317-246-7061
                  </a>
                </div>
                <Link to="/Login" className="emergency-button">
                  Reservar Cita Urgente
                </Link>
              </div>
            </div>
          </div>
          <div className="paw-prints">
            <Paw className="paw-print paw-1" />
            <Paw className="paw-print paw-2" />
            <Paw className="paw-print paw-3" />
            <Paw className="paw-print paw-4" />
          </div>
        </div>
      </section>
    </>
  )
}

export default Emergencia