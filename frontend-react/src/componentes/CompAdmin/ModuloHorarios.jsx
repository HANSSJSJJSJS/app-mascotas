"use client"

import { useState, useEffect } from "react"
import "../../stylos/cssAdmin/ModuloHorarios.css"

function ModuloHorarios({ isSidebarOpen = true }) {
  // Lista de veterinarios
  const veterinarios = [
    { id: 1, nombre: "Dr. Carlos Sánchez" },
    { id: 2, nombre: "Dra. María López" },
    { id: 3, nombre: "Dr. Juan Pérez" },
  ]

  // Estado inicial para los horarios
  const [veterinarioSeleccionado, setVeterinarioSeleccionado] = useState(veterinarios[0])
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [horarios, setHorarios] = useState([
    {
      dia: "Lunes",
      activo: true,
      mananaInicio: "08:00",
      mananaFin: "12:00",
      tardeInicio: "15:00",
      tardeFin: "19:00",
    },
    {
      dia: "Martes",
      activo: true,
      mananaInicio: "08:00",
      mananaFin: "12:00",
      tardeInicio: "15:00",
      tardeFin: "19:00",
    },
    {
      dia: "Miércoles",
      activo: true,
      mananaInicio: "08:00",
      mananaFin: "12:00",
      tardeInicio: "15:00",
      tardeFin: "19:00",
    },
    {
      dia: "Jueves",
      activo: true,
      mananaInicio: "08:00",
      mananaFin: "12:00",
      tardeInicio: "15:00",
      tardeFin: "19:00",
    },
    {
      dia: "Viernes",
      activo: true,
      mananaInicio: "08:00",
      mananaFin: "12:00",
      tardeInicio: "15:00",
      tardeFin: "19:00",
    },
    {
      dia: "Sábado",
      activo: true,
      mananaInicio: "09:00",
      mananaFin: "13:00",
      tardeInicio: "",
      tardeFin: "",
    },
    {
      dia: "Domingo",
      activo: false,
      mananaInicio: "",
      mananaFin: "",
      tardeInicio: "",
      tardeFin: "",
    },
  ])

  // Cargar horarios del localStorage al iniciar
  useEffect(() => {
    const horariosGuardados = localStorage.getItem(`horarios_${veterinarioSeleccionado.id}`)
    if (horariosGuardados) {
      setHorarios(JSON.parse(horariosGuardados))
    }
  }, [veterinarioSeleccionado])

  // Función para mostrar notificaciones
  const mostrarNotificacion = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Función para actualizar el estado de activo de un día
  const cambiarEstado = (index) => {
    const nuevosHorarios = [...horarios]
    nuevosHorarios[index].activo = !nuevosHorarios[index].activo
    setHorarios(nuevosHorarios)
  }

  // Función para actualizar cualquier campo de tiempo
  const actualizarTiempo = (index, campo, valor) => {
    const nuevosHorarios = [...horarios]
    nuevosHorarios[index][campo] = valor
    setHorarios(nuevosHorarios)
  }

  // Función para limpiar horarios de un día específico
  const limpiarDia = (index) => {
    if (window.confirm(`¿Está seguro que desea limpiar los horarios del ${horarios[index].dia}?`)) {
      const nuevosHorarios = [...horarios]
      nuevosHorarios[index] = {
        ...nuevosHorarios[index],
        activo: false,
        mananaInicio: "",
        mananaFin: "",
        tardeInicio: "",
        tardeFin: "",
      }
      setHorarios(nuevosHorarios)
      mostrarNotificacion(`Horarios del ${horarios[index].dia} limpiados`)
    }
  }

  // Función para guardar cambios
  const guardarCambios = () => {
    localStorage.setItem(`horarios_${veterinarioSeleccionado.id}`, JSON.stringify(horarios))
    mostrarNotificacion("Horarios guardados correctamente")
  }

  return (
    <div className={`horarios-main ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}>
      <div className="horarios-container">
        {/* Header minimalista */}
        <div className="page-header">
          <div className="header-left">
            <h1>Horarios de Atención</h1>
            <span className="subtitle">Gestión de horarios veterinarios</span>
          </div>
          <div className="header-right">
            <select
              value={veterinarioSeleccionado.id}
              onChange={(e) => {
                const vet = veterinarios.find((v) => v.id === Number.parseInt(e.target.value))
                setVeterinarioSeleccionado(vet)
              }}
              className="vet-selector"
            >
              {veterinarios.map((vet) => (
                <option key={vet.id} value={vet.id}>
                  {vet.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de días */}
        <div className="schedule-grid">
          {horarios.map((horario, index) => (
            <div key={index} className={`day-card ${horario.activo ? "active" : "inactive"}`}>
              <div className="day-header">
                <div className="day-info">
                  <h3 className="day-name">{horario.dia}</h3>
                  <div className={`status-indicator ${horario.activo ? "open" : "closed"}`}>
                    {horario.activo ? "Abierto" : "Cerrado"}
                  </div>
                </div>
                <div className="day-actions">
                  <button
                    onClick={() => cambiarEstado(index)}
                    className={`toggle-btn ${horario.activo ? "active" : "inactive"}`}
                  >
                    {horario.activo ? "Cerrar" : "Abrir"}
                  </button>
                  <button onClick={() => limpiarDia(index)} className="clear-btn">
                    Limpiar
                  </button>
                </div>
              </div>

              {horario.activo && (
                <div className="schedule-content">
                  <div className="time-block">
                    <label className="time-label">Mañana</label>
                    <div className="time-inputs">
                      <input
                        type="time"
                        value={horario.mananaInicio}
                        onChange={(e) => actualizarTiempo(index, "mananaInicio", e.target.value)}
                        className="time-input"
                      />
                      <span className="time-separator">—</span>
                      <input
                        type="time"
                        value={horario.mananaFin}
                        onChange={(e) => actualizarTiempo(index, "mananaFin", e.target.value)}
                        className="time-input"
                      />
                    </div>
                  </div>

                  <div className="time-block">
                    <label className="time-label">Tarde</label>
                    <div className="time-inputs">
                      <input
                        type="time"
                        value={horario.tardeInicio}
                        onChange={(e) => actualizarTiempo(index, "tardeInicio", e.target.value)}
                        className="time-input"
                      />
                      <span className="time-separator">—</span>
                      <input
                        type="time"
                        value={horario.tardeFin}
                        onChange={(e) => actualizarTiempo(index, "tardeFin", e.target.value)}
                        className="time-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer con botón de guardar y mensaje */}
        <div className="page-footer">
          <div className="footer-content">
            <button onClick={guardarCambios} className="save-button">
              Guardar Cambios
            </button>
            {notification.show && <div className={`status-button ${notification.type}`}>{notification.message}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModuloHorarios
