import { useState, useRef } from "react"
import "../../stylos/cssAdmin/HisCli.css"
import { obtenerFechaHoraActual, guardarDatos, validarCamposObligatorios } from "../../funcionalidades/FHisCli"

function HisCli({ isSidebarOpen = true }) {
  const [datosFormulario, setDatosFormulario] = useState({
    codigo: "Pendiente",
    hora: "",
    fecha: "",
    nombrePropietario: "",
    identidad: "",
    direccion: "",
    celular1: "",
    celular2: "",
    nombreMascota: "",
    especie: "",
    raza: "",
    sexo: "",
    fechaNacimiento: "",
    peso: "",
    color: "",
    motivoConsulta: "",
  })

  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const printFrameRef = useRef(null)

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setDatosFormulario((estadoPrevio) => ({
      ...estadoPrevio,
      [name]: value,
    }))
  }

  const mostrarNotificacion = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  const manejarGuardar = () => {
    const { fecha, hora, codigo } = obtenerFechaHoraActual()
    const datosActualizados = {
      ...datosFormulario,
      fecha,
      hora,
      codigo: codigo || "HELINK",
    }

    const validacion = validarCamposObligatorios(datosActualizados)

    if (validacion.valido) {
      const resultado = guardarDatos(datosActualizados)
      mostrarNotificacion(resultado.mensaje)
    } else {
      mostrarNotificacion(validacion.mensaje, "error")
    }
  }

  const manejarLimpiar = () => {
    setDatosFormulario({
      codigo: "Pendiente",
      hora: "",
      fecha: "",
      nombrePropietario: "",
      identidad: "",
      direccion: "",
      celular1: "",
      celular2: "",
      nombreMascota: "",
      especie: "",
      raza: "",
      sexo: "",
      fechaNacimiento: "",
      peso: "",
      color: "",
      motivoConsulta: "",
    })
    mostrarNotificacion("Formulario limpiado correctamente")
  }

  const manejarImprimir = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600")

    const { fecha, hora } = obtenerFechaHoraActual()
    const currentData = {
      ...datosFormulario,
      fecha: datosFormulario.fecha || fecha,
      hora: datosFormulario.hora || hora,
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Historia Clínica Veterinaria</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #000;
          }
          .print-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 0;
          }
          .print-header {
            background-color: #8196eb;
            color: white;
            padding: 30px;
            text-align: center;
          }
          .print-header h1 {
            margin: 0;
            font-size: 28px;
            text-transform: uppercase;
            font-weight: 600;
          }
          .print-header p {
            margin: 8px 0 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .print-section {
            padding: 20px;
            border-bottom: 1px solid #eee;
          }
          .print-section h2 {
            color: #000000;
            margin: 0 0 15px 0;
            font-size: 18px;
          }
          .print-row {
            display: flex;
            margin-bottom: 15px;
          }
          .print-field {
            flex: 1;
            margin-right: 20px;
          }
          .print-field:last-child {
            margin-right: 0;
          }
          .print-label {
            font-weight: bold;
            margin-bottom: 5px;
            display: block;
            color: #1a2540;
          }
          .print-value {
            border: 1px solid #c2d8ff;
            padding: 8px;
            border-radius: 4px;
            min-height: 20px;
          }
          .print-full-width {
            width: 100%;
          }
          .print-textarea {
            min-height: 80px;
          }
          @media print {
            body {
              padding: 0;
            }
            .print-container {
              border: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <h1>HISTORIA CLÍNICA VETERINARIA</h1>
            <p>Registro médico completo de su mascota</p>
          </div>
          
          <div class="print-section">
            <h2>Datos del Propietario</h2>
            <div class="print-row">
              <div class="print-field">
                <span class="print-label">Nombre completo</span>
                <div class="print-value">${currentData.nombrePropietario || ""}</div>
              </div>
              <div class="print-field">
                <span class="print-label">Número de identidad</span>
                <div class="print-value">${currentData.identidad || ""}</div>
              </div>
            </div>
            
            <div class="print-row">
              <div class="print-field print-full-width">
                <span class="print-label">Dirección</span>
                <div class="print-value">${currentData.direccion || ""}</div>
              </div>
            </div>
            
            <div class="print-row">
              <div class="print-field">
                <span class="print-label">Teléfono principal</span>
                <div class="print-value">${currentData.celular1 || ""}</div>
              </div>
              <div class="print-field">
                <span class="print-label">Teléfono alternativo</span>
                <div class="print-value">${currentData.celular2 || ""}</div>
              </div>
            </div>
          </div>
          
          <div class="print-section">
            <h2>Datos de la Mascota</h2>
            <div class="print-row">
              <div class="print-field">
                <span class="print-label">Nombre</span>
                <div class="print-value">${currentData.nombreMascota || ""}</div>
              </div>
              <div class="print-field">
                <span class="print-label">Especie</span>
                <div class="print-value">${currentData.especie || ""}</div>
              </div>
            </div>
            
            <div class="print-row">
              <div class="print-field">
                <span class="print-label">Raza</span>
                <div class="print-value">${currentData.raza || ""}</div>
              </div>
              <div class="print-field">
                <span class="print-label">Sexo</span>
                <div class="print-value">${currentData.sexo || ""}</div>
              </div>
            </div>
            
            <div class="print-row">
              <div class="print-field">
                <span class="print-label">Fecha de Nacimiento</span>
                <div class="print-value">${currentData.fechaNacimiento || ""}</div>
              </div>
              <div class="print-field">
                <span class="print-label">Peso (kg)</span>
                <div class="print-value">${currentData.peso || ""}</div>
              </div>
            </div>
            
            <div class="print-row">
              <div class="print-field print-full-width">
                <span class="print-label">Color</span>
                <div class="print-value">${currentData.color || ""}</div>
              </div>
            </div>
          </div>
          
          <div class="print-section">
            <h2>Anamnesis</h2>
            <div class="print-row">
              <div class="print-field print-full-width">
                <span class="print-label">Motivo de consulta</span>
                <div class="print-value print-textarea">${currentData.motivoConsulta || ""}</div>
              </div>
            </div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(printContent)
    printWindow.document.close()
  }

  return (
    <div className={`historia-main ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}>
      <div className="historia-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="title-section">
              <h1>Historia Clínica Veterinaria</h1>
              <p>Registro médico completo de su mascota</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form className="historia-form">
          {/* Datos del Propietario */}
          <section className="form-section">
            <h2>Datos del Propietario</h2>
            <div className="form-grid">
              <div className="form-row">
                <div className="form-field">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    name="nombrePropietario"
                    value={datosFormulario.nombrePropietario}
                    onChange={manejarCambio}
                    placeholder="Nombre del propietario"
                  />
                </div>
                <div className="form-field">
                  <label>Número de identidad</label>
                  <input
                    type="text"
                    name="identidad"
                    value={datosFormulario.identidad}
                    onChange={manejarCambio}
                    placeholder="Documento de identidad"
                  />
                </div>
              </div>

              <div className="form-field full-width">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={datosFormulario.direccion}
                  onChange={manejarCambio}
                  placeholder="Dirección completa"
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Teléfono principal</label>
                  <input
                    type="tel"
                    name="celular1"
                    value={datosFormulario.celular1}
                    onChange={manejarCambio}
                    placeholder="Número de contacto principal"
                  />
                </div>
                <div className="form-field">
                  <label>Teléfono alternativo</label>
                  <input
                    type="tel"
                    name="celular2"
                    value={datosFormulario.celular2}
                    onChange={manejarCambio}
                    placeholder="Número de contacto alternativo"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Datos de la Mascota */}
          <section className="form-section">
            <h2>Datos de la Mascota</h2>
            <div className="form-grid">
              <div className="form-row">
                <div className="form-field">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombreMascota"
                    value={datosFormulario.nombreMascota}
                    onChange={manejarCambio}
                    placeholder="Nombre de la mascota"
                  />
                </div>
                <div className="form-field">
                  <label>Especie</label>
                  <select name="especie" value={datosFormulario.especie} onChange={manejarCambio}>
                    <option value="">Seleccionar especie</option>
                    <option value="Canino">Canino</option>
                    <option value="Felino">Felino</option>
                    <option value="Ave">Ave</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Raza</label>
                  <input
                    type="text"
                    name="raza"
                    value={datosFormulario.raza}
                    onChange={manejarCambio}
                    placeholder="Raza de la mascota"
                  />
                </div>
                <div className="form-field">
                  <label>Sexo</label>
                  <select name="sexo" value={datosFormulario.sexo} onChange={manejarCambio}>
                    <option value="">Seleccionar sexo</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={datosFormulario.fechaNacimiento}
                    onChange={manejarCambio}
                  />
                </div>
                <div className="form-field">
                  <label>Peso (kg)</label>
                  <input
                    type="number"
                    name="peso"
                    value={datosFormulario.peso}
                    onChange={manejarCambio}
                    step="0.1"
                    placeholder="Peso en kg"
                  />
                </div>
              </div>

              <div className="form-field full-width">
                <label>Color</label>
                <input
                  type="text"
                  name="color"
                  value={datosFormulario.color}
                  onChange={manejarCambio}
                  placeholder="Color del pelaje"
                />
              </div>
            </div>
          </section>

          {/* Anamnesis */}
          <section className="form-section">
            <h2>Anamnesis</h2>
            <div className="form-grid">
              <div className="form-field full-width">
                <label>Motivo de consulta</label>
                <textarea
                  name="motivoConsulta"
                  value={datosFormulario.motivoConsulta}
                  onChange={manejarCambio}
                  rows="4"
                  placeholder="Describa el motivo de la consulta y los síntomas observados"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Botones */}
          <div className="form-actions">
            <div className="actions-content">
              <button type="button" onClick={manejarLimpiar} className="btn-secondary">
                Limpiar
              </button>
              <button type="button" onClick={manejarGuardar} className="btn-primary">
                Guardar Historia Clínica
              </button>
              <button type="button" onClick={manejarImprimir} className="btn-secondary">
                Imprimir
              </button>
              {notification.show && <div className={`status-message ${notification.type}`}>{notification.message}</div>}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HisCli
