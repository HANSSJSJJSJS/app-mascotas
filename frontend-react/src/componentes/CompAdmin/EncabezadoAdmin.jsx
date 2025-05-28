import { User, LogOut } from "lucide-react"
import "../../stylos/cssAdmin/Encabezado.css"
import { Link } from "react-router-dom"

const EncabezadoAdmin = ({ userData, isSidebarOpen }) => {
  return (
    <div className={`encabezado-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <header className="encabezado-1">
        <div className="welcome-container">
          <div className="welcome-content">
            <User size={24} className="welcome-icon" />
            <div className="welcome-text">
              <span className="welcome-title">Bienvenido Administrador</span>
              <small className="welcome-subtitle">Panel de Control</small>
            </div>
          </div>
        </div>

        <div className="header-controls">
          <Link to="/Home" className="user-logout-btn">
            <LogOut size={18} className="logout-icon" />
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </header>
    </div>
  )
}

export default EncabezadoAdmin