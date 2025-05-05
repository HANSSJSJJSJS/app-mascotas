"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Calendar, Clock, X, ChevronRight, User } from "lucide-react"
import "../../stylos/cssFormularios/FormularioCita.css"

function FormularioCita() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm()
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [servicioExpandido, setServicioExpandido] = useState(null)
  const [mascotasUsuario, setMascotasUsuario] = useState([
    { id: 1, nombre: "Max", tipo: "Perro", raza: "Labrador", edad: 3 },
    { id: 2, nombre: "Luna", tipo: "Gato", raza: "Siamés", edad: 2 },
  ])
  const [usuarioActual] = useState({
    id: 1,
    nombre: "Juan Pérez",
    telefono: "123456789",
    email: "juan@example.com",
  })

  const servicios = [
    {
      id: 1,
      nombre: "Consulta veterinaria",
      icono: "consulta",
      precio: 87599,
      descripcion: "Revisión de cola a cabeza:",
      detalles: ["Chequeo general de todos los sistemas.", "Toma de temperatura corporal.", "Revisión de piel."],
    },
    {
      id: 2,
      nombre: "Baño y peluquería",
      icono: "peluqueria",
      precio: 45000,
      descripcion:
        "Siempre limpio, nunca inlimpio: Servicio de baño y peluquería para todos los tamaños y todos los tipos de pelo. También puede realizarse un baño medicado de ser necesario para el paciente.",
      detalles: [
        "Recuerda que si tu mascota es un gato(a), para Baño y Peluquería sólo podremos atenderlos a las 09:00 a.m. en nuestras sedes. En caso de agendar en otro horario, tendríamos que re-programar para los días siguientes. ¡Te esperamos!",
      ],
    },
    {
      id: 3,
      nombre: "SERVICIO VACUNACION",
      icono: "vacunacion",
      precio: 27600,
      descripcion:
        "¡Mascota vacunada vale por 2! La vacunación en cachorros ayuda a generar anticuerpos contra las principales enfermedades. Para las mascotas mayores de 1 año de edad se realiza un refuerzo anual. Incluye valoración inicial.",
      detalles: [],
    },
    {
      id: 4,
      nombre: "Otro servicio",
      icono: "otro",
      precio: 35000,
      descripcion: "Otros servicios veterinarios disponibles.",
      detalles: [],
    },
    {
      id: 5,
      nombre: "Telemedicina (Virtual)",
      icono: "telemedicina",
      precio: 50000,
      descripcion: "Consulta veterinaria virtual desde la comodidad de tu hogar.",
      detalles: [],
    },
  ]

  const veterinarios = [
    { id: 1, nombre: "Dra. María López" },
    { id: 2, nombre: "Dr. Juan Pérez" },
    { id: 3, nombre: "Dra. Ana García" },
    { id: 4, nombre: "Dr. Carlos Rodríguez" },
    { id: 5, nombre: "Dra. Laura Martínez" },
  ]

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

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    alert("Cita agendada con éxito. Nos comunicaremos contigo para confirmar.")
    reset()
    setServicioSeleccionado(null)
    setServicioExpandido(null)
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

  return (
    <div className="container-cita">
      <div className="header-cita">
        <h1>Agendar Cita</h1>
        <div className="usuario-info">
          <User size={18} />
          <span>{usuarioActual.nombre}</span>
        </div>
      </div>

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
                    {mascotasUsuario.map((mascota) => (
                      <option key={mascota.id} value={mascota.id}>
                        {mascota.nombre} ({mascota.tipo})
                      </option>
                    ))}
                  </select>
                  {errors.idMascota && <p className="error-mensaje">{errors.idMascota.message}</p>}
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

              <div className="campo-formulario">
                <label>
                  <span className="label-text">Veterinario:</span>
                  <select {...register("idVeterinario", { required: "El veterinario es obligatorio" })}>
                    <option value="">Seleccionar veterinario</option>
                    {veterinarios.map((vet) => (
                      <option key={vet.id} value={vet.id}>
                        {vet.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.idVeterinario && <p className="error-mensaje">{errors.idVeterinario.message}</p>}
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
              <button type="submit" className="btn-primario">
                Continuar <ChevronRight size={18} />
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
