import { useState, useEffect } from "react"
import { Activity, Calendar, FileText, PawPrint, Pill, User, X } from 'lucide-react'
import { Link, useLocation } from "react-router-dom"
import "../../stylos/cssVet/BarraVet.css"

const BarraVet = ({ onToggleMenu, menuAbierto }) => {
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  const menuItems = [
    { icon: Activity, text: "", path: "/PanelVeterinario" },
    { icon: Calendar, text: "Agenda", path: "/PanelVeterinario/agenda" },
    { icon: PawPrint, text: "Pacientes", path: "/PanelVeterinario/pacientes" },
    { icon: FileText, text: "Consultas", path: "/PanelVeterinario/consultas" },
    { icon: FileText, text: "Historiales", path: "/PanelVeterinario/historiales" },
    { icon: Pill, text: "Inventario", path: "/PanelVeterinario/inventario" },
    { icon: User, text: "Perfil", path: "/PanelVeterinario/perfil" },
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
    <aside className={`barra-lateral-vet ${isMobile ? "mobile" : ""} ${menuAbierto ? "open" : "closed"}`}>
      {isMobile && (
        <button onClick={onToggleMenu} className="close-button">
          <X size={20} />
        </button>
      )}

      <div className="barra-header">
        <PawPrint className="logo-icon" />
        <h2 className={menuAbierto ? "" : "hidden"}>VETCLINIC</h2>
      </div>
      
      <div className="vet-info">
        <div className={`vet-role ${!menuAbierto ? "hidden" : ""}`}>Veterinario</div>
        <div className={`vet-name ${!menuAbierto ? "hidden" : ""}`}>Dr. Carlos Rodríguez</div>
      </div>

      <nav>
        <ul className="menu-lateral-vet">
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

      <div className="barra-footer">
        <button className="logout-btn">
          {menuAbierto ? "Cerrar sesión" : <X size={20} />}
        </button>
      </div>
    </aside>
  )
}

export default BarraVet