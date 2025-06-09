"use client"
import { Menu, Search, Bell, LogOut } from 'lucide-react'
import { Link } from "react-router-dom"
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
        </div>

        <div className="header-right">
          <div className="date-display">
            <div className="current-date">{currentDate}</div>
            <div className="current-time">{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          
          <div className="header-controls">
            <Link to="/Home" className="user-logout-btn">
              <LogOut size={18} className="logout-icon" />
              <span>Cerrar Sesión</span>
            </Link>
          </div>
          

        </div>
      </header>
    </div>
  )
}

export default EncabezadoVet;
