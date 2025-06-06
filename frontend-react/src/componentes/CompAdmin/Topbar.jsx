"use client"

import { Menu, X, Search, User, LogOut } from "lucide-react"
import "../../stylos/cssAdmin/Topbar.css"

const Topbar = ({
  toggleSidebar,
  sidebarCollapsed,
  isMobile,
  mobileMenuOpen,
  userData = { name: "Juan Pérez", email: "juan@petmoybe.com" },
}) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          {isMobile && mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="topbar-search">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Buscar usuarios, servicios..." className="search-input" />
        </div>
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
