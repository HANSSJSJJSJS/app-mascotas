"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Users,
  Search,
  Mail,
  MapPin,
  Calendar,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Crown,
  Stethoscope,
  Heart,
} from "lucide-react"
import "../../stylos/cssAdmin/UsuariosPorRol.css"

const UsuariosPorRol = ({ rol, onVolver }) => {
  const [usuarios, setUsuarios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo - aquí conectarías con tu API
  const usuariosEjemplo = {
    1: [
      // Administrador
      {
        id: 1,
        nombre: "Carlos",
        apellido: "Ruiz",
        email: "carlos.admin@petmoybe.com",
        tipoDocumento: "CC",
        numeroDocumento: "1234567890",
        ciudad: "Bogotá",
        direccion: "Calle 123 #45-67",
        telefono: "3001234567",
        fechaRegistro: "2024-01-15",
        estado: "Activo",
        fechaNacimiento: "1985-03-20",
        genero: "Hombre",
      },
      {
        id: 2,
        nombre: "Ana",
        apellido: "García",
        email: "ana.admin@petmoybe.com",
        tipoDocumento: "CC",
        numeroDocumento: "0987654321",
        ciudad: "Medellín",
        direccion: "Carrera 50 #30-20",
        telefono: "3109876543",
        fechaRegistro: "2024-01-10",
        estado: "Activo",
        fechaNacimiento: "1990-07-15",
        genero: "Mujer",
      },
      {
        id: 3,
        nombre: "Luis",
        apellido: "Martínez",
        email: "luis.admin@petmoybe.com",
        tipoDocumento: "CE",
        numeroDocumento: "5678901234",
        ciudad: "Cali",
        direccion: "Avenida 6 #25-30",
        telefono: "3205678901",
        fechaRegistro: "2024-02-01",
        estado: "Inactivo",
        fechaNacimiento: "1988-11-08",
        genero: "Hombre",
      },
    ],
    2: [
      // Veterinario
      {
        id: 4,
        nombre: "María",
        apellido: "González",
        email: "maria.vet@petmoybe.com",
        tipoDocumento: "CC",
        numeroDocumento: "1122334455",
        ciudad: "Bogotá",
        direccion: "Calle 80 #15-25",
        telefono: "3151122334",
        fechaRegistro: "2024-01-20",
        estado: "Activo",
        fechaNacimiento: "1987-05-12",
        genero: "Mujer",
      },
      {
        id: 5,
        nombre: "Pedro",
        apellido: "Ramírez",
        email: "pedro.vet@petmoybe.com",
        tipoDocumento: "CC",
        numeroDocumento: "2233445566",
        ciudad: "Medellín",
        direccion: "Carrera 70 #40-50",
        telefono: "3162233445",
        fechaRegistro: "2024-01-25",
        estado: "Activo",
        fechaNacimiento: "1985-09-30",
        genero: "Hombre",
      },
      {
        id: 6,
        nombre: "Laura",
        apellido: "Hernández",
        email: "laura.vet@petmoybe.com",
        tipoDocumento: "CC",
        numeroDocumento: "3344556677",
        ciudad: "Cali",
        direccion: "Calle 100 #20-30",
        telefono: "3173344556",
        fechaRegistro: "2024-02-05",
        estado: "Activo",
        fechaNacimiento: "1992-12-18",
        genero: "Mujer",
      },
    ],
    3: [
      // Propietario
      {
        id: 7,
        nombre: "Juan",
        apellido: "Pérez",
        email: "juan.prop@gmail.com",
        tipoDocumento: "CC",
        numeroDocumento: "4455667788",
        ciudad: "Bogotá",
        direccion: "Calle 45 #12-34",
        telefono: "3184455667",
        fechaRegistro: "2024-01-30",
        estado: "Activo",
        fechaNacimiento: "1990-04-25",
        genero: "Hombre",
      },
      {
        id: 8,
        nombre: "Sofia",
        apellido: "López",
        email: "sofia.prop@gmail.com",
        tipoDocumento: "CC",
        numeroDocumento: "5566778899",
        ciudad: "Medellín",
        direccion: "Carrera 30 #50-60",
        telefono: "3195566778",
        fechaRegistro: "2024-02-10",
        estado: "Activo",
        fechaNacimiento: "1995-08-14",
        genero: "Mujer",
      },
      {
        id: 9,
        nombre: "Diego",
        apellido: "Torres",
        email: "diego.prop@gmail.com",
        tipoDocumento: "PP",
        numeroDocumento: "6677889900",
        ciudad: "Cali",
        direccion: "Avenida 5 #35-45",
        telefono: "3206677889",
        fechaRegistro: "2024-02-15",
        estado: "Inactivo",
        fechaNacimiento: "1988-01-22",
        genero: "Hombre",
      },
    ],
  }

  useEffect(() => {
    // Simular carga de datos
    setLoading(true)
    setTimeout(() => {
      setUsuarios(usuariosEjemplo[rol.id] || [])
      setLoading(false)
    }, 500)
  }, [rol.id])

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.numeroDocumento.includes(searchTerm),
  )

  const getRolIcon = (tipo) => {
    switch (tipo) {
      case "administrador":
        return <Crown size={24} />
      case "veterinario":
        return <Stethoscope size={24} />
      case "propietario":
        return <Heart size={24} />
      default:
        return <Users size={24} />
    }
  }

  const handleEditarUsuario = (usuario) => {
    console.log("Editar usuario:", usuario)
    // Aquí implementarías la lógica para editar
  }

  const handleEliminarUsuario = (usuario) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`)) {
      console.log("Eliminar usuario:", usuario)
      // Aquí implementarías la lógica para eliminar
    }
  }

  if (loading) {
    return (
      <div className="usuarios-por-rol loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="usuarios-por-rol">
      <div className="page-header">
        <div className="header-content">
          <button className="btn-volver" onClick={onVolver}>
            <ArrowLeft size={20} />
            Volver a Roles
          </button>
          <div className="header-info">
            <div className={`header-icon ${rol.tipo}`}>{getRolIcon(rol.tipo)}</div>
            <div>
              <h1>Usuarios con rol: {rol.nombre}</h1>
              <p>{filteredUsuarios.length} usuarios encontrados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="usuarios-container">
        <div className="usuarios-header">
          <div className="search-section">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="usuarios-content">
          {filteredUsuarios.length === 0 ? (
            <div className="no-usuarios">
              <Users size={48} />
              <h3>No se encontraron usuarios</h3>
              <p>No hay usuarios con el rol "{rol.nombre}" que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="usuarios-grid">
              {filteredUsuarios.map((usuario) => (
                <div key={usuario.id} className="usuario-card">
                  <div className="usuario-header">
                    <div className={`usuario-avatar ${rol.tipo}`}>
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
                        <span className={`estado-badge ${usuario.estado.toLowerCase()}`}>
                          {usuario.estado === "Activo" ? <UserCheck size={14} /> : <UserX size={14} />}
                          {usuario.estado}
                        </span>
                      </div>
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
                      <span className="detail-text">Registro: {usuario.fechaRegistro}</span>
                    </div>
                  </div>

                  <div className="usuario-extra-info">
                    <div className="info-row">
                      <span className="info-label">Teléfono:</span>
                      <span className="info-value">{usuario.telefono}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Dirección:</span>
                      <span className="info-value">{usuario.direccion}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Género:</span>
                      <span className="info-value">{usuario.genero}</span>
                    </div>
                  </div>

                  <div className="usuario-actions">
                    <button className="btn-edit" onClick={() => handleEditarUsuario(usuario)}>
                      <Edit size={16} />
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleEliminarUsuario(usuario)}>
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsuariosPorRol
