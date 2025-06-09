// Archivo: Topbar.jsx (VERSIÓN FINAL)

"use client"
import { Menu, X, User, LogOut } from "lucide-react"
import "../../stylos/cssAdmin/Topbar.css" // Asegúrate que esta ruta es correcta

const Topbar = ({
  toggleSidebar,
  sidebarCollapsed, // Recibe el estado
  isMobile,
  mobileMenuOpen,
  userData = { name: "Juan Pérez", email: "juan@petmoybe.com" },
}) => {
  return (
    // El header aplica la clase 'collapsed' a sí mismo para moverse
    <header className={`topbar ${!isMobile && sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="topbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          {isMobile && mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="topbar-right">
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <h4>Administrador</h4>
            <p>{userData.name}</p>
          </div>
        </div>
        <button className="logout-btn">
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </header>
  )
}

export default Topbar