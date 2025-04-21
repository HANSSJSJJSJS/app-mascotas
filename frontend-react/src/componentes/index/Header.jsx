import { NavLink } from "react-router-dom";
import "../../stylos/cssIndex/Header.css";

const Header = () => {
  return (
    <header className="header-wrapper">
      <div className="top-container">
        <div className="top-content">
          {/* Puedes agregar contenido adicional aquí (ej: banner promocional) */}
        </div>
      </div>

      <nav className="navbarra">
        <div className="navtext">
          <div className="left-nav">
            <NavLink 
              to="/Home" 
              className={({ isActive }) => 
                `nav-item nav-link ${isActive ? 'active' : ''}`
              }
            >
              Inicio
            </NavLink>
            <NavLink 
              to="/Servicios" 
              className={({ isActive }) => 
                `nav-item nav-link ${isActive ? 'active' : ''}`
              }
            >
              Servicios
            </NavLink>
            <NavLink 
              to="/Adopcion" 
              className={({ isActive }) => 
                `nav-item nav-link ${isActive ? 'active' : ''}`
              }
            >
              Adopción
            </NavLink>
          </div>

          <div className="center-nav">
            <NavLink 
              to="/Home" 
              className="nav-item nav-link logo-link"
            >
              <h1 className="icono">
                <span className="text-ico">#</span>MOYBE
              </h1>
            </NavLink>
          </div>

          <div className="right-nav">
            <NavLink 
              to="/SobreNosotros" 
              className={({ isActive }) => 
                `nav-item nav-link ${isActive ? 'active' : ''}`
              }
            >
              Sobre Nosotros
            </NavLink>
            <NavLink 
              to="/Login" 
              aria-label="Iniciar sesión" 
              className={({ isActive }) => 
                `nav-item nav-link login-link ${isActive ? 'active' : ''}`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="30"
                fill="currentColor"
                className="bi bi-person-heart"
                viewBox="0 0 16 16"
              >
                <path d="M9 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h10s1 0 1-1-1-4-6-4-6 3-6 4m13.5-8.09c1.387-1.425 4.855 1.07 0 4.277-4.854-3.207-1.387-5.702 0-4.276Z" />
              </svg>
              <span className="login-text">Iniciar sesión</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
