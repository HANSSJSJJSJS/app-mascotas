import { useState, useEffect } from "react"
import { Home, Calendar, Users, Briefcase, Stethoscope, Bone, Clock, History, LogOut, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import "../../stylos/cssAdmin/BarraLateral.css"

const BarraLateral = ({ onToggleMenu, menuAbierto }) => {
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  console.log(location.pathname); // Debería mostrar la ruta actual

  
  const menuItems = [
    { icon: Home, text: "Inicio", path: "/PanelAdmin" },
    { icon: Calendar, text: "Citas", path: "/PanelAdmin/TablaCitas" },
    { icon: Users, text: "Usuarios", path: "/PanelAdmin/usuarios" },
    { icon: Briefcase, text: "Servicios", path: "/PanelAdmin/servicios" },
    { icon: Stethoscope, text: "Veterinarios", path: "/PanelAdmin/veterinarios" },
    { icon: Bone, text: "Mascotas", path: "/PanelAdmin/mascotas" },
    { icon: Clock, text: "Horarios", path: "/PanelAdmin/horarios" },
    { icon: History, text: "Historial Clínico", path: "/PanelAdmin/historial-clinico" },
  ];

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

      <h2 className={menuAbierto ? "" : "hidden"}>MENU ADMIN</h2>
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
      
      {menuAbierto && (
        <div className="close-sesion">
          <Link to="/logout" className="logout-link">
            <LogOut size={16} />
            <h3>Cerrar Sesión</h3>
          </Link>
        </div>
      )}
      {!menuAbierto && (
        <div className="close-sesion-icon">
          <Link to="/logout" className="logout-icon">
            <LogOut size={20} />
          </Link>
        </div>
      )}
    </aside>
  )
}

export default BarraLateral