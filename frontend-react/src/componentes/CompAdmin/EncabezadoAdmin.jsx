"use client"
import { User } from "lucide-react"
import "../../stylos/cssAdmin/Encabezado.css"

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
          <div className="info-usuario">
            <span>{userData?.username || "Admin"}</span>
            <small>{userData?.role || "Administrador"}</small>
          </div>
        </div>
      </header>
    </div>
  )
}

export default EncabezadoAdmin
