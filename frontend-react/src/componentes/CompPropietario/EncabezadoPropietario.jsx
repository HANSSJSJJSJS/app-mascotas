import { useState } from "react"
import { Menu, X, LogOut, ChevronDown, ChevronUp, Mail } from "lucide-react"
import PropTypes from "prop-types"
import Swal from "sweetalert2"
import "../../stylos/cssPropietario/EncabezadoPropietario.css"

const EncabezadoPropietario = ({ onToggleMenu, estaMenuAbierto, userData = {}, onCerrarSesion }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { nombre = "", apellido = "", username = "", email = "" } = userData
  const nombreCompleto = nombre || apellido ? `${nombre} ${apellido}` : "Propietario"

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar Sesión?",
      text: "¿Estás seguro de que quieres salir?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#495a90",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onCerrarSesion()
      }
    })
  }

  // Si no hay datos de usuario, mostrar estado de carga
  if (!userData || Object.keys(userData).length === 0) {
    return (
      <header className={`encabezado ${estaMenuAbierto ? "menu-abierto" : "menu-cerrado"}`}>
        <div className="encabezado-left">
          <button className="menu-toggle" onClick={onToggleMenu}>
            <Menu size={24} />
          </button>
        </div>
        <div className="encabezado-right">
          <p>Cargando...</p>
        </div>
      </header>
    )
  }

  return (
    <header className={`encabezado ${estaMenuAbierto ? "menu-abierto" : "menu-cerrado"}`}>
      <div className="encabezado-left">
        <button className="menu-toggle" onClick={onToggleMenu}>
          {estaMenuAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="encabezado-right">
        <div className={`user-profile-menu ${isDropdownOpen ? "open" : ""}`}>
          <button className="user-profile-trigger" onClick={toggleDropdown}>
            <div className="avatar">
              <span>{nombreCompleto ? nombreCompleto[0].toUpperCase() : "P"}</span>
            </div>
            <div className="user-info">
              <h4>Propietario</h4>
              <p>{username || nombreCompleto}</p>
            </div>
            {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {isDropdownOpen && (
            <div className="user-dropdown-menu">
              <div className="dropdown-header">
                <div className="avatar large">
                  <span>{nombreCompleto ? nombreCompleto[0].toUpperCase() : "P"}</span>
                </div>
                <div className="user-info">
                  <h4>{nombreCompleto}</h4>
                  <p>Propietario</p>
                </div>
              </div>
              <div className="dropdown-divider"></div>

              {email && (
                <a href={`mailto:${email}`} className="dropdown-item">
                  <Mail size={16} />
                  <span>{email}</span>
                </a>
              )}

              <button className="dropdown-item logout" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

EncabezadoPropietario.propTypes = {
  onToggleMenu: PropTypes.func.isRequired,
  estaMenuAbierto: PropTypes.bool.isRequired,
  userData: PropTypes.shape({
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
  }),
  onCerrarSesion: PropTypes.func.isRequired,
}

export default EncabezadoPropietario
