import React, { useState } from "react";
import { Menu, X, User, LogOut, ChevronDown, ChevronUp, Mail } from "lucide-react";
import "../../stylos/cssAdmin/Topbar.css"; // Se mantiene tu archivo de estilos
import { useAuth } from "../../context/AuthContext"; // Se importa el hook para obtener los datos del usuario
import { useNavigate } from "react-router-dom"; // Se importa para la redirección
import Swal from "sweetalert2"; // Se importa para las alertas bonitas

const Topbar = ({
  toggleSidebar,
  sidebarCollapsed,
  isMobile,
  mobileMenuOpen,
}) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { usuario, logout } = useAuth(); // Obtenemos el usuario y la función logout del contexto
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: "¿Estás seguro de que quieres salir?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#495a90',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Llama a la función logout de tu AuthContext
        navigate('/login', { replace: true }); 
      }
    });
  };
  
  // Si el usuario aún no ha cargado, se puede mostrar un estado intermedio
  if (!usuario) {
    return (
      <header className={`topbar ${!isMobile && sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="topbar-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
        </div>
        <div className="topbar-right">
            <p>Cargando...</p>
        </div>
      </header>
    )
  }
  

  return (
    // El header aplica la clase 'collapsed' a sí mismo para moverse
    <header className={`topbar ${!isMobile && sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="topbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          {isMobile && mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="topbar-right">
        <div className={`user-profile-menu ${isDropdownOpen ? 'open' : ''}`}>
          <button className="user-profile-trigger" onClick={toggleDropdown}>
            <div className="avatar">
              {/* Conectado a los datos reales del usuario */}
              <span>{usuario.nombre ? usuario.nombre[0].toUpperCase() : 'A'}</span>
            </div>
            <div className="user-info">
              {/* Conectado a los datos reales del usuario */}
              <h4>Administrador</h4>
              <p>{usuario.nombre}</p>
            </div>
            {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {isDropdownOpen && (
            <div className="user-dropdown-menu">
              <div className="dropdown-header">
                <div className="avatar large">
                  {/* Conectado a los datos reales del usuario */}
                  <span>{usuario.nombre ? usuario.nombre[0].toUpperCase() : 'A'}</span>
                </div>
                <div className="user-info">
                  {/* Conectado a los datos reales del usuario */}
                  <h4>{usuario.nombre}</h4>
                  <p>Administrador</p>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              {/* Conectado a los datos reales del usuario */}
              <a href={`mailto:${usuario.email}`} className="dropdown-item">
                <Mail size={16} />
                <span>{usuario.email}</span>
              </a>
              {/* BOTÓN DE LOGOUT CON FUNCIONALIDAD */}
              <button className="dropdown-item logout" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;