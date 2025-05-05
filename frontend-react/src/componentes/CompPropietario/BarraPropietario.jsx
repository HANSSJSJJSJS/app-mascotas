"use client"

import { useState, useEffect } from "react"
import { Home, Calendar, User, Bone, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import "../../stylos/cssPropietario/BarraPropietario.css"

const BarraPropietario = ({ onToggleMenu, menuAbierto }) => {
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  const menuItems = [
    { icon: Home, text: "Inicio", path: "/PanelPropietario" },
    { icon: Calendar, text: "Agendar Cita", path: "/PanelPropietario/agendar-cita" },
    { icon: User, text: "Actualizar Datos", path: "/PanelPropietario/ActualizarPropietario" },
    { icon: Bone, text: "Mascota", path: "/PanelPropietario/Mascota" },
  ]

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <aside className={`barra-lateral ${isMobile ? "mobile" : ""} ${menuAbierto ? "open" : "closed"}`}>
      {isMobile && (
        <button onClick={onToggleMenu} className="close-button">
          <X size={20} />
        </button>
      )}

      <h2 className={menuAbierto ? "" : "hidden"}>MENU PROPIETARIO</h2>
      <nav>
        <ul className="menu-lateral">
          {menuItems.map(({ icon: Icon, text, path }) => (
            <li key={text} className={location.pathname === path ? "active" : ""}>
              <Link to={path} className="link" onClick={() => isMobile && onToggleMenu()}>
                <Icon />
                {menuAbierto && <span>{text}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default BarraPropietario
