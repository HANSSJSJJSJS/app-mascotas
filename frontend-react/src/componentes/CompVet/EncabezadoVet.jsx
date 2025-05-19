"use client"
import { Menu, Search, Bell } from 'lucide-react'
import "../../stylos/cssVet/EncabezadoVet.css"

const EncabezadoVet = ({ onToggleMenu, isSidebarOpen, userData }) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`encabezado-container-vet ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <header className="encabezado-vet">
        <div className="header-left">
          <button className="boton-menu-vet" onClick={onToggleMenu}>
            <Menu size={20} />
            <span>MENU</span>
          </button>
          
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar paciente..." 
              className="search-input" 
            />
          </div>
        </div>

        <div className="header-right">
          <div className="date-display">
            <div className="current-date">{currentDate}</div>
            <div className="current-time">{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          
          <div className="notifications">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
          </div>
          
          <div className="info-usuario-vet">
            <span>{userData?.username || "Dr. Carlos Rodríguez"}</span>
            <small>{userData?.role || "Veterinario"}</small>
          </div>
        </div>
      </header>
    </div>
  )
}

export default EncabezadoVet