"use client"
import { Menu } from "lucide-react"
import "../../stylos/cssPropietario/EncabezadoPropietario.css"

const EncabezadoPropietario = ({ onToggleMenu, isSidebarOpen, userData }) => {
  return (
    <div className={`encabezado-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <header className="encabezado">
        <button className="boton-menu" onClick={onToggleMenu}>
          <Menu size={20} />
          <span>MENU</span>
        </button>

        <div className="header-controls">
          <div className="info-usuario">
            <span>{userData?.username || "Propietario"}</span>
            <small>{userData?.role || "Propietario"}</small>
          </div>
        </div>
      </header>
    </div>
  )
}

export default EncabezadoPropietario
