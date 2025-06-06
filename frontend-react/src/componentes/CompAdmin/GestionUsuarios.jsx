"use client"

import { useState } from "react"
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  CheckCircle,
  Calendar,
  MapPin,
  Mail,
  Shield,
} from "lucide-react"
import "../../stylos/cssAdmin/GestionUsuarios.css"

const GestionUsuarios = () => {
  const [activeTab, setActiveTab] = useState("lista")
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de ejemplo
  const usuarios = [
    {
      id: 1,
      nombre: "Juan",
      apellido: "Pérez",
      email: "juan@email.com",
      rol: "Propietario",
      estado: "Activo",
      fechaRegistro: "2024-01-15",
      ciudad: "Bogotá",
      tipoDocumento: "CC",
      numeroDocumento: "1234567890",
    },
    {
      id: 2,
      nombre: "María",
      apellido: "González",
      email: "maria@email.com",
      rol: "Veterinario",
      estado: "Activo",
      fechaRegistro: "2024-01-10",
      ciudad: "Medellín",
      tipoDocumento: "CE",
      numeroDocumento: "0987654321",
    },
    {
      id: 3,
      nombre: "Carlos",
      apellido: "Ruiz",
      email: "carlos@email.com",
      rol: "Administrador",
      estado: "Inactivo",
      fechaRegistro: "2024-01-05",
      ciudad: "Cali",
      tipoDocumento: "PP",
      numeroDocumento: "5678901234",
    },
    {
      id: 4,
      nombre: "Ana",
      apellido: "Martínez",
      email: "ana@email.com",
      rol: "Propietario",
      estado: "Activo",
      fechaRegistro: "2024-01-20",
      ciudad: "Barranquilla",
      tipoDocumento: "CC",
      numeroDocumento: "3456789012",
    },
  ]

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    tipoDocumento: "CC",
    numeroDocumento: "", // Este es numeroid en la BD
    genero: "",
    fechaNacimiento: "",
    ciudad: "",
    direccion: "",
    rol: "", // Este es id_rol en la BD
    tipoPersona: "", // Este es id_tipo en la BD
    password: "",
    confirmarPassword: "",
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    console.log("Datos del formulario:", formData)
    // Aquí iría la lógica para enviar los datos
  }

  // Filtrar usuarios por ID, nombre y apellido
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.id.toString().includes(searchTerm.toLowerCase()) ||
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="gestion-usuarios">
      {/* Header compacto como las otras gestiones */}
      <div className="page-header-compact">
        <div className="header-content-centered">
          <div className="title-container">
            <div className="header-icon">
              <Users size={32} />
            </div>
            <div className="header-text">
              <h1>Gestión de Usuarios</h1>
              <p>Administra todos los usuarios del sistema</p>
            </div>
          </div>
        </div>
      </div>

      {/* Solo 2 pestañas: Lista y Registrar */}
      <div className="tabs-container">
        <div className="tabs">
          <button className={`tab ${activeTab === "lista" ? "active" : ""}`} onClick={() => setActiveTab("lista")}>
            <Eye size={18} />
            Lista de Usuarios
          </button>
          <button
            className={`tab ${activeTab === "registrar" ? "active" : ""}`}
            onClick={() => setActiveTab("registrar")}
          >
            <Plus size={18} />
            Registrar Usuario
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "lista" && (
          <div className="lista-usuarios">
            {/* Barra de búsqueda por ID y nombre (sin botón Nuevo Usuario) */}
            <div className="search-section">
              <div className="search-container">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar por ID, nombre o apellido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="usuarios-grid">
              {filteredUsuarios.map((usuario) => (
                <div key={usuario.id} className="usuario-card">
                  <div className="usuario-header">
                    <div className={`usuario-avatar ${usuario.rol.toLowerCase()}`}>
                      {usuario.nombre.charAt(0)}
                      {usuario.apellido.charAt(0)}
                    </div>
                    <div className="usuario-info">
                      <h3>
                        {usuario.nombre} {usuario.apellido}
                      </h3>
                      <div className="usuario-meta">
                        <span className="documento-badge">
                          {usuario.tipoDocumento} {usuario.numeroDocumento}
                        </span>
                        <span className={`rol-badge ${usuario.rol.toLowerCase()}`}>{usuario.rol}</span>
                      </div>
                    </div>
                    <div className={`estado-badge ${usuario.estado.toLowerCase()}`}>
                      {usuario.estado === "Activo" ? <UserCheck size={16} /> : <UserX size={16} />}
                      {usuario.estado}
                    </div>
                  </div>
                  <div className="usuario-details">
                    <div className="detail-item">
                      <Mail size={16} className="detail-icon" />
                      <span className="detail-text">{usuario.email}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={16} className="detail-icon" />
                      <span className="detail-text">{usuario.ciudad}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} className="detail-icon" />
                      <span className="detail-text">{usuario.fechaRegistro}</span>
                    </div>
                  </div>
                  <div className="usuario-actions">
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

        {/* FORMULARIO ORIGINAL SIN CAMBIOS */}
        {activeTab === "registrar" && (
          <div className="registrar-usuario">
            <div className="form-header">
              <div className="form-header-icon">
                <Plus size={24} />
              </div>
              <div className="form-header-text">
                <h2>Registrar Nuevo Usuario</h2>
                <p>Completa el formulario para crear un nuevo usuario en el sistema</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="usuario-form">
              <div className="form-container">
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <Users size={20} />
                    </div>
                    <h3>Información Personal</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese nombre"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido</label>
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese apellido"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipo de Documento</label>
                      <select
                        name="tipoDocumento"
                        value={formData.tipoDocumento}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PP">Pasaporte</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Número de Documento</label>
                      <input
                        type="text"
                        name="numeroDocumento"
                        value={formData.numeroDocumento}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese número de documento"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Género</label>
                      <select
                        name="genero"
                        value={formData.genero}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="">Seleccionar</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Hombre">Hombre</option>
                        <option value="No identificado">No identificado</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Fecha de Nacimiento</label>
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <Mail size={20} />
                    </div>
                    <h3>Información de Contacto</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="ejemplo@correo.com"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Ciudad</label>
                      <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        required
                        placeholder="Ciudad de residencia"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Dirección</label>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        required
                        placeholder="Dirección completa"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <Shield size={20} />
                    </div>
                    <h3>Información del Sistema</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Rol</label>
                      <select
                        name="rol"
                        value={formData.rol}
                        onChange={handleInputChange}
                        required
                        className="form-select"
                      >
                        <option value="">Seleccionar rol</option>
                        <option value="1">Administrador</option>
                        <option value="2">Veterinario</option>
                        <option value="3">Propietario</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Tipo de Persona</label>
                      <select
                        name="tipoPersona"
                        value={formData.tipoPersona}
                        onChange={handleInputChange}
                        required
                        className="form-select"
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="1">Veterinario</option>
                        <option value="2">Propietario</option>
                        <option value="3">Administrador</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Contraseña</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Contraseña segura"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirmar Contraseña</label>
                      <input
                        type="password"
                        name="confirmarPassword"
                        value={formData.confirmarPassword}
                        onChange={handleInputChange}
                        required
                        placeholder="Repita la contraseña"
                        className="form-input"
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
                  Registrar Usuario
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default GestionUsuarios
