// InicioVet.jsx
import { Calendar, Clock, FileText, PawPrint, Plus, Activity, Pill, ChevronRight } from 'lucide-react'
import { Link } from "react-router-dom"
import "../../stylos/cssVet/InicioVet.css"
import "../../stylos/cssVet/Card.css"

export default function InicioVet() {
  return (
    // Eliminamos el div con clase "flex h-screen bg-blue-50" y el div "flex-1 overflow-auto"
    // También eliminamos el header que está duplicando el EncabezadoVeterinario
    <>
      {/* Contenido del Dashboard */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Bienvenido, Dr. Carlos</h1>
          <p className="text-gray-600">Aquí tienes un resumen de tu día</p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card summary-card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="summary-icon-container blue">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <div className="summary-label">Citas hoy</div>
                  <div className="summary-value">8</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card summary-card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="summary-icon-container green">
                  <PawPrint className="h-6 w-6" />
                </div>
                <div>
                  <div className="summary-label">Pacientes totales</div>
                  <div className="summary-value">142</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card summary-card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="summary-icon-container purple">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="summary-label">Consultas pendientes</div>
                  <div className="summary-value">3</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card summary-card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="summary-icon-container yellow">
                  <Pill className="h-6 w-6" />
                </div>
                <div>
                  <div className="summary-label">Medicamentos bajos</div>
                  <div className="summary-value">5</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Citas de hoy */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Citas de hoy</h3>
                <Link to="/agenda" className="link-text">
                  Ver todas <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="appointment-card blue">
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="appointment-icon-container blue">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="appointment-title">09:00 - Max (Labrador)</div>
                          <div className="appointment-text">Vacunación anual</div>
                          <div className="appointment-text">Propietario: Juan Pérez</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-sm btn-success">
                          Atender
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="appointment-card green">
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="appointment-icon-container green">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="appointment-title">11:00 - Luna (Siamés)</div>
                          <div className="appointment-text">Control rutinario</div>
                          <div className="appointment-text">Propietario: María González</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-sm btn-success">
                          Atender
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="appointment-card gray">
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="appointment-icon-container gray">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="appointment-title">15:00 - Rocky (Bulldog)</div>
                          <div className="appointment-text">Seguimiento dermatológico</div>
                          <div className="appointment-text">Propietario: Ana Martínez</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-sm btn-success">
                          Atender
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="appointment-card gray">
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="appointment-icon-container gray">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="appointment-title">17:00 - Coco (Poodle)</div>
                          <div className="appointment-text">Limpieza dental</div>
                          <div className="appointment-text">Propietario: Roberto Sánchez</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-sm btn-success">
                          Atender
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pacientes recientes */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Pacientes recientes</h3>
                <Link to="/pacientes" className="link-text">
                  Ver todos <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="patient-item">
                    <div className="patient-icon-container">
                      <PawPrint className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="patient-name">Max</div>
                      <div className="patient-info">Labrador, 3 años</div>
                    </div>
                    <Link to="/historial/1" className="patient-link">
                      Historial
                    </Link>
                  </div>

                  <div className="patient-item">
                    <div className="patient-icon-container">
                      <PawPrint className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="patient-name">Luna</div>
                      <div className="patient-info">Siamés, 2 años</div>
                    </div>
                    <Link to="/historial/2" className="patient-link">
                      Historial
                    </Link>
                  </div>

                  <div className="patient-item">
                    <div className="patient-icon-container">
                      <PawPrint className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="patient-name">Rocky</div>
                      <div className="patient-info">Bulldog, 4 años</div>
                    </div>
                    <Link to="/historial/3" className="patient-link">
                      Historial
                    </Link>
                  </div>

                  <div className="patient-item">
                    <div className="patient-icon-container">
                      <PawPrint className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="patient-name">Coco</div>
                      <div className="patient-info">Poodle, 5 años</div>
                    </div>
                    <Link to="/historial/4" className="patient-link">
                      Historial
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/consulta/nueva" className="quick-access-card">
              <div className="quick-access-icon-container blue">
                <FileText className="h-6 w-6" />
              </div>
              <div className="quick-access-title">Nueva consulta</div>
            </Link>
            <Link to="/agenda/nueva" className="quick-access-card">
              <div className="quick-access-icon-container green">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="quick-access-title">Agendar cita</div>
            </Link>
            <Link to="/pacientes/nuevo" className="quick-access-card">
              <div className="quick-access-icon-container purple">
                <Plus className="h-6 w-6" />
              </div>
              <div className="quick-access-title">Nuevo paciente</div>
            </Link>
            <Link to="/reportes" className="quick-access-card">
              <div className="quick-access-icon-container yellow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                  />
                </svg>
              </div>
              <div className="quick-access-title">Reportes</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}