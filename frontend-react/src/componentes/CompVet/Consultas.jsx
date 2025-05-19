import { Calendar, FileText, PawPrint, Plus, Search, Activity, Pill } from 'lucide-react'
import { Link } from "react-router-dom"
import "../../stylos/cssVet/Consultas.css"
import "../../stylos/cssVet/Card.css"

export default function Consultas() {
  return (
    <div className="consultas-container">
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
            Dashboard
          </Link>
          <Link to="/agenda" className="sidebar-link">
            <Calendar className="sidebar-icon" />
            Agenda
          </Link>
          <Link to="/pacientes" className="sidebar-link">
            <PawPrint className="sidebar-icon" />
            Pacientes
          </Link>
          <Link to="/consulta" className="sidebar-link active">
            <FileText className="sidebar-icon" />
            Consultas
          </Link>
          <Link to="/historial" className="sidebar-link">
            <FileText className="sidebar-icon" />
            Historiales
          </Link>
          <Link to="/inventario" className="sidebar-link">
            <Pill className="sidebar-icon" />
            Inventario
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
            <h1 className="page-title">Consultas</h1>
            <div className="header-actions">
              <Link to="/consulta/nueva" className="btn btn-primary">
                <Plus className="btn-icon" />
                Nueva consulta
              </Link>
            </div>
          </div>
        </header>

        {/* Contenido de Consultas */}
        <main className="content">
          <div className="content-container">
            <div className="search-filters">
              <div className="search-container">
                <Search className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Buscar por paciente, propietario o diagnóstico..." 
                  className="search-input" 
                />
              </div>
              <div className="filters">
                <button className="btn btn-outline">
                  <Calendar className="btn-icon" />
                  Filtrar por fecha
                </button>
                <button className="btn btn-outline">
                  <PawPrint className="btn-icon" />
                  Filtrar por especie
                </button>
              </div>
            </div>

            <div className="tabs">
              <div className="tabs-list">
                <button className="tab-button active">Todas</button>
                <button className="tab-button">Hoy</button>
                <button className="tab-button">Esta semana</button>
                <button className="tab-button">Este mes</button>
              </div>

              <div className="tab-content">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">12 de mayo, 2025</h3>
                  </div>
                  <div className="card-content">
                    <div className="consultas-list">
                      <div className="consulta-item">
                        <div className="consulta-info">
                          <div className="consulta-name">Max (Labrador)</div>
                          <div className="consulta-detail">Vacunación anual</div>
                          <div className="consulta-detail">Propietario: Juan Pérez</div>
                        </div>
                        <div className="consulta-actions">
                          <button className="btn btn-outline btn-sm">
                            Ver detalles
                          </button>
                          <button className="btn btn-success btn-sm">
                            Atender
                          </button>
                        </div>
                      </div>

                      <div className="consulta-item">
                        <div className="consulta-info">
                          <div className="consulta-name">Luna (Siamés)</div>
                          <div className="consulta-detail">Control rutinario</div>
                          <div className="consulta-detail">Propietario: María González</div>
                        </div>
                        <div className="consulta-actions">
                          <button className="btn btn-outline btn-sm">
                            Ver detalles
                          </button>
                          <button className="btn btn-success btn-sm">
                            Atender
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mt-4">
                  <div className="card-header">
                    <h3 className="card-title">11 de mayo, 2025</h3>
                  </div>
                  <div className="card-content">
                    <div className="consultas-list">
                      <div className="consulta-item">
                        <div className="consulta-info">
                          <div className="consulta-name">Rocky (Bulldog)</div>
                          <div className="consulta-detail">Problema dermatológico</div>
                          <div className="consulta-detail">Propietario: Ana Martínez</div>
                        </div>
                        <div className="consulta-actions">
                          <button className="btn btn-outline btn-sm">
                            Ver detalles
                          </button>
                          <button className="btn btn-success btn-sm">
                            Atender
                          </button>
                        </div>
                      </div>

                      <div className="consulta-item">
                        <div className="consulta-info">
                          <div className="consulta-name">Coco (Poodle)</div>
                          <div className="consulta-detail">Limpieza dental</div>
                          <div className="consulta-detail">Propietario: Roberto Sánchez</div>
                        </div>
                        <div className="consulta-actions">
                          <button className="btn btn-outline btn-sm">
                            Ver detalles
                          </button>
                          <button className="btn btn-success btn-sm">
                            Atender
                          </button>
                        </div>
                      </div>
                    </div>
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