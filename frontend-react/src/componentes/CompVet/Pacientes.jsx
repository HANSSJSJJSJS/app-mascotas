import { Calendar, FileText, PawPrint, Plus, Search, Activity, Pill, Filter } from 'lucide-react'
import { Link } from "react-router-dom"
import { useState } from "react"
import "../../stylos/cssVet/BaseVet.css"
import "../../stylos/cssVet/Pacientes.css"

export default function Pacientes() {
  const [activeTab, setActiveTab] = useState("todos")

  const pacientes = {
    todos: [
      { id: 1, nombre: "Max", especie: "Perro", raza: "Labrador", edad: "3 años", sexo: "Macho", propietario: "Juan Pérez" },
      { id: 2, nombre: "Luna", especie: "Gato", raza: "Siamés", edad: "2 años", sexo: "Hembra", propietario: "María González" },
      { id: 3, nombre: "Rocky", especie: "Perro", raza: "Bulldog", edad: "4 años", sexo: "Macho", propietario: "Ana Martínez" },
      { id: 4, nombre: "Coco", especie: "Perro", raza: "Poodle", edad: "5 años", sexo: "Macho", propietario: "Roberto Sánchez" },
      { id: 5, nombre: "Simba", especie: "Gato", raza: "Persa", edad: "3 años", sexo: "Macho", propietario: "Miguel Torres" },
      { id: 6, nombre: "Nala", especie: "Perro", raza: "Mestizo", edad: "2 años", sexo: "Hembra", propietario: "Laura Gómez" }
    ],
    perros: [
      { id: 1, nombre: "Max", especie: "Perro", raza: "Labrador", edad: "3 años", sexo: "Macho", propietario: "Juan Pérez" },
      { id: 3, nombre: "Rocky", especie: "Perro", raza: "Bulldog", edad: "4 años", sexo: "Macho", propietario: "Ana Martínez" },
      { id: 4, nombre: "Coco", especie: "Perro", raza: "Poodle", edad: "5 años", sexo: "Macho", propietario: "Roberto Sánchez" }
    ],
    gatos: [
      { id: 2, nombre: "Luna", especie: "Gato", raza: "Siamés", edad: "2 años", sexo: "Hembra", propietario: "María González" },
      { id: 5, nombre: "Simba", especie: "Gato", raza: "Persa", edad: "3 años", sexo: "Macho", propietario: "Miguel Torres" }
    ],
    otros: []
  }

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
          <Link to="/agenda" className="sidebar-link">
            <Calendar className="sidebar-icon" />
            <span>Agenda</span>
          </Link>
          <Link to="/pacientes" className="sidebar-link active">
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
            <h1 className="page-title">Pacientes</h1>
            <div className="header-actions">
              <Link to="/pacientes/nuevo" className="btn btn-primary">
                <Plus className="btn-icon" />
                Nuevo paciente
              </Link>
            </div>
          </div>
        </header>

        {/* Contenido de Pacientes */}
        <main className="content">
          <div className="content-container">
            <div className="search-filter-bar">
              <div className="search-container">
                <Search className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, especie o propietario..." 
                  className="search-input" 
                />
              </div>
              <div className="filter-container">
                <button className="btn btn-outline btn-sm">
                  <Filter className="btn-icon" />
                  Filtrar
                </button>
              </div>
            </div>

            <div className="tabs">
              <div className="tabs-list">
                <button 
                  className={`tab-button ${activeTab === "todos" ? "active" : ""}`}
                  onClick={() => setActiveTab("todos")}
                >
                  Todos
                </button>
                <button 
                  className={`tab-button ${activeTab === "perros" ? "active" : ""}`}
                  onClick={() => setActiveTab("perros")}
                >
                  Perros
                </button>
                <button 
                  className={`tab-button ${activeTab === "gatos" ? "active" : ""}`}
                  onClick={() => setActiveTab("gatos")}
                >
                  Gatos
                </button>
                <button 
                  className={`tab-button ${activeTab === "otros" ? "active" : ""}`}
                  onClick={() => setActiveTab("otros")}
                >
                  Otros
                </button>
              </div>

              <div className="tab-content">
                {pacientes[activeTab].length > 0 ? (
                  <div className="patients-grid">
                    {pacientes[activeTab].map(paciente => (
                      <div className="patient-card" key={paciente.id}>
                        <div className="patient-info">
                          <div className="patient-icon-container">
                            <PawPrint className="patient-icon" />
                          </div>
                          <div className="patient-details">
                            <div className="patient-name">{paciente.nombre}</div>
                            <div className="patient-data">{paciente.especie} - {paciente.raza}</div>
                            <div className="patient-data">{paciente.edad} - {paciente.sexo}</div>
                            <div className="patient-data">Propietario: {paciente.propietario}</div>
                          </div>
                        </div>
                        <div className="patient-actions">
                          <Link to={`/historial/${paciente.id}`} className="btn btn-outline btn-sm">
                            Ver historial
                          </Link>
                          <Link to={`/consulta/nueva?paciente=${paciente.id}`} className="btn btn-success btn-sm">
                            Nueva consulta
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-content empty-state">
                      <div className="empty-message">No hay pacientes en esta categoría</div>
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