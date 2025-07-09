import { Link, useLocation } from "react-router-dom"
import { Home, Users, Shield, Briefcase, PawPrint, Calendar } from "lucide-react"
import "../../stylos/cssAdmin/Sidebar.css"

const Sidebar = ({ collapsed, isMobile, mobileOpen, closeMobileMenu }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <Home size={20} />,
      path: "/admin/dashboard",
    },
    {
      id: "usuarios",
      title: "Gestión de Usuarios",
      icon: <Users size={20} />,
      path: "/admin/gestion-usuarios",
    },
    {
      id: "roles",
      title: "Gestión de Roles",
      icon: <Shield size={20} />,
      path: "/admin/gestion-roles",
    },
    {
      id: "citas",
      title: "Gestión de Citas",
      icon: <Calendar size={20} />,
      path: "/admin/gestion-citas",
    },
    {
      id: "servicios",
      title: "Gestión de Servicios",
      icon: <Briefcase size={20} />,
      path: "/admin/gestion-servicios",
    },
  ]

  if (isMobile && !mobileOpen) {
    return null
  }

  return (
    <>
      {isMobile && mobileOpen && <div className="sidebar-overlay" onClick={closeMobileMenu}></div>}

      <aside className={`sidebar ${collapsed && !isMobile ? "collapsed" : ""} ${isMobile ? "mobile" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <PawPrint size={24} />
            </div>
            {(!collapsed || isMobile) && (
              <div className="logo-text">
                <h2>PET MOYBE</h2>
                <p>Panel Administrativo</p>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-menu">
            <ul>
              {menuItems.map((item) => (
                <li key={item.id} className="menu-item">
                  <Link
                    to={item.path}
                    className={`menu-link ${isActive(item.path) ? "active" : ""}`}
                    data-tooltip={collapsed && !isMobile ? item.title : ""}
                    onClick={isMobile ? closeMobileMenu : null} // Cierra el menú en móvil al hacer clic
                  >
                    <span className="menu-icon">{item.icon}</span>
                    {(!collapsed || isMobile) && <span className="menu-text">{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar