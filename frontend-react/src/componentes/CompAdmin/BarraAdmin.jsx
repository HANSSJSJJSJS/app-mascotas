"use client"

import { Link, useLocation } from "react-router-dom"
import "../../stylos/cssAdmin/BarraLateral.css"

// Importar iconos directamente
import { Home, Calendar, Users, Briefcase, Stethoscope, Bone, Clock, History, LogOut } from "lucide-react"

const BarraLateral = ({ onToggleMenu, menuAbierto }) => {
  const location = useLocation()

  // Definir los elementos del menú
  const menuItems = [
    { icon: <Home size={18} />, text: "Inicio", path: "/PanelAdmin" },
    { icon: <Calendar size={18} />, text: "Citas", path: "/PanelAdmin/TablaCitas" },
    { icon: <Users size={18} />, text: "Usuarios", path: "/PanelAdmin/usuarios" },
    { icon: <Briefcase size={18} />, text: "Servicios", path: "/PanelAdmin/servicios" },
    { icon: <Stethoscope size={18} />, text: "Veterinarios", path: "/PanelAdmin/veterinarios" },
    { icon: <Bone size={18} />, text: "Mascotas", path: "/PanelAdmin/mascotas" },
    { icon: <Clock size={18} />, text: "Horarios", path: "/PanelAdmin/horarios" },
    { icon: <History size={18} />, text: "Historial Clínico", path: "/PanelAdmin/historial-clinico" },
  ]

  return (
    <aside className={`barra-lateral ${!menuAbierto ? "colapsado" : ""}`}>
      {/* Encabezado de la barra lateral */}
      <div className="barra-header" onClick={onToggleMenu} style={{ cursor: "pointer" }}>
        <h2>{menuAbierto ? "MENU ADMIN" : "MENU"}</h2>
      </div>

      <div className="menu-scroll-container">
        <nav>
          <ul className="menu-lateral">
            {menuItems.map((item, index) => (
              <li key={index} className={location.pathname === item.path ? "active" : ""}>
                <Link to={item.path} className="link">
                  <div className="icon-container">{item.icon}</div>
                  {menuAbierto && <span className="text-container">{item.text}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="barra-footer">
        <Link to="/logout" className="logout-link">
          <div className="icon-container">
            <LogOut size={18} />
          </div>
          {menuAbierto && <span className="text-container">Cerrar Sesión</span>}
        </Link>
      </div>
    </aside>
  )
}

export default BarraLateral
