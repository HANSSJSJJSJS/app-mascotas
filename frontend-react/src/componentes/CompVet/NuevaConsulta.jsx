import { ArrowLeft, Calendar, FileText, PawPrint, Plus, Activity, Pill } from 'lucide-react'
import { Link } from "react-router-dom"
import { useState } from "react"
import "../../stylos/cssVet/BaseVet.css"
import "../../stylos/cssVet/NuevaConsulta.css"

export default function NuevaConsulta() {
  const [formData, setFormData] = useState({
    paciente: "",
    tipoConsulta: "Control de rutina",
    peso: "",
    temperatura: "",
    motivo: "",
    anamnesis: "",
    examenFisico: "",
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
    proximaCita: "No es necesario",
    motivoProximaCita: "Control"
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Datos de la consulta:", formData)
    // Aquí iría la lógica para guardar la consulta
  }

  return (
    <div className="vet-container">
      {/* Barra lateral */}
      <div className="sidebar">
        <div className="sidebar-header">
          <PawPrint className="sidebar-logo" />
          <span>PET MOYBE</span>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-user-role">Veterinario</div>
          <div className="sidebar-user-name">Dr. Carlos Rodríguez</div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/inicio" className="sidebar-link">
            <Activity className="sidebar-icon" />
            <span>Inicio</span>
          </Link>
          <Link to="/agenda" className="sidebar-link">
            <Calendar className="sidebar-icon" />
            <span>Agenda</span>
          </Link>
          <Link to="/mascotas" className="sidebar-link">
            <PawPrint className="sidebar-icon" />
            <span>Mascotas</span>
          </Link>
          <Link to="/historiales" className="sidebar-link active">
            <FileText className="sidebar-icon" />
            <span>Historiales</span>
          </Link>
          <Link to="/funcionalidades-medicas" className="sidebar-link">
            <FileText className="sidebar-icon" />
            <span>Funcionalidades-Medicas</span>
          </Link>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        {/* Cabecera */}
        <header className="header">
          <div className="header-container">
            <div className="header-back">
              <Link to="/consulta" className="back-button">
                <ArrowLeft className="back-icon" />
              </Link>
              <h1 className="page-title">Nueva Consulta</h1>
            </div>
          </div>
        </header>

        {/* Contenido de Nueva Consulta */}
        <main className="content">
          <div className="content-container">
            <div className="consulta-grid">
              {/* Información del Paciente */}
              <div className="patient-info-section">
                <div className="card">
                  <div className="card-content">
                    <h2 className="section-title">Información del Paciente</h2>
                    <div className="form-section">
                      <div className="form-group">
                        <label className="form-label">Paciente</label>
                        <select 
                          className="form-select"
                          name="paciente"
                          value={formData.paciente}
                          onChange={handleChange}
                        >
                          <option value="">Seleccionar paciente</option>
                          <option value="max">Max - Labrador (Juan Pérez)</option>
                          <option value="luna">Luna - Siamés (María González)</option>
                          <option value="rocky">Rocky - Bulldog (Ana Martínez)</option>
                          <option value="coco">Coco - Poodle (Roberto Sánchez)</option>
                        </select>
                      </div>
                      
                      <div className="patient-data-card">
                        <h3 className="card-subtitle">Datos del paciente</h3>
                        <div className="patient-data-item">
                          <span className="data-label">Especie:</span>
                          <span className="data-value">Perro</span>
                        </div>
                        <div className="patient-data-item">
                          <span className="data-label">Raza:</span>
                          <span className="data-value">Labrador</span>
                        </div>
                        <div className="patient-data-item">
                          <span className="data-label">Edad:</span>
                          <span className="data-value">3 años</span>
                        </div>
                        <div className="patient-data-item">
                          <span className="data-label">Sexo:</span>
                          <span className="data-value">Macho</span>
                        </div>
                        <div className="patient-data-item">
                          <span className="data-label">Peso anterior:</span>
                          <span className="data-value">32 kg</span>
                        </div>
                      </div>
                      
                      <div className="owner-data-card">
                        <h3 className="card-subtitle">Propietario</h3>
                        <div className="patient-data-item">
                          <span className="data-label">Nombre:</span>
                          <span className="data-value">Juan Pérez</span>
                        </div>
                        <div className="patient-data-item">
                          <span className="data-label">Teléfono:</span>
                          <span className="data-value">555-123-4567</span>
                        </div>
                      </div>
                      
                      <div className="history-link">
                        <Link to="/historial/1" className="link-text">
                          <FileText className="link-icon" />
                          Ver historial completo
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario de Consulta */}
              <div className="consulta-form-section">
                <div className="card">
                  <div className="card-content">
                    <h2 className="section-title">Datos de la Consulta</h2>
                    <form className="consulta-form" onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Fecha</label>
                          <div className="date-display">
                            <Calendar className="date-icon" />
                            <span>12 de mayo de 2025</span>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Tipo de consulta</label>
                          <select 
                            className="form-select"
                            name="tipoConsulta"
                            value={formData.tipoConsulta}
                            onChange={handleChange}
                          >
                            <option>Control de rutina</option>
                            <option>Vacunación</option>
                            <option>Emergencia</option>
                            <option>Seguimiento</option>
                            <option>Cirugía</option>
                            <option>Otro</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Peso actual (kg)</label>
                          <input 
                            type="number" 
                            className="form-input" 
                            placeholder="Peso en kg"
                            name="peso"
                            value={formData.peso}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Temperatura (°C)</label>
                          <input 
                            type="number" 
                            step="0.1" 
                            className="form-input" 
                            placeholder="Temperatura"
                            name="temperatura"
                            value={formData.temperatura}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Motivo de consulta</label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Describa el motivo de la consulta"
                          name="motivo"
                          value={formData.motivo}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Anamnesis</label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Historial y síntomas reportados por el propietario"
                          name="anamnesis"
                          value={formData.anamnesis}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Examen físico</label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Hallazgos del examen físico"
                          name="examenFisico"
                          value={formData.examenFisico}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Diagnóstico</label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Diagnóstico presuntivo o definitivo"
                          name="diagnostico"
                          value={formData.diagnostico}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Tratamiento</label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Tratamiento prescrito"
                          name="tratamiento"
                          value={formData.tratamiento}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Observaciones y recomendaciones</label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Observaciones adicionales y recomendaciones para el propietario"
                          name="observaciones"
                          value={formData.observaciones}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="next-visit-section">
                        <h3 className="card-subtitle">Próxima visita</h3>
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Programar próxima cita</label>
                            <select 
                              className="form-select"
                              name="proximaCita"
                              value={formData.proximaCita}
                              onChange={handleChange}
                            >
                              <option>No es necesario</option>
                              <option>En 7 días</option>
                              <option>En 15 días</option>
                              <option>En 1 mes</option>
                              <option>En 3 meses</option>
                              <option>En 6 meses</option>
                              <option>En 1 año</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Motivo</label>
                            <select 
                              className="form-select"
                              name="motivoProximaCita"
                              value={formData.motivoProximaCita}
                              onChange={handleChange}
                            >
                              <option>Control</option>
                              <option>Seguimiento de tratamiento</option>
                              <option>Vacunación</option>
                              <option>Retirar puntos</option>
                              <option>Otro</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-actions">
                        <button type="button" className="btn btn-outline">
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                          <Plus className="btn-icon" />
                          Guardar consulta
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}