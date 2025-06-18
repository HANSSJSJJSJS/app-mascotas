"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Calendar, Clock, X, ChevronRight, User, Loader2 } from "lucide-react"
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

  // Usuario simulado - en una app real vendría del contexto de autenticación
  const usuarioActual = {
    id: 6, // ID del propietario en la base de datos
    nombre: "Pedro González",
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoadingData(true)

      // Cargar servicios
      const serviciosRes = await fetch(`${API_BASE_URL}/servicios`)
      if (!serviciosRes.ok) throw new Error(`Error al cargar servicios: ${serviciosRes.status}`)
      const serviciosData = await serviciosRes.json()
      setServicios(serviciosData)

      // Cargar veterinarios
      const veterinariosRes = await fetch(`${API_BASE_URL}/veterinarios`)
      if (!veterinariosRes.ok) throw new Error(`Error al cargar veterinarios: ${veterinariosRes.status}`)
      const veterinariosData = await veterinariosRes.json()
      setVeterinarios(veterinariosData)

      // Cargar mascotas del propietario
      const mascotasRes = await fetch(`${API_BASE_URL}/mascotas/${usuarioActual.id}`)
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
    setServicioExpandido(servicio.id)
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
        idPropietario: usuarioActual.id,
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

      setSuccess("Cita registrada exitosamente.")
      reset()
      setServicioSeleccionado(null)
    } catch (error) {
      console.error("Error registrando cita:", error)
      setError("Error al registrar la cita. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  })

  const renderIcono = (iconoNombre) => {
    switch (iconoNombre) {
      case "consulta":
        return <div className="icono-servicio icono-consulta"></div>
      case "peluqueria":
        return <div className="icono-servicio icono-peluqueria"></div>
      case "vacunacion":
        return <div className="icono-servicio icono-vacunacion"></div>
      case "telemedicina":
        return <div className="icono-servicio icono-telemedicina"></div>
      default:
        return <div className="icono-servicio icono-otro"></div>
    }
  }

  if (loadingData) {
    return (
      <div className="container-cita">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-cita">
      <div className="header-cita">
        <h1>Agendar Cita</h1>
        <div className="usuario-info">
          <User size={18} />
          <span>{usuarioActual.nombre}</span>
        </div>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <div
          className="alert alert-error"
          style={{
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
            color: "#c33",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="alert alert-success"
          style={{
            backgroundColor: "#efe",
            border: "1px solid #cfc",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
            color: "#3c3",
          }}
        >
          {success}
        </div>
      )}

      <div className="pasos-cita">
        <div className="paso activo">
          <div className="paso-numero">1</div>
          <div className="paso-texto">Servicio</div>
        </div>
        <div className="linea-paso"></div>
        <div className={`paso ${servicioSeleccionado ? "activo" : ""}`}>
          <div className="paso-numero">2</div>
          <div className="paso-texto">Detalles</div>
        </div>
        <div className="linea-paso"></div>
        <div className="paso">
          <div className="paso-numero">3</div>
          <div className="paso-texto">Confirmación</div>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        {!servicioSeleccionado ? (
          <div className="seccion-servicios">
            <h2 className="titulo-seccion">Elige el servicio</h2>
            <div className="lista-servicios">
              {servicios.map((servicio) => (
                <div key={servicio.id} className="servicio-item">
                  <div
                    className={`servicio-card ${servicioExpandido === servicio.id ? "expandido" : ""}`}
                    onClick={() => toggleServicioExpandido(servicio.id)}
                  >
                    <div className="servicio-info">
                      <span className="servicio-nombre">{servicio.nombre}</span>
                      {renderIcono(servicio.icono)}
                    </div>
                    <div className="servicio-selector">
                      <div
                        className={`radio-custom ${servicioSeleccionado?.id === servicio.id ? "seleccionado" : ""}`}
                      ></div>
                    </div>
                  </div>

                  {servicioExpandido === servicio.id && (
                    <div className="servicio-detalle">
                      <div className="servicio-detalle-header">
                        <h3>{servicio.nombre}</h3>
                        <button
                          type="button"
                          className="btn-cerrar"
                          onClick={(e) => {
                            e.stopPropagation()
                            setServicioExpandido(null)
                          }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="servicio-precio">Desde {formatearPrecio(servicio.precio)}</div>
                      <p className="servicio-descripcion">{servicio.descripcion}</p>
                      {servicio.detalles.length > 0 && (
                        <ul className="servicio-lista-detalles">
                          {servicio.detalles.map((detalle, idx) => (
                            <li key={idx}>{detalle}</li>
                          ))}
                        </ul>
                      )}
                      <div className="servicio-nota">
                        <li>
                          Para finalizar tu agendamiento, nos estaremos comunicando contigo por celular para realizar el
                          pago de tu reserva y así poder guardar tu espacio en la agenda.
                        </li>
                      </div>
                      <button
                        type="button"
                        className="btn-seleccionar"
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
        ) : (
          <div className="seccion-detalles">
            <div className="servicio-seleccionado-header">
              <h2>Detalles de la cita</h2>
              <div className="servicio-seleccionado-info">
                <span>{servicioSeleccionado.nombre}</span>
                <span className="precio">{formatearPrecio(servicioSeleccionado.precio)}</span>
              </div>
              <button type="button" className="btn-cambiar" onClick={() => setServicioSeleccionado(null)}>
                Cambiar servicio
              </button>
            </div>

            <div className="formulario-grid">
              <div className="campo-formulario">
                <label>
                  <span className="label-text">Mascota:</span>
                  <select
                    {...register("idMascota", {
                      required: "Debes seleccionar una mascota",
                    })}
                  >
                    <option value="">Seleccionar mascota</option>
                    {mascotas.map((mascota) => (
                      <option key={mascota.id} value={mascota.id}>
                        {mascota.nombre} ({mascota.tipo} - {mascota.raza})
                      </option>
                    ))}
                  </select>
                  {errors.idMascota && <p className="error-mensaje">{errors.idMascota.message}</p>}
                </label>
              </div>

              <div className="campo-formulario">
                <label>
                  <span className="label-text">Veterinario:</span>
                  <select {...register("idVeterinario", { required: "El veterinario es obligatorio" })}>
                    <option value="">Seleccionar veterinario</option>
                    {veterinarios.map((vet) => (
                      <option key={vet.id} value={vet.id}>
                        {vet.nombre} - {vet.especialidad}
                      </option>
                    ))}
                  </select>
                  {errors.idVeterinario && <p className="error-mensaje">{errors.idVeterinario.message}</p>}
                </label>
              </div>

              <div className="campo-formulario">
                <label>
                  <span className="label-text">Fecha:</span>
                  <div className="input-icon">
                    <Calendar size={18} className="icon" />
                    <input
                      type="date"
                      {...register("fecha", {
                        required: "La fecha es obligatoria",
                        validate: {
                          noPastDates: (value) =>
                            new Date(value) >= new Date().setHours(0, 0, 0, 0) || "No se permiten fechas pasadas",
                          noFutureDates: (value) =>
                            new Date(value) <= new Date(new Date().setFullYear(new Date().getFullYear() + 1)) ||
                            "La fecha no puede ser mayor a un año desde hoy",
                          noSundays: (value) => new Date(value).getDay() !== 0 || "No se permiten citas los domingos",
                        },
                      })}
                    />
                  </div>
                  {errors.fecha && <p className="error-mensaje">{errors.fecha.message}</p>}
                </label>
              </div>

              <div className="campo-formulario">
                <label>
                  <span className="label-text">Hora:</span>
                  <div className="input-icon">
                    <Clock size={18} className="icon" />
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
                    />
                  </div>
                  {errors.hora && <p className="error-mensaje">{errors.hora.message}</p>}
                </label>
              </div>

              <div className="campo-formulario campo-completo">
                <label>
                  <span className="label-text">Notas adicionales (opcional):</span>
                  <textarea
                    {...register("notas")}
                    placeholder="Escribe cualquier información adicional que el veterinario deba saber"
                  ></textarea>
                </label>
              </div>
            </div>

            <div className="nota-importante">
              <p>
                <strong>Nota:</strong> Para finalizar tu agendamiento, nos estaremos comunicando contigo por celular
                para realizar el pago de tu reserva y así poder guardar tu espacio en la agenda.
              </p>
            </div>

            <div className="botones-accion">
              <button type="button" className="btn-secundario" onClick={() => setServicioSeleccionado(null)}>
                Volver
              </button>
              <button type="submit" className="btn-primario" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" style={{ marginRight: "8px" }} />
                    Agendando...
                  </>
                ) : (
                  <>
                    Continuar <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <input type="hidden" {...register("idServicio")} />
        <input type="hidden" {...register("nombrePropietario")} value={usuarioActual.nombre} />
      </form>
    </div>
  )
}

export default FormularioCita
