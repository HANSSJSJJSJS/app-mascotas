"use client"

import { useState } from "react"
import { Shield, Users, UserCheck, UserX, Crown, Stethoscope, Heart, Lock, Eye } from "lucide-react"
import UsuariosPorRol from "./UsuariosPorRol"
import "../../stylos/cssAdmin/GestionRoles.css"

const GestionRoles = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [vistaActual, setVistaActual] = useState("roles") // "roles" o "usuarios"
  const [rolSeleccionado, setRolSeleccionado] = useState(null)

  // Datos de roles del sistema
  const roles = [
    {
      id: 1,
      nombre: "Administrador",
      descripcion: "Acceso completo al sistema, gestión de usuarios, roles y configuración general",
      estado: "Activo",
      usuariosCount: 3,
      fechaCreacion: "2024-01-01",
      permisos: ["Gestionar usuarios", "Gestionar roles", "Ver reportes", "Configurar sistema"],
      tipo: "administrador",
    },
    {
      id: 2,
      nombre: "Veterinario",
      descripcion: "Acceso a gestión de citas, historiales clínicos y consultas médicas",
      estado: "Activo",
      usuariosCount: 8,
      fechaCreacion: "2024-01-01",
      permisos: ["Gestionar citas", "Ver historiales", "Crear consultas", "Gestionar pacientes"],
      tipo: "veterinario",
    },
    {
      id: 3,
      nombre: "Propietario",
      descripcion: "Acceso limitado para agendar citas y ver información de sus mascotas",
      estado: "Activo",
      usuariosCount: 156,
      fechaCreacion: "2024-01-01",
      permisos: ["Agendar citas", "Ver mascotas", "Ver historial propio"],
      tipo: "propietario",
    },
  ]

  const filteredRoles = roles.filter(
    (rol) =>
      rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rol.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRolIcon = (tipo) => {
    switch (tipo) {
      case "administrador":
        return <Crown size={28} />
      case "veterinario":
        return <Stethoscope size={28} />
      case "propietario":
        return <Heart size={28} />
      default:
        return <Shield size={28} />
    }
  }

  const handleVerUsuarios = (rol) => {
    console.log("Ver usuarios del rol:", rol.nombre) // Debug
    setRolSeleccionado(rol)
    setVistaActual("usuarios")
  }

  const handleVolverARoles = () => {
    console.log("Volviendo a roles") // Debug
    setVistaActual("roles")
    setRolSeleccionado(null)
  }

  // Si estamos viendo usuarios de un rol específico
  if (vistaActual === "usuarios" && rolSeleccionado) {
    return <UsuariosPorRol rol={rolSeleccionado} onVolver={handleVolverARoles} />
  }

  // Vista principal de roles
  return (
    <div className="gestion-roles">
      <div className="page-header-compact">
        <div className="header-content-centered">
          <div className="title-container">
            <div className="header-icon">
              <Shield size={32} />
            </div>
            <div className="header-text">
              <h1>Gestión de Roles</h1>
              <p>Administra los roles y permisos del sistema</p>
            </div>
          </div>
        </div>
      </div>

      <div className="roles-container">
        <div className="roles-content">
          <div className="roles-grid">
            {filteredRoles.map((rol) => (
              <div key={rol.id} className={`rol-card ${rol.tipo}`}>
                <div className="rol-header">
                  <div className={`rol-icon ${rol.tipo}`}>{getRolIcon(rol.tipo)}</div>
                  <div className="rol-info">
                    <h3>{rol.nombre}</h3>
                    <div className="rol-meta">
                      <span className="usuarios-count">
                        <Users size={14} />
                        {rol.usuariosCount} usuarios
                      </span>
                      <div className={`estado-badge ${rol.estado.toLowerCase()}`}>
                        {rol.estado === "Activo" ? <UserCheck size={14} /> : <UserX size={14} />}
                        {rol.estado}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rol-description">
                  <p>{rol.descripcion}</p>
                </div>

                <div className="permisos-section">
                  <h4>
                    <Lock size={16} />
                    Permisos principales:
                  </h4>
                  <div className="permisos-list">
                    {rol.permisos.map((permiso, index) => (
                      <span key={index} className="permiso-tag">
                        {permiso}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rol-actions">
                  <button className="btn-ver-usuarios" onClick={() => handleVerUsuarios(rol)}>
                    <Eye size={18} />
                    Ver Usuarios
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GestionRoles
