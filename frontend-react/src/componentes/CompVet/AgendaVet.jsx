import { Calendar, FileText, PawPrint, Plus, Activity, Pill, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from "react-router-dom"
import "../../stylos/cssVet/BaseVet.css"
import "../../stylos/cssVet/AgendaVet.css"
import { useState } from "react"

export default function AgendaVet() {
  const [activeTab, setActiveTab] = useState("dia")

  return (
    <div className="vet-container">
      {/* Barra lateral */}
      <div className="sidebar">
        <div className="sidebar-header">
          <PawPrint className="sidebar-logo" />
          <span>VETCLINIC</span>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-user-role">Veterinario</div>
          <div className="sidebar-user-name">Dr. Carlos Rodríguez</div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link">
            <Activity className="sidebar-icon" />
            <span>Dashboard</span>
          </Link>
          <Link to="/agenda" className="sidebar-link active">
            <Calendar className="sidebar-icon" />
            <span>Agenda</span>
          </Link>
          <Link to="/pacientes" className="sidebar-link">
            <PawPrint className="sidebar-icon" />
            <span>Pacientes</span>
          </Link>
          <Link to="/consulta" className="sidebar-link">
            <FileText className="sidebar-icon" />
            <span>Consultas</span>
          </Link>
          <Link to="/historial" className="sidebar-link">
            <FileText className="sidebar-icon" />
            <span>Historiales</span>
          </Link>
          <Link to="/inventario" className="sidebar-link">
            <Pill className="sidebar-icon" />
            <span>Inventario</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button">
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        {/* Cabecera */}
        <header className="header">
          <div className="header-container">
            <h1 className="page-title">Agenda</h1>
            <div className="header-actions">
              <Link to="/consulta/nueva" className="btn btn-primary">
                <Plus className="btn-icon" />
                Nueva cita
              </Link>
            </div>
          </div>
        </header>

        {/* Contenido de Agenda */}
        <main className="content">
          <div className="content-container">
            <div className="tabs">
              <div className="tabs-header">
                <div className="tabs-list">
                  <button 
                    className={`tab-button ${activeTab === "dia" ? "active" : ""}`}
                    onClick={() => setActiveTab("dia")}
                  >
                    Día
                  </button>
                  <button 
                    className={`tab-button ${activeTab === "semana" ? "active" : ""}`}
                    onClick={() => setActiveTab("semana")}
                  >
                    Semana
                  </button>
                  <button 
                    className={`tab-button ${activeTab === "mes" ? "active" : ""}`}
                    onClick={() => setActiveTab("mes")}
                  >
                    Mes
                  </button>
                </div>
                <div className="date-navigation">
                  <button className="btn btn-outline btn-sm">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="current-date">12 de mayo, 2025</div>
                  <button className="btn btn-outline btn-sm">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button className="btn btn-outline btn-sm">
                    Hoy
                  </button>
                </div>
              </div>

              <div className="tab-content">
                {activeTab === "dia" && (
                  <div className="card">
                    <div className="day-schedule">
                      <div className="time-slot">
                        <div className="time-label">09:00</div>
                        <div className="appointment-container">
                          <div className="appointment blue">
                            <div className="appointment-title">Max (Labrador)</div>
                            <div className="appointment-detail">Vacunación anual</div>
                            <div className="appointment-detail">Propietario: Juan Pérez</div>
                          </div>
                        </div>
                      </div>

                      <div className="time-slot">
                        <div className="time-label">10:00</div>
                        <div className="appointment-container"></div>
                      </div>

                      <div className="time-slot">
                        <div className="time-label">11:00</div>
                        <div className="appointment-container">
                          <div className="appointment green">
                            <div className="appointment-title">Luna (Siamés)</div>
                            <div className="appointment-detail">Control rutinario</div>
                            <div className="appointment-detail">Propietario: María González</div>
                          </div>
                        </div>
                      </div>

                      <div className="time-slot">
                        <div className="time-label">12:00</div>
                        <div className="appointment-container"></div>
                      </div>

                      <div className="time-slot">
                        <div className="time-label">13:00</div>
                        <div className="appointment-container"></div>
                      </div>

                      <div className="time-slot">
                        <div className="time-label">14:00</div>
                        <div className="appointment-container"></div>
                      </div>

                      <div className="time-slot">
                        <div className="time-label">15:00</div>
                        <div className="appointment-container">
                          <div className="appointment purple">
                            <div className="appointment-title">Rocky (Bulldog)</div>
                            <div className="appointment-detail">Seguimiento dermatológico</div>
                            <div className="appointment-detail">Propietario: Ana Martínez</div>
                          </div>
                        </div>
                      </div>

                      <div className="time-slot">
                        <div className="time-label">16:00</div>
                        <div className="appointment-container"></div>
                      </div>

                      <div className="time-slot">
                        <div className="time-label">17:00</div>
                        <div className="appointment-container">
                          <div className="appointment yellow">
                            <div className="appointment-title">Coco (Poodle)</div>
                            <div className="appointment-detail">Limpieza dental</div>
                            <div className="appointment-detail">Propietario: Roberto Sánchez</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "semana" && (
                  <div className="card">
                    <div className="card-content">
                      <div className="week-schedule">
                        <table className="schedule-table">
                          <thead>
                            <tr>
                              <th>Hora</th>
                              <th>Lunes</th>
                              <th>Martes</th>
                              <th>Miércoles</th>
                              <th>Jueves</th>
                              <th>Viernes</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="time-cell">09:00</td>
                              <td className="appointment-cell blue">Max (Labrador)</td>
                              <td></td>
                              <td></td>
                              <td className="appointment-cell green">Simba (Persa)</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td className="time-cell">10:00</td>
                              <td></td>
                              <td className="appointment-cell purple">Toby (Beagle)</td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td className="time-cell">11:00</td>
                              <td className="appointment-cell green">Luna (Siamés)</td>
                              <td></td>
                              <td className="appointment-cell yellow">Nala (Mestizo)</td>
                              <td></td>
                              <td className="appointment-cell blue">Kira (Pastor)</td>
                            </tr>
                            <tr>
                              <td className="time-cell">12:00</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td className="time-cell">15:00</td>
                              <td className="appointment-cell purple">Rocky (Bulldog)</td>
                              <td></td>
                              <td></td>
                              <td className="appointment-cell green">Milo (Gato)</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td className="time-cell">17:00</td>
                              <td className="appointment-cell yellow">Coco (Poodle)</td>
                              <td></td>
                              <td className="appointment-cell blue">Lucas (Husky)</td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "mes" && (
                  <div className="card">
                    <div className="card-content">
                      <div className="month-calendar">
                        <div className="calendar-grid">
                          <div className="calendar-header">Lun</div>
                          <div className="calendar-header">Mar</div>
                          <div className="calendar-header">Mié</div>
                          <div className="calendar-header">Jue</div>
                          <div className="calendar-header">Vie</div>
                          <div className="calendar-header">Sáb</div>
                          <div className="calendar-header">Dom</div>

                          <div className="calendar-day prev-month">29</div>
                          <div className="calendar-day prev-month">30</div>
                          <div className="calendar-day prev-month">1</div>
                          <div className="calendar-day">2</div>
                          <div className="calendar-day">3</div>
                          <div className="calendar-day">4</div>
                          <div className="calendar-day">5</div>

                          <div className="calendar-day">6</div>
                          <div className="calendar-day">7</div>
                          <div className="calendar-day">8</div>
                          <div className="calendar-day">9</div>
                          <div className="calendar-day">10</div>
                          <div className="calendar-day">11</div>
                          <div className="calendar-day">12</div>

                          <div className="calendar-day current">13</div>
                          <div className="calendar-day">14</div>
                          <div className="calendar-day">15</div>
                          <div className="calendar-day">16</div>
                          <div className="calendar-day">17</div>
                          <div className="calendar-day">18</div>
                          <div className="calendar-day">19</div>

                          <div className="calendar-day">20</div>
                          <div className="calendar-day">21</div>
                          <div className="calendar-day">22</div>
                          <div className="calendar-day">23</div>
                          <div className="calendar-day">24</div>
                          <div className="calendar-day">25</div>
                          <div className="calendar-day">26</div>

                          <div className="calendar-day">27</div>
                          <div className="calendar-day">28</div>
                          <div className="calendar-day">29</div>
                          <div className="calendar-day">30</div>
                          <div className="calendar-day">31</div>
                          <div className="calendar-day next-month">1</div>
                          <div className="calendar-day next-month">2</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}