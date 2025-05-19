"use client"

import { useState, useRef } from "react"
import "../../stylos/cssAdmin/HisCli.css"
import { obtenerFechaHoraActual, guardarDatos, validarCamposObligatorios } from "../../funcionalidades/FHisCli"
import logo from "../../imagenes/logo.png";

function HisCli() {
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

  const [mensaje, setMensaje] = useState("")
  const printFrameRef = useRef(null)

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setDatosFormulario((estadoPrevio) => ({
      ...estadoPrevio,
      [name]: value,
    }))
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
      setMensaje(resultado.mensaje)
      setTimeout(() => setMensaje(""), 3000)
    } else {
      setMensaje(validacion.mensaje)
      setTimeout(() => setMensaje(""), 3000)
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
            background-color: #657cd3;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .print-header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
          }
          .print-header p {
            margin: 5px 0 0;
            font-size: 14px;
          }
          .print-logo {
            width: 80px;
            height: auto;
            margin-bottom: 10px;
          }
          .print-section {
            padding: 20px;
            border-bottom: 1px solid #eee;
          }
          .print-section h2 {
            color: #3f3399;
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
            color: #495a90;
          }
          .print-value {
            border: 1px solid #8196eb;
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
            <img src="${logo}" class="print-logo" alt="Logo" />
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
          // Auto print when loaded
          window.onload = function() {
            window.print();
            // Optional: Close after printing
            // window.onfocus = function() { window.close(); }
          }
        </script>
      </body>
      </html>
    `

    // Escribe el contenido en la nueva ventana y activa la impresión
    printWindow.document.open()
    printWindow.document.write(printContent)
    printWindow.document.close()
  }

  return (
    <main className="contenedor">
      <header>
        <div className="titulo">
          <div className="logo-container">
            <img src={logo || "/placeholder.svg"} alt="Logo" />
          </div>
          <div>
            <h1>HISTORIA CLÍNICA VETERINARIA</h1>
            <p>Registro médico completo de su mascota</p>
          </div>
        </div>
      </header>

      <form id="formularioHistoriaClinica">
        <section>
          <h2>Datos del Propietario</h2>
          <div className="fila">
            <div className="campo">
              <label>Nombre completo</label>
              <input
                type="text"
                name="nombrePropietario"
                value={datosFormulario.nombrePropietario}
                onChange={manejarCambio}
                placeholder="Nombre del propietario"
              />
            </div>
            <div className="campo">
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
          <div className="campo">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={datosFormulario.direccion}
              onChange={manejarCambio}
              placeholder="Dirección completa"
            />
          </div>
          <div className="fila">
            <div className="campo">
              <label>Teléfono principal</label>
              <input
                type="tel"
                name="celular1"
                value={datosFormulario.celular1}
                onChange={manejarCambio}
                placeholder="Número de contacto principal"
              />
            </div>
            <div className="campo">
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
        </section>

        <section>
          <h2>Datos de la Mascota</h2>
          <div className="fila">
            <div className="campo">
              <label>Nombre</label>
              <input
                type="text"
                name="nombreMascota"
                value={datosFormulario.nombreMascota}
                onChange={manejarCambio}
                placeholder="Nombre de la mascota"
              />
            </div>
            <div className="campo">
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
          <div className="fila">
            <div className="campo">
              <label>Raza</label>
              <input
                type="text"
                name="raza"
                value={datosFormulario.raza}
                onChange={manejarCambio}
                placeholder="Raza de la mascota"
              />
            </div>
            <div className="campo">
              <label>Sexo</label>
              <select name="sexo" value={datosFormulario.sexo} onChange={manejarCambio}>
                <option value="">Seleccionar sexo</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
          </div>
          <div className="fila">
            <div className="campo">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={datosFormulario.fechaNacimiento}
                onChange={manejarCambio}
              />
            </div>
            <div className="campo">
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
          <div className="campo">
            <label>Color</label>
            <input
              type="text"
              name="color"
              value={datosFormulario.color}
              onChange={manejarCambio}
              placeholder="Color del pelaje"
            />
          </div>
        </section>

        <section>
          <h2>Anamnesis</h2>
          <div className="campo">
            <label>Motivo de consulta</label>
            <textarea
              name="motivoConsulta"
              value={datosFormulario.motivoConsulta}
              onChange={manejarCambio}
              rows="4"
              placeholder="Describa el motivo de la consulta y los síntomas observados"
            ></textarea>
          </div>
        </section>

        <div className="botones">
          <button type="button" onClick={manejarLimpiar}>
            Limpiar
          </button>

          <button type="button" onClick={manejarGuardar}>
            Guardar Historia Clínica

          </button>
        
          <button type="button" onClick={manejarImprimir}>
            Imprimir
          </button>
          
        </div>
      </form>

      {mensaje && (
        <div id="mensaje" className={mensaje.includes("correctamente") ? "exito" : "error"}>
          {mensaje}
        </div>
      )}

    </main>
  )
}

export default HisCli;
