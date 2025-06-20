"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  Calendar,
  Clock,
  X,
  ChevronRight,
  User,
  Loader2,
  Heart,
  Scissors,
  Syringe,
  Monitor,
  Stethoscope,
  CheckCircle,
} from "lucide-react"
import "../../stylos/cssFormularios/FormularioCita.css"

// Configuración de la API - ajusta la URL según tu servidor
const API_BASE_URL = "http://localhost:3001/api"

function FormularioCita() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const [servicios, setServicios] = useState([])
  const [veterinarios, setVeterinarios] = useState([])
  const [mascotas, setMascotas] = useState([])
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [servicioExpandido, setServicioExpandido] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [usuarioActual, setUsuarioActual] = useState(null)

  useEffect(() => {
    // Obtener el ID del usuario autenticado (ejemplo: desde localStorage)
    const userData = JSON.parse(localStorage.getItem("userData"))
    if (userData && userData.id_usuario) {
      fetch(`${API_BASE_URL}/usuario/${userData.id_usuario}`)
        .then((res) => res.json())
        .then((data) => setUsuarioActual(data))
        .catch(() => setUsuarioActual(null))
    } else {
      setUsuarioActual(null)
    }
  }, [])

  useEffect(() => {
    if (usuarioActual && usuarioActual.id_usuario) {
      cargarDatos(usuarioActual.id_usuario)
    }
  }, [usuarioActual])

  const cargarDatos = async (usuarioId) => {
    try {
      setLoadingData(true)

      // Cargar servicios
      const serviciosRes = await fetch(`${API_BASE_URL}/servicios`)
      if (!serviciosRes.ok) throw new Error(`Error al cargar servicios: ${serviciosRes.status}`)
      const serviciosData = await serviciosRes.json()
      setServicios(serviciosData)

      // Pre-seleccionar el primer servicio automáticamente
      if (serviciosData.length > 0) {
        const primerServicio = serviciosData[0]
        setServicioSeleccionado(primerServicio)
        setValue("idServicio", primerServicio.id)
      }

      // Cargar veterinarios
      const veterinariosRes = await fetch(`${API_BASE_URL}/veterinarios`)
      if (!veterinariosRes.ok) throw new Error(`Error al cargar veterinarios: ${veterinariosRes.status}`)
      const veterinariosData = await veterinariosRes.json()
      setVeterinarios(veterinariosData)

      // Cargar mascotas del propietario
      const mascotasRes = await fetch(`${API_BASE_URL}/mascotas/${usuarioId}`)
      if (!mascotasRes.ok) throw new Error(`Error al cargar mascotas: ${mascotasRes.status}`)
      const mascotasData = await mascotasRes.json()
      setMascotas(mascotasData)

      setLoadingData(false)
    } catch (error) {
      console.error("Error cargando datos:", error)
      setError("Error al cargar los datos. Por favor, recarga la página.")
      setLoadingData(false)
    }
  }

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    })
      .format(precio)
      .replace("COP", "$")
  }

  const seleccionarServicio = (servicio) => {
    setServicioSeleccionado(servicio)
    setValue("idServicio", servicio.id)
    setServicioExpandido(null) // Cerrar cualquier servicio expandido
  }

  const toggleServicioExpandido = (servicioId) => {
    if (servicioExpandido === servicioId) {
      setServicioExpandido(null)
    } else {
      setServicioExpandido(servicioId)
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true)

      const citaData = {
        fecha: data.fecha,
        hora: data.hora,
        idServicio: servicioSeleccionado.id,
        idVeterinario: data.idVeterinario,
        idMascota: data.idMascota,
        idPropietario: usuarioActual.id_usuario,
        notas: data.notas,
      }

      const response = await fetch(`${API_BASE_URL}/citas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(citaData),
      })

      if (!response.ok) throw new Error(`Error al registrar la cita: ${response.status}`)
      const responseData = await response.json()

      // Mostrar modal de éxito en lugar de mensaje inline
      setShowSuccessModal(true)
      reset()
      // Mantener el primer servicio seleccionado después del reset
      if (servicios.length > 0) {
        setServicioSeleccionado(servicios[0])
        setValue("idServicio", servicios[0].id)
      }
    } catch (error) {
      console.error("Error registrando cita:", error)
      setError("Error al registrar la cita. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  })

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
  }

  const renderIcono = (iconoNombre) => {
    const iconProps = { size: 24 }

    switch (iconoNombre) {
      case "consulta":
        return <Stethoscope {...iconProps} />
      case "peluqueria":
        return <Scissors {...iconProps} />
      case "vacunacion":
        return <Syringe {...iconProps} />
      case "telemedicina":
        return <Monitor {...iconProps} />
      default:
        return <Heart {...iconProps} />
    }
  }

  if (loadingData) {
    return (
      <div className="loading-container-full">
        <div className="loading-card-full">
          <Loader2 className="loading-spinner-full animate-pulse" />
          <p className="loading-text-full">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (!usuarioActual) {
    return (
      <div className="loading-container-full">
        <div className="loading-card-full">
          <p className="loading-text-full">Cargando usuario...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={closeSuccessModal}>
          <div className="modal-success" onClick={(e) => e.stopPropagation()}>
            <div className="modal-success-content">
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>
              <h3>¡Cita Agendada Exitosamente!</h3>
              <p>Tu cita ha sido registrada correctamente. Nos estaremos comunicando contigo pronto.</p>
              <button className="btn-modal-close" onClick={closeSuccessModal}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-cita-full">
        <div className="formulario-wrapper-full animate-fade-in">
          {/* Header */}
          <div className="header-cita-full">
            <h1>Agendar Cita</h1>
            <div className="usuario-info-full">
              <User size={20} />
              <span>{usuarioActual.nombre}</span>
            </div>
          </div>

          <div className="contenido-formulario-full">
            {/* Mensaje de error (solo errores, éxito va en modal) */}
            {error && (
              <div className="alert alert-error animate-slide-in">
                <X className="alert-icon" />
                <p>{error}</p>
              </div>
            )}

            {/* Pasos */}
            <div className="pasos-cita-full">
              <div className="paso activo">
                <div className="paso-numero-full">1</div>
                <div className="paso-texto-full">Servicio</div>
              </div>
              <div className="linea-paso-full"></div>
              <div className={`paso ${servicioSeleccionado ? "activo" : ""}`}>
                <div className="paso-numero-full">2</div>
                <div className="paso-texto-full">Detalles</div>
              </div>
              <div className="linea-paso-full"></div>
              <div className="paso">
                <div className="paso-numero-full">3</div>
                <div className="paso-texto-full">Confirmación</div>
              </div>
            </div>

            <form onSubmit={onSubmit}>
              {/* Siempre mostrar ambas secciones para mantener tamaño consistente */}
              <div className="formulario-layout-full">
                {/* Sección de servicios - siempre visible */}
                <div className="seccion-servicios-full">
                  <h2 className="titulo-seccion-full">Servicios disponibles</h2>
                  <div className="lista-servicios-full">
                    {servicios.map((servicio) => (
                      <div key={servicio.id} className="servicio-item-full animate-slide-in">
                        <div
                          className={`servicio-card-full ${servicioExpandido === servicio.id ? "expandido" : ""} ${
                            servicioSeleccionado?.id === servicio.id ? "seleccionado" : ""
                          }`}
                          onClick={() => toggleServicioExpandido(servicio.id)}
                        >
                          <div className="servicio-info-full">
                            <div className="icono-servicio-full">{renderIcono(servicio.icono)}</div>
                            <span className="servicio-nombre-full">{servicio.nombre}</span>
                          </div>
                          <div className="servicio-selector-full">
                            <div
                              className={`radio-custom-full ${
                                servicioSeleccionado?.id === servicio.id ? "seleccionado" : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                seleccionarServicio(servicio)
                              }}
                            ></div>
                          </div>
                        </div>

                        {servicioExpandido === servicio.id && (
                          <div className="servicio-detalle-full animate-fade-in">
                            <div className="servicio-detalle-header-full">
                              <h3>{servicio.nombre}</h3>
                              <button
                                type="button"
                                className="btn-cerrar-full"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setServicioExpandido(null)
                                }}
                              >
                                <X size={18} />
                              </button>
                            </div>
                            <div className="servicio-precio-full">Desde {formatearPrecio(servicio.precio)}</div>
                            <p className="servicio-descripcion-full">{servicio.descripcion}</p>
                            {Array.isArray(servicio.detalles) && servicio.detalles.length > 0 && (
                              <ul className="servicio-lista-detalles-full">
                                {servicio.detalles.map((detalle, idx) => (
                                  <li key={idx}>{detalle}</li>
                                ))}
                              </ul>
                            )}
                            <div className="servicio-nota-full">
                              <p>
                                Para finalizar tu agendamiento, nos estaremos comunicando contigo por celular para
                                realizar el pago de tu reserva.
                              </p>
                            </div>
                            <button
                              type="button"
                              className="btn-seleccionar-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                seleccionarServicio(servicio)
                              }}
                            >
                              Seleccionar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sección de detalles - siempre visible si hay servicio seleccionado */}
                {servicioSeleccionado && (
                  <div className="seccion-detalles-full animate-fade-in">
                    <div className="servicio-seleccionado-header-full">
                      <h2>Detalles de la cita</h2>
                      <div className="servicio-seleccionado-info-full">
                        <span>{servicioSeleccionado.nombre}</span>
                        <span className="precio">{formatearPrecio(servicioSeleccionado.precio)}</span>
                      </div>
                    </div>

                    <div className="formulario-grid-full">
                      <div className="campo-formulario-full">
                        <label>
                          <span className="label-text-full">Mascota</span>
                          <select
                            {...register("idMascota", {
                              required: "Debes seleccionar una mascota",
                            })}
                            className="input-full"
                          >
                            <option value="">Seleccionar mascota</option>
                            {mascotas.length === 0 ? (
                              <option disabled value="">
                                No tienes mascotas registradas
                              </option>
                            ) : (
                              mascotas.map((mascota) => (
                                <option key={mascota.id} value={mascota.id}>
                                  {mascota.nombre} ({mascota.tipo} - {mascota.raza})
                                </option>
                              ))
                            )}
                          </select>
                          {errors.idMascota && <p className="error-mensaje-full">{errors.idMascota.message}</p>}
                        </label>
                      </div>

                      <div className="campo-formulario-full">
                        <label>
                          <span className="label-text-full">Veterinario</span>
                          <select
                            {...register("idVeterinario", { required: "El veterinario es obligatorio" })}
                            className="input-full"
                          >
                            <option value="">Seleccionar veterinario</option>
                            {veterinarios.map((vet) => (
                              <option key={vet.id} value={vet.id}>
                                {vet.nombre} - {vet.especialidad}
                              </option>
                            ))}
                          </select>
                          {errors.idVeterinario && <p className="error-mensaje-full">{errors.idVeterinario.message}</p>}
                        </label>
                      </div>

                      <div className="campo-formulario-full">
                        <label>
                          <span className="label-text-full">Fecha</span>
                          <div className="input-icon-full">
                            <Calendar className="icon-full" size={18} />
                            <input
                              type="date"
                              {...register("fecha", {
                                required: "La fecha es obligatoria",
                                validate: {
                                  noPastDates: (value) =>
                                    new Date(value) >= new Date().setHours(0, 0, 0, 0) ||
                                    "No se permiten fechas pasadas",
                                  noFutureDates: (value) =>
                                    new Date(value) <= new Date(new Date().setFullYear(new Date().getFullYear() + 1)) ||
                                    "La fecha no puede ser mayor a un año desde hoy",
                                  noSundays: (value) =>
                                    new Date(value).getDay() !== 0 || "No se permiten citas los domingos",
                                },
                              })}
                              className="input-full input-with-icon-full"
                            />
                          </div>
                          {errors.fecha && <p className="error-mensaje-full">{errors.fecha.message}</p>}
                        </label>
                      </div>

                      <div className="campo-formulario-full">
                        <label>
                          <span className="label-text-full">Hora</span>
                          <div className="input-icon-full">
                            <Clock className="icon-full" size={18} />
                            <input
                              type="time"
                              {...register("hora", {
                                required: "La hora es obligatoria",
                                validate: (value) => {
                                  const [hours, minutes] = value.split(":").map(Number)
                                  const totalMinutes = hours * 60 + minutes
                                  if (totalMinutes < 480 || totalMinutes > 1080)
                                    return "La hora debe estar entre las 8:00 AM y las 6:00 PM"
                                  if (totalMinutes >= 720 && totalMinutes < 840)
                                    return "No se permiten citas entre 12:00 PM y 2:00 PM"
                                  return true
                                },
                              })}
                              className="input-full input-with-icon-full"
                            />
                          </div>
                          {errors.hora && <p className="error-mensaje-full">{errors.hora.message}</p>}
                        </label>
                      </div>

                      <div className="campo-formulario-full campo-completo-full">
                        <label>
                          <span className="label-text-full">Notas adicionales (opcional)</span>
                          <textarea
                            {...register("notas")}
                            placeholder="Escribe cualquier información adicional que el veterinario deba saber"
                            className="input-full textarea-full"
                          ></textarea>
                        </label>
                      </div>
                    </div>

                    <div className="nota-importante-full">
                      <p>
                        <strong>Nota:</strong> Para finalizar tu agendamiento, nos estaremos comunicando contigo por
                        celular para realizar el pago de tu reserva.
                      </p>
                    </div>

                    <div className="botones-accion-full">
                      <button type="submit" className="btn-primario-full" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-pulse" />
                            Agendando...
                          </>
                        ) : (
                          <>
                            Agendar Cita <ChevronRight size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <input type="hidden" {...register("idServicio")} />
              <input type="hidden" {...register("nombrePropietario")} value={usuarioActual.nombre} />
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default FormularioCita
