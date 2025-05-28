
import { useState, useEffect } from "react"
import { Home, Calendar, User, Bone, X, LogOut, PawPrint } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import "../../stylos/cssPropietario/BarraPropietario.css"

const BarraPropietario = ({ onToggleMenu, menuAbierto }) => {
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  // Definir los elementos del menú con mejor estructura
  const menuItems = [
    { icon: <Home size={18} />, text: "Inicio", path: "/PanelPropietario" },
    { icon: <Calendar size={18} />, text: "Agendar Cita", path: "/PanelPropietario/agendar-cita" },
    { icon: <User size={18} />, text: "Actualizar Datos", path: "/PanelPropietario/ActualizarPropietario" },
    { icon: <Bone size={18} />, text: "Mascota", path: "/PanelPropietario/Mascota" },
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
    <aside className={`barra-lateral ${isMobile ? "mobile" : ""} ${!menuAbierto ? "colapsado" : ""}`}>
      {/* Botón de cerrar para móvil */}
      {isMobile && (
        <button onClick={onToggleMenu} className="close-button">
          <X size={20} />
        </button>
      )}

      {/* Encabezado de la barra lateral con logo */}
      <div
        className="barra-header"
        onClick={!isMobile ? onToggleMenu : undefined}
        style={{ cursor: !isMobile ? "pointer" : "default" }}
      >
        <div className="logo-container">
          <PawPrint size={24} className="logo-icon" />
          {menuAbierto && <span className="logo-text">PET MOYBE</span>}
        </div>
      </div>

      {/* Contenedor con scroll para el menú */}
      <div className="menu-scroll-container">
        <nav>
          <ul className="menu-lateral">
            {menuItems.map((item, index) => (
              <li key={index} className={location.pathname === item.path ? "active" : ""}>
                <Link to={item.path} className="link" onClick={() => isMobile && onToggleMenu()}>
                  <div className="icon-container">{item.icon}</div>
                  <span className="text-container">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer con logout */}
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

export default BarraPropietario
