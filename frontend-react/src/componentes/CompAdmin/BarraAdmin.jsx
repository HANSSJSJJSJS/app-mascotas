import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../../stylos/cssAdmin/BarraLateral.css";

// Importar iconos directamente
import { Home, Calendar, Users, Bone, Clock, History, LogOut, PawPrint } from "lucide-react";

const BarraLateral = ({ onToggleMenu, menuAbierto, isMobile }) => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  // Definir los elementos del menú
  const menuItems = [
    { icon: <Home size={18} />, text: "Inicio", path: "/PanelAdmin/TarjetaEstadistica" },
    { icon: <Calendar size={18} />, text: "Citas", path: "/PanelAdmin/TablaCitas" },
    {
      icon: <Users size={18} />, 
      text: "Usuarios",  
      dropdown: true,
      dropdownItems: [
        { text: "Clientes", path: "/PanelAdmin/clientes" },
        { text: "Veterinarios", path: "/PanelAdmin/veterinarios" },
        { text: "Administradores", path: "/PanelAdmin/TablaUsuarios" }]
    },
    { icon: <Bone size={18} />, text: "Mascotas", path: "/PanelAdmin/mascotas" },
    { icon: <Clock size={18} />, text: "Horarios", path: "/PanelAdmin/horarios" },
    { icon: <History size={18} />, text: "Historial Clínico", path: "/PanelAdmin/historial-clinico" },
  ];

  return (
    <aside className={`barra-lateral ${!menuAbierto ? "colapsado" : ""}`}>
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

      <div className="menu-scroll-container">
        <nav>
          <ul className="menu-lateral">
            {menuItems.map((item, index) => (
              <li 
                key={index} 
                className={`${location.pathname === item.path ? "active" : ""} ${item.dropdown ? "has-dropdown" : ""}`}
              >
                {item.dropdown ? (
                  <div 
                    className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to={item.path} className="link dropdown-toggle">
                      <div className="icon-container">{item.icon}</div>
                      <span className="text-container">{item.text}</span>
                    </Link>
                    <ul className={`dropdown-content ${dropdownOpen ? "show" : ""}`}>
                      {item.dropdownItems.map((dropdownItem, i) => (
                        <li key={i}>
                          <Link to={dropdownItem.path}>
                            <span>{dropdownItem.text}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link to={item.path} className="link">
                    <div className="icon-container">{item.icon}</div>
                    {menuAbierto && <span className="text-container">{item.text}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default BarraLateral;

