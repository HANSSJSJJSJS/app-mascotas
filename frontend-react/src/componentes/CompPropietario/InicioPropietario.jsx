"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  PawPrint,
  Clock,
  ChevronRight,
  CalendarIcon,
  ClockIcon,
  Activity,
  Shield,
  User,
  Heart,
  AlertCircle,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../../stylos/cssPropietario/InicioPropietario.css"

export default function InicioPropietario() {
  const [mascotas, setMascotas] = useState([])
  const [formattedDate, setFormattedDate] = useState("")
  const [formattedTime, setFormattedTime] = useState("")
  const [citas, setCitas] = useState([])
  const [recordatoriosPendientes, setRecordatoriosPendientes] = useState(0)
  const [servicios, setServicios] = useState([])
  const [historiales, setHistoriales] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [veterinarios, setVeterinarios] = useState([])
  const [estadisticas, setEstadisticas] = useState({
    mascotasVacunadas: 0,
    mascotasEsterilizadas: 0,
    citasRealizadas: 0,
    citasPendientes: 0,
  })
  const [filtroMascotas, setFiltroMascotas] = useState("")
  const [filtroCitas, setFiltroCitas] = useState("todas")
  const [mostrarMenuCita, setMostrarMenuCita] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Formatear fecha y hora
    const today = new Date()
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    setFormattedDate(today.toLocaleDateString("es-ES", options))

    // Actualizar la hora cada minuto
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      setFormattedTime(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`)
    }

    updateTime()
    const timeInterval = setInterval(updateTime, 60000)

    // Obtener datos del usuario
    const fetchUserData = async () => {
      try {
        const usuarioActual = JSON.parse(localStorage.getItem("pet-app-user"))
        if (!usuarioActual?.id_usuario) {
          console.error("ID de usuario no disponible")
          return
        }

        setUsuario(usuarioActual)

        // Obtener mascotas del usuario
        const mascotasResponse = await axios.get(`http://localhost:3001/api/mascotas/${usuarioActual.id_usuario}`)
        setMascotas(mascotasResponse.data)

        // Calcular estadísticas de mascotas
        const vacunadas = mascotasResponse.data.filter((mascota) => mascota.vacunado).length
        const esterilizadas = mascotasResponse.data.filter((mascota) => mascota.esterilizado).length

        // Obtener citas usando la nueva API
        const citasResponse = await axios.get(
          `http://localhost:3001/api/citas?propietarioId=${usuarioActual.id_usuario}`,
        )
        const citasObtenidas = citasResponse.data
        setCitas(citasObtenidas)

        // Contar citas por estado
        const pendientes = citasObtenidas.filter((cita) => cita.estado === "PENDIENTE").length
        const realizadas = citasObtenidas.filter((cita) => cita.estado === "REALIZADA").length
        setRecordatoriosPendientes(pendientes)

        // Actualizar estadísticas
        setEstadisticas({
          mascotasVacunadas: vacunadas,
          mascotasEsterilizadas: esterilizadas,
          citasRealizadas: realizadas,
          citasPendientes: pendientes,
        })

        // Obtener servicios disponibles
        try {
          const serviciosResponse = await axios.get(`http://localhost:3001/api/admin/servicios`)
          setServicios(serviciosResponse.data)
        } catch (error) {
          console.error("Error al obtener servicios:", error)
          setServicios([])
        }

        // Obtener historiales médicos
        const historialesResponse = await axios.get(
          `http://localhost:3001/api/propietario/${usuarioActual.id_usuario}/historiales`,
        )
        setHistoriales(historialesResponse.data)

        // Obtener veterinarios
        const veterinariosResponse = await axios.get(`http://localhost:3001/api/veterinarios`)
        setVeterinarios(veterinariosResponse.data)
      } catch (error) {
        console.error("Error al obtener datos:", error)
      }
    }

    fetchUserData()
    return () => clearInterval(timeInterval)
  }, [])

  // Filtrar mascotas según el término de búsqueda
  const mascotasFiltradas = mascotas.filter(
    (mascota) =>
      (mascota.nom_mas && mascota.nom_mas.toLowerCase().includes(filtroMascotas.toLowerCase())) ||
      (mascota.especie && mascota.especie.toLowerCase().includes(filtroMascotas.toLowerCase())) ||
      (mascota.raza && mascota.raza.toLowerCase().includes(filtroMascotas.toLowerCase())),
  )

  // Filtrar citas según el estado seleccionado
  const citasFiltradas = citas.filter((cita) => {
    if (filtroCitas === "todas") return true
    return cita.estado === filtroCitas.toUpperCase()
  })

  // Ordenar citas por fecha (las más próximas primero)
  const citasOrdenadas = [...citasFiltradas].sort((a, b) => {
    return new Date(a.fecha) - new Date(b.fecha)
  })

  // Obtener citas próximas (en los próximos 7 días)
  const citasProximas = citasOrdenadas.filter((cita) => {
    if (filtroCitas !== "todas" && filtroCitas !== "pendiente") return true

    const hoy = new Date()
    const fechaCita = new Date(cita.fecha)
    const diffTime = fechaCita - hoy
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays >= 0 && diffDays <= 7
  })

  // Utilidad para obtener la URL de la imagen de la mascota
  function getImageUrl(foto) {
    if (!foto || foto === "default.jpg") return "/placeholder.svg"
    return `http://localhost:3001/uploads/mascotas/${foto}`
  }

  // Funciones para manejar las citas
  const handleConfirmarCita = async (cita) => {
    try {
      await axios.put(`http://localhost:3001/api/citas/${cita.id}`, {
        estado: "CONFIRMADA",
      })
      // Actualizar el estado local
      setCitas(citas.map((c) => (c.id === cita.id ? { ...c, estado: "CONFIRMADA" } : c)))
      alert("Cita confirmada exitosamente")
    } catch (error) {
      console.error("Error al confirmar cita:", error)
      alert("Error al confirmar la cita")
    }
  }

  const handleCancelarCita = async (cita) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      try {
        await axios.put(`http://localhost:3001/api/citas/${cita.id}`, {
          estado: "CANCELADA",
        })
        // Actualizar el estado local
        setCitas(citas.map((c) => (c.id === cita.id ? { ...c, estado: "CANCELADA" } : c)))
        alert("Cita cancelada exitosamente")
      } catch (error) {
        console.error("Error al cancelar cita:", error)
        alert("Error al cancelar la cita")
      }
    }
  }

  const handleReprogramarCita = (cita) => {
    navigate("/PanelPropietario/agendar-cita", { state: { citaEditar: cita } })
  }

  const getDaysUntilAppointment = (dateString) => {
    const today = new Date()
    const appointmentDate = new Date(dateString)
    const diffTime = appointmentDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Hoy"
    if (diffDays === 1) return "Mañana"
    if (diffDays > 1) return `En ${diffDays} días`
    return "Pasada"
  }

  const getStatusBadge = (estado) => {
    const statusConfig = {
      PENDIENTE: { class: "status-badge-pending", label: "Pendiente", icon: Clock },
      CONFIRMADA: { class: "status-badge-confirmed", label: "Confirmada", icon: CheckCircle },
      REALIZADA: { class: "status-badge-completed", label: "Realizada", icon: CheckCircle },
      CANCELADA: { class: "status-badge-cancelled", label: "Cancelada", icon: XCircle },
    }

    const config = statusConfig[estado] || statusConfig.PENDIENTE
    const IconComponent = config.icon

    return (
      <span className={`appointment-status-new ${config.class}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    )
  }

  // Devuelve true si la cita está confirmada
  const isConfirmedAppointment = (cita) => cita.estado === "CONFIRMADA"

  // Devuelve true si faltan más de 24 horas para la cita
  const canCancelConfirmedAppointment = (cita) => {
    if (cita.estado !== "CONFIRMADA") return false
    const citaDateTime = new Date(`${cita.fecha}T${cita.hora}`)
    const now = new Date()
    const diffMs = citaDateTime - now
    const diffHours = diffMs / (1000 * 60 * 60)
    return diffHours > 24
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6">
        <div className="container-index">
          {/* Encabezado con información del usuario */}
          <div className="welcome-header">
            <div>
              <h2 className="welcome-title">Bienvenido a Moybe, {usuario?.nombre}</h2>
              <div className="welcome-date">
                <Calendar size={16} className="mini-icon" />
                <span>{formattedDate}</span>
              </div>
            </div>
            <div className="welcome-time">
              <Clock size={16} className="time-icon" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Sección de resumen con más estadísticas */}
          <div className="dashboard-section">
            <h3 className="section-title">Resumen</h3>
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon">
                  <PawPrint size={18} />
                </div>
                <div className="stat-info">
                  <h3>Mascotas</h3>
                  <div className="stat-value">{mascotas.length}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={18} />
                </div>
                <div className="stat-info">
                  <h3>Próximas citas</h3>
                  <div className="stat-value">{estadisticas.citasPendientes}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Shield size={18} />
                </div>
                <div className="stat-info">
                  <h3>Vacunadas</h3>
                  <div className="stat-value">{estadisticas.mascotasVacunadas}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Activity size={18} />
                </div>
                <div className="stat-info">
                  <h3>Citas realizadas</h3>
                  <div className="stat-value">{estadisticas.citasRealizadas}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de acciones rápidas */}
          <div className="dashboard-section">
            <h3 className="section-title">Acciones rápidas</h3>
            <div className="quick-actions">
              <button className="quick-action-button" onClick={() => navigate("/PanelPropietario/agendar-cita")}>
                <Calendar size={18} />
                <span>Agendar cita</span>
              </button>
              <button className="quick-action-button" onClick={() => navigate("/PanelPropietario/mascota-form")}>
                <Plus size={18} />
                <span>Nueva mascota</span>
              </button>
              <button
                className="quick-action-button"
                onClick={() => navigate("/PanelPropietario/ActualizarPropietario")}
              >
                <User size={18} />
                <span>Mi perfil</span>
              </button>
            </div>
          </div>

          {/* Mis mascotas con buscador */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title">Mis mascotas</h3>
              <div className="section-actions">
                <div className="search-container">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar mascota..."
                    className="search-input"
                    value={filtroMascotas}
                    onChange={(e) => setFiltroMascotas(e.target.value)}
                  />
                </div>
                <button className="view-all-button" onClick={() => navigate("/PanelPropietario/mascota")}>
                  Ver todas <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="pets-grid">
              {mascotasFiltradas.length > 0 ? (
                mascotasFiltradas.map((mascota, index) => (
                  <div key={index} className="pet-card">
                    <div className="pet-header">
                      <div className="pet-image-container">
                        <img
                          src={getImageUrl(mascota.foto) || "/placeholder.svg"}
                          alt={mascota.nom_mas}
                          className="pet-image"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=200&width=200"
                          }}
                        />
                      </div>
                      <div className="pet-badges">
                        {mascota.vacunado && (
                          <span className="pet-badge vaccinated" title="Vacunado">
                            <Shield size={12} />
                          </span>
                        )}
                        {mascota.esterilizado && (
                          <span className="pet-badge neutered" title="Esterilizado">
                            <Heart size={12} />
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pet-details">
                      <h4 className="pet-name">{mascota.nombre}</h4>
                      <p className="pet-breed">
                        {mascota.tipo} {mascota.raza}
                      </p>
                      <p className="pet-age">
                        {Math.floor(mascota.edad)} años • {mascota.genero}
                      </p>
                      <p className="pet-weight">{mascota.peso} kg</p>
                      {mascota.ultima_visita && (
                        <p className="pet-last-visit">
                          <span>Última visita:</span> {new Date(mascota.ultima_visita).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="pet-actions">
                      <button
                        className="pet-action-button secondary"
                        onClick={() => navigate("/PanelPropietario/agendar-cita")}
                      >
                        Agendar cita
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results">No se encontraron mascotas con ese criterio.</p>
              )}
              {/* Card para agregar mascota */}
              <div className="add-pet-card" onClick={() => navigate("/PanelPropietario/mascota-form")}>
                <span className="add-icon">+</span>
                <span>Agregar mascota</span>
              </div>
            </div>
          </div>

          {/* Sección de citas mejorada */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title">Próximas citas</h3>
              <div className="section-actions">
                <div className="filter-container">
                  <Filter size={16} className="filter-icon" />
                  <select
                    className="filter-select"
                    value={filtroCitas}
                    onChange={(e) => setFiltroCitas(e.target.value)}
                  >
                    <option value="todas">Todas las citas</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="confirmada">Confirmadas</option>
                    <option value="realizada">Realizadas</option>
                    <option value="cancelada">Canceladas</option>
                  </select>
                </div>
                <button className="view-all-button" onClick={() => navigate("/PanelPropietario/citas")}>
                  Ver todas <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {citasProximas.length > 0 ? (
              <>
                <div className="citas-counter">
                  <span className="counter-text">
                    Mostrando {citasProximas.length} cita{citasProximas.length !== 1 ? "s" : ""}
                    {filtroCitas !== "todas" && ` (${filtroCitas})`}
                  </span>
                </div>

                <div className="appointments-container-improved">
                  {citasProximas.map((cita, index) => (
                    <div key={index} className={`appointment-card-improved ${cita.estado.toLowerCase()}`}>
                      <div className="appointment-main-content">
                        <div className="appointment-icon-improved">
                          <Calendar size={18} />
                        </div>

                        <div className="appointment-details-improved">
                          <div className="appointment-header-improved">
                            <h3 className="appointment-title">
                              {cita.servicio || "Consulta general"} - {cita.mascota}
                            </h3>
                            {getStatusBadge(cita.estado)}
                          </div>

                          <div className="appointment-info-grid">
                            <div className="appointment-info-item">
                              <CalendarIcon size={14} className="info-icon" />
                              <span>
                                {new Date(cita.fecha).toLocaleDateString("es-ES", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                              <span className="days-badge">{getDaysUntilAppointment(cita.fecha)}</span>
                            </div>

                            <div className="appointment-info-item">
                              <ClockIcon size={14} className="info-icon" />
                              <span>
                                {cita.hora} - Dr. {cita.veterinario}
                              </span>
                            </div>

                            {cita.precio && (
                              <div className="appointment-info-item">
                                <span className="price-label">Precio:</span>
                                <span className="price-value">
                                  ${new Intl.NumberFormat("es-CO").format(cita.precio)}
                                </span>
                              </div>
                            )}

                            {cita.notas && (
                              <div className="appointment-info-item notes">
                                <AlertCircle size={14} className="info-icon warning" />
                                <span>{cita.notas}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="appointment-actions-improved">
                        {cita.estado === "PENDIENTE" && (
                          <div className="primary-actions">
                            <button
                              className="action-button-improved primary"
                              onClick={() => handleConfirmarCita(cita)}
                            >
                              <CheckCircle size={14} />
                              Confirmar
                            </button>
                            <button
                              className="action-button-improved secondary"
                              onClick={() => handleReprogramarCita(cita)}
                            >
                              <Edit size={14} />
                              Reprogramar
                            </button>
                          </div>
                        )}
                        {/* Mostrar botón cancelar para confirmadas siempre */}
                        {isConfirmedAppointment(cita) && (
                          <button
                            className="action-button-improved danger"
                            onClick={() => handleCancelarCita(cita)}
                          >
                            <Trash2 size={14} />
                            Cancelar cita
                          </button>
                        )}
                        {/* Mostrar botón reprogramar para canceladas */}
                        {cita.estado === "CANCELADA" && (
                          <button
                            className="action-button-improved secondary"
                            onClick={() => handleReprogramarCita(cita)}
                          >
                            <Edit size={14} />
                            Reprogramar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-appointments-state">
                <div className="no-appointments-icon">
                  <Calendar size={48} />
                </div>
                <h3 className="no-appointments-title">
                  No hay citas {filtroCitas !== "todas" ? filtroCitas.toLowerCase() + "s" : "próximas"}
                </h3>
                <p className="no-appointments-description">
                  {filtroCitas === "todas"
                    ? "No tienes citas programadas en los próximos días."
                    : `No tienes citas con estado "${filtroCitas}".`}
                </p>
                <div className="no-appointments-actions">
                  <button
                    className="action-button-improved primary"
                    onClick={() => navigate("/PanelPropietario/agendar-cita")}
                  >
                    Agendar nueva cita
                  </button>
                  <button className="action-button-improved secondary" onClick={() => setFiltroCitas("todas")}>
                    Ver todas las citas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Servicios disponibles */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title">Servicios disponibles</h3>
            </div>
            <div className="services-container">
              {servicios.length > 0 ? (
                servicios.map((servicio, index) => (
                  <div className="service-card" key={index}>
                    <h4 className="service-name">{servicio.nom_ser}</h4>
                    <p className="service-description">{servicio.descrip_ser || "Sin descripción"}</p>
                    <div className="service-price">
                      ${new Intl.NumberFormat("es-CO", { style: "decimal" }).format(servicio.precio)}
                    </div>
                    <button
                      className="service-button"
                      onClick={() => {
                        // Transformar el objeto servicio para que tenga las propiedades esperadas por el formulario
                        const servicioTransformado = {
                          id: servicio.cod_ser || servicio.id || servicio._id || servicio.id_servicio || servicio.nom_ser, // fallback
                          nombre: servicio.nom_ser || servicio.nombre,
                          precio: servicio.precio,
                          descripcion: servicio.descrip_ser || servicio.descripcion || '',
                          detalles: servicio.detalles || [],
                          icono: servicio.icono || 'consulta',
                        };
                        navigate("/PanelPropietario/agendar-cita", { state: { servicioSeleccionado: servicioTransformado } });
                      }}
                    >
                      Agendar
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-results">No hay servicios disponibles.</p>
              )}
            </div>
          </div>

          {/* Veterinarios disponibles */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title">Nuestros veterinarios</h3>
            </div>
            <div className="vets-container">
              {veterinarios.length > 0 ? (
                veterinarios.map((veterinario, index) => (
                  <div className="vet-card" key={index}>
                    <div className="vet-image-container">
                      <User size={24} className="text-white" />
                    </div>
                    <div className="vet-details">
                      <h4 className="vet-name">
                        {veterinario.nombre} {veterinario.apellido}
                      </h4>
                      <p className="vet-specialty">{veterinario.especialidad}</p>
                      <p className="vet-schedule">{veterinario.horario}</p>
                    </div>
                    <button className="vet-button" onClick={() => navigate("/PanelPropietario/agendar-cita")}>
                      Agendar cita <ChevronRight size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-results">No hay veterinarios disponibles.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
