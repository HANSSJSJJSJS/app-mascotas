"use client"

import { useState } from "react"
import { Briefcase, Plus, Edit, Trash2, Eye, DollarSign, FileText, CheckCircle, Calendar, Tag } from "lucide-react"
import "../../stylos/cssAdmin/GestionServicios.css"

const GestionServicios = () => {
  const [activeTab, setActiveTab] = useState("lista")
  const [categoriaFilter, setCategoriaFilter] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("")
  const [precioFilter, setPrecioFilter] = useState("")

  // Datos de ejemplo de servicios
  const servicios = [
    {
      codigo: 1,
      nombre: "Consulta General",
      descripcion: "Examen médico completo para evaluación del estado de salud general de la mascota",
      precio: 45000,
      fechaCreacion: "2024-01-15",
      estado: "Activo",
      categoria: "Consulta",
    },
    {
      codigo: 2,
      nombre: "Vacunación Múltiple",
      descripcion: "Aplicación de vacunas esenciales para prevenir enfermedades comunes en mascotas",
      precio: 65000,
      fechaCreacion: "2024-01-10",
      estado: "Activo",
      categoria: "Prevención",
    },
    {
      codigo: 3,
      nombre: "Cirugía Menor",
      descripcion: "Procedimientos quirúrgicos ambulatorios de baja complejidad",
      precio: 150000,
      fechaCreacion: "2024-01-05",
      estado: "Activo",
      categoria: "Cirugía",
    },
    {
      codigo: 4,
      nombre: "Desparasitación",
      descripcion: "Tratamiento para eliminar parásitos internos y externos",
      precio: 35000,
      fechaCreacion: "2024-01-20",
      estado: "Activo",
      categoria: "Tratamiento",
    },
    {
      codigo: 5,
      nombre: "Radiografía",
      descripcion: "Estudio radiológico para diagnóstico de lesiones internas",
      precio: 80000,
      fechaCreacion: "2024-02-01",
      estado: "Inactivo",
      categoria: "Diagnóstico",
    },
    {
      codigo: 6,
      nombre: "Limpieza Dental",
      descripcion: "Profilaxis dental completa con ultrasonido y pulido",
      precio: 120000,
      fechaCreacion: "2024-02-05",
      estado: "Activo",
      categoria: "Odontología",
    },
  ]

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Datos del servicio:", formData)
    // Aquí iría la lógica para enviar los datos
  }

  // Filtrar servicios según los filtros seleccionados
  const filteredServicios = servicios.filter((servicio) => {
    // Filtro por categoría
    if (categoriaFilter && categoriaFilter !== "todas" && servicio.categoria !== categoriaFilter) {
      return false
    }
    // Filtro por estado
    if (estadoFilter && estadoFilter !== "todos" && servicio.estado !== estadoFilter) {
      return false
    }
    // Filtro por precio
    if (precioFilter) {
      if (precioFilter === "bajo" && servicio.precio > 50000) return false
      if (precioFilter === "medio" && (servicio.precio <= 50000 || servicio.precio > 100000)) return false
      if (precioFilter === "alto" && servicio.precio <= 100000) return false
    }
    return true
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getCategoriaColor = (categoria) => {
    const colors = {
      Consulta: "consulta",
      Prevención: "prevencion",
      Cirugía: "cirugia",
      Tratamiento: "tratamiento",
      Diagnóstico: "diagnostico",
      Odontología: "odontologia",
    }
    return colors[categoria] || "default"
  }

  return (
    <div className="gestion-servicios">
      <div className="page-header-compact">
        <div className="header-content-centered">
          <div className="title-container">
            <div className="header-icon">
              <Briefcase size={32} />
            </div>
            <div className="header-text">
              <h1>Gestión de Servicios</h1>
              <p>Administra todos los servicios veterinarios del sistema</p>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button className={`tab ${activeTab === "lista" ? "active" : ""}`} onClick={() => setActiveTab("lista")}>
            <Eye size={18} />
            Lista de Servicios
          </button>
          <button
            className={`tab ${activeTab === "registrar" ? "active" : ""}`}
            onClick={() => setActiveTab("registrar")}
          >
            <Plus size={18} />
            Registrar Servicio
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "lista" && (
          <div className="lista-servicios">
            <div className="filters-section">
              <div className="filters-label">Filtros:</div>
              <div className="filters-container">
                <select
                  className="filter-select"
                  value={categoriaFilter}
                  onChange={(e) => setCategoriaFilter(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Prevención">Prevención</option>
                  <option value="Cirugía">Cirugía</option>
                  <option value="Tratamiento">Tratamiento</option>
                  <option value="Diagnóstico">Diagnóstico</option>
                  <option value="Odontología">Odontología</option>
                </select>
                <select
                  className="filter-select"
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
                <select
                  className="filter-select"
                  value={precioFilter}
                  onChange={(e) => setPrecioFilter(e.target.value)}
                >
                  <option value="">Todos los precios</option>
                  <option value="bajo">Bajo (hasta $50.000)</option>
                  <option value="medio">Medio ($50.001 - $100.000)</option>
                  <option value="alto">Alto (más de $100.000)</option>
                </select>
              </div>
            </div>

            <div className="servicios-grid">
              {filteredServicios.map((servicio) => (
                <div key={servicio.codigo} className="servicio-card">
                  <div className="servicio-header">
                    <div className={`servicio-icon ${getCategoriaColor(servicio.categoria)}`}>
                      <Briefcase size={24} />
                    </div>
                    <div className="servicio-info">
                      <h3>{servicio.nombre}</h3>
                      <div className="servicio-meta">
                        <span className={`categoria-badge ${getCategoriaColor(servicio.categoria)}`}>
                          <Tag size={12} />
                          {servicio.categoria}
                        </span>
                        <span className={`estado-badge ${servicio.estado.toLowerCase()}`}>
                          {servicio.estado === "Activo" ? <CheckCircle size={14} /> : <Eye size={14} />}
                          {servicio.estado}
                        </span>
                      </div>
                    </div>
                    <div className="precio-badge">
                      <DollarSign size={16} />
                      {formatPrice(servicio.precio)}
                    </div>
                  </div>

                  <div className="servicio-description">
                    <p>{servicio.descripcion}</p>
                  </div>

                  <div className="servicio-details">
                    <div className="detail-item">
                      <Calendar size={16} className="detail-icon" />
                      <span className="detail-text">Creado: {servicio.fechaCreacion}</span>
                    </div>
                    <div className="detail-item">
                      <FileText size={16} className="detail-icon" />
                      <span className="detail-text">Código: #{servicio.codigo}</span>
                    </div>
                  </div>

                  <div className="servicio-actions">
                    <button className="btn-edit">
                      <Edit size={16} />
                      Editar
                    </button>
                    <button className="btn-delete">
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "registrar" && (
          <div className="registrar-servicio">
            <div className="form-header">
              <div className="form-header-icon">
                <Plus size={24} />
              </div>
              <div className="form-header-text">
                <h2>Registrar Nuevo Servicio</h2>
                <p>Completa el formulario para crear un nuevo servicio veterinario</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="servicio-form">
              <div className="form-container">
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <Briefcase size={20} />
                    </div>
                    <h3>Información del Servicio</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre del Servicio</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        placeholder="Ej: Consulta General"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Categoría</label>
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        required
                        className="form-select"
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="Consulta">Consulta</option>
                        <option value="Prevención">Prevención</option>
                        <option value="Cirugía">Cirugía</option>
                        <option value="Tratamiento">Tratamiento</option>
                        <option value="Diagnóstico">Diagnóstico</option>
                        <option value="Odontología">Odontología</option>
                        <option value="Emergencia">Emergencia</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Precio (COP)</label>
                      <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        required
                        placeholder="45000"
                        className="form-input"
                        min="0"
                        step="1000"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Descripción</label>
                      <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        required
                        placeholder="Describe detalladamente el servicio..."
                        className="form-textarea"
                        rows="4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  <CheckCircle size={18} />
                  Registrar Servicio
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default GestionServicios
