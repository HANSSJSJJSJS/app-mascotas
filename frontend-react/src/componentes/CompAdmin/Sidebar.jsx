import { Link, useLocation } from "react-router-dom";
import { Home, Users, Shield, Briefcase, PawPrint, Calendar } from "lucide-react";
import "../../stylos/cssAdmin/Sidebar.css";
import { encodePath } from "../../funcionalidades/routeUtils"; // Asegúrate de importar esto

const Sidebar = ({ collapsed, isMobile, mobileOpen, closeMobileMenu }) => {
  const location = useLocation();

  // 1. DEFINE LAS RUTAS SIN CODIFICAR
  //    'path' es ahora la clave que se va a encriptar.
  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: <Home size={20} />, path: "dashboard" },
    { id: "usuarios", title: "Gestión de Usuarios", icon: <Users size={20} />, path: "gestion-usuarios" },
    { id: "roles", title: "Gestión de Roles", icon: <Shield size={20} />, path: "gestion-roles" },
    { id: "citas", title: "Gestión de Citas", icon: <Calendar size={20} />, path: "gestion-citas" },
    { id: "servicios", title: "Gestión de Servicios", icon: <Briefcase size={20} />, path: "gestion-servicios" },
  ];

  // 2. FUNCIÓN 'isActive' ACTUALIZADA
  //    Comprueba si la ruta encriptada está en la URL actual.
  const isActive = (path) => {
    if (!path) return false;
    const encoded = encodePath(path);
    return location.pathname.includes(encoded);
  };

  if (isMobile && !mobileOpen) {
    return null;
  }

  return (
    <>
      {isMobile && mobileOpen && <div className="sidebar-overlay" onClick={closeMobileMenu}></div>}
      <aside className={`sidebar ${collapsed && !isMobile ? "collapsed" : ""} ${isMobile ? "mobile" : ""}`}>
        <div className="sidebar-header">
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-menu">
            <ul>
              {menuItems.map((item) => (
                <li key={item.id} className="menu-item">
                  <Link
                    to={`/admin/${encodePath(item.path)}`}
                    className={`menu-link ${isActive(item.path) ? "active" : ""}`}
                    data-tooltip={collapsed && !isMobile ? item.title : ""}
                    onClick={isMobile ? closeMobileMenu : null}
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
  );
};

export default Sidebar;