"use client"
import { Menu } from "lucide-react"
import "../../stylos/cssAdmin/Encabezado.css"

const EncabezadoAdmin = ({ onToggleMenu, isSidebarOpen, userData }) => {
  return (
    <div className={`encabezado-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <header className="encabezado">
        <div className="menu-container">
          <button className="boton-menu" onClick={onToggleMenu}>
            <Menu size={20} />
            <span>MENU</span>
          </button>
        </div>

        <div className="header-controls">
          <div className="info-usuario">
            <span>{userData?.username || "Admi"}</span>
            <small>{userData?.role || "Administrador"}</small>
          </div>
        </div>
      </header>
    </div>
  )
}

export default EncabezadoAdmin
