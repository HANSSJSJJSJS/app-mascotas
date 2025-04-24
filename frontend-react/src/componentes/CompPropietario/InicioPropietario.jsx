"use client"

import { useState, useEffect } from 'react'
import { Calendar, Clock, PawPrint, FileText, Bell, Stethoscope, Pill, ChevronRight, User, MapPin, Phone } from 'lucide-react'
import "../../stylos/cssPropietario/InicioPropietario.css"

const InicioPropietario = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState('')

  // Datos de ejemplo
  const propietario = {
    nombre: "Juan",
    apellido: "Pérez",
    mascotas: [
      { id: 1, nombre: "Max", especie: "Perro", raza: "Labrador", edad: 3, imagen: "/placeholder.svg?height=80&width=80" },
      { id: 2, nombre: "Luna", especie: "Gato", raza: "Siamés", edad: 2, imagen: "/placeholder.svg?height=80&width=80" }
    ],
    proximasCitas: [
      { id: 1, fecha: "2023-06-15", hora: "10:30", mascota: "Max", tipo: "Vacunación", veterinario: "Dr. García" },
      { id: 2, fecha: "2023-06-22", hora: "16:00", mascota: "Luna", tipo: "Control", veterinario: "Dra. Rodríguez" }
    ],
    recordatorios: [
      { id: 1, texto: "Desparasitación de Max", fecha: "2023-06-10" },
      { id: 2, texto: "Comprar alimento para Luna", fecha: "2023-06-08" }
    ]
  }

  // Determinar el saludo según la hora del día
  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours()
      if (currentHour < 12) {
        setGreeting('Buenos días')
      } else if (currentHour < 18) {
        setGreeting('Buenas tardes')
      } else {
        setGreeting('Buenas noches')
      }
    }

    updateGreeting()
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      updateGreeting()
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Formatear fecha para mostrar
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('es-ES', options)
  }

  // Verificar si una fecha es hoy
  const isToday = (dateString) => {
    const today = new Date()
    const date = new Date(dateString)
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }

  return (
    <div className="page-content">
      <div className="welcome-header">
        <div className="welcome-text">
          <h1 className="welcome-title">
            {greeting}, {propietario.nombre}
          </h1>
          <p className="welcome-date">
            <Calendar className="icon" size={16} />
            {currentTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="welcome-time">
          <Clock className="time-icon" size={24} />
          <span>{currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-column main-column">
          <section className="dashboard-section">
            <h2 className="section-title">Resumen</h2>
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon">
                  <PawPrint size={24} />
                </div>
                <div className="stat-info">
                  <h3>Mascotas</h3>
                  <p className="stat-value">{propietario.mascotas.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <h3>Próximas citas</h3>
                  <p className="stat-value">{propietario.proximasCitas.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Bell size={24} />
                </div>
                <div className="stat-info">
                  <h3>Recordatorios</h3>
                  <p className="stat-value">{propietario.recordatorios.length}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Próximas citas</h2>
              <button className="view-all-button">
                Ver todas <ChevronRight size={16} />
              </button>
            </div>
            <div className="appointments-container">
              {propietario.proximasCitas.map(cita => (
                <div key={cita.id} className={`appointment-card ${isToday(cita.fecha) ? 'today' : ''}`}>
                  <div className="appointment-icon">
                    {cita.tipo === 'Vacunación' ? (
                      <Pill size={24} />
                    ) : (
                      <Stethoscope size={24} />
                    )}
                  </div>
                  <div className="appointment-details">
                    <h3>{cita.tipo} - {cita.mascota}</h3>
                    <p className="appointment-date">
                      <Calendar className="mini-icon" size={14} /> {formatDate(cita.fecha)}
                    </p>
                    <p className="appointment-time">
                      <Clock className="mini-icon" size={14} /> {cita.hora} - {cita.veterinario}
                    </p>
                  </div>
                  <div className="appointment-actions">
                    <button className="action-button">Detalles</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Recordatorios</h2>
              <button className="view-all-button">
                Ver todos <ChevronRight size={16} />
              </button>
            </div>
            <div className="reminders-container">
              {propietario.recordatorios.map(recordatorio => (
                <div key={recordatorio.id} className={`reminder-card ${isToday(recordatorio.fecha) ? 'today' : ''}`}>
                  <div className="reminder-icon">
                    <Bell size={20} />
                  </div>
                  <div className="reminder-details">
                    <p className="reminder-text">{recordatorio.texto}</p>
                    <p className="reminder-date">
                      <Calendar className="mini-icon" size={14} /> {formatDate(recordatorio.fecha)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="dashboard-column side-column">
          <section className="dashboard-section">
            <h2 className="section-title">Mis mascotas</h2>
            <div className="pets-container">
              {propietario.mascotas.map(mascota => (
                <div key={mascota.id} className="pet-card">
                  <div className="pet-image-container">
                    <img src={mascota.imagen || "/placeholder.svg"} alt={mascota.nombre} className="pet-image" />
                  </div>
                  <div className="pet-details">
                    <h3 className="pet-name">{mascota.nombre}</h3>
                    <p className="pet-breed">{mascota.especie} - {mascota.raza}</p>
                    <p className="pet-age">{mascota.edad} años</p>
                  </div>
                  <button className="pet-details-button">
                    Ver ficha <ChevronRight size={16} />
                  </button>
                </div>
              ))}
              <div className="add-pet-card">
                <div className="add-icon">+</div>
                <p>Agregar mascota</p>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2 className="section-title">Accesos rápidos</h2>
            <div className="quick-links">
              <a href="#" className="quick-link-card">
                <Calendar size={20} />
                <span>Agendar cita</span>
              </a>
              <a href="#" className="quick-link-card">
                <FileText size={20} />
                <span>Historial clínico</span>
              </a>
              <a href="#" className="quick-link-card">
                <User size={20} />
                <span>Mi perfil</span>
              </a>
              <a href="#" className="quick-link-card">
                <MapPin size={20} />
                <span>Ubicación</span>
              </a>
              <a href="#" className="quick-link-card">
                <Phone size={20} />
                <span>Contacto</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default InicioPropietario
