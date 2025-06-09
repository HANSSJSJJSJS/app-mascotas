"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Shield, Users, UserCheck, UserX, Crown, Stethoscope, Heart, Lock, Eye } from "lucide-react"
import UsuariosPorRol from "./UsuariosPorRol"
import "../../stylos/cssAdmin/GestionRoles.css"
import Loading from "../index/Loading"

const GestionRoles = () => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [vistaActual, setVistaActual] = useState("roles")
  const [rolSeleccionado, setRolSeleccionado] = useState(null)

  const fetchRoles = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get("http://localhost:5000/api/admin/gestion-roles")
      setRoles(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error("Error al cargar los roles:", err)
      const errorMessage = err.response?.data?.message || "No se pudieron cargar los roles."
      setError(errorMessage)
      Swal.fire("Error", errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (vistaActual === "roles") {
      fetchRoles()
    }
  }, [vistaActual])

  // El buscador funcionará automáticamente con los roles cargados
  const [searchTerm, setSearchTerm] = useState("")
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
    setRolSeleccionado(rol)
    setVistaActual("usuarios")
  }

  const handleVolverARoles = () => {
    setVistaActual("roles")
    setRolSeleccionado(null)
  }

  if (loading) {
    return <Loading />
  }

  if (vistaActual === "usuarios" && rolSeleccionado) {
    return <UsuariosPorRol rol={rolSeleccionado} onVolver={handleVolverARoles} />
  }

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
          {error && <p className="error-message">{error}</p>}
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
