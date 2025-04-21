import { Link } from "react-router-dom"
import "../../stylos/cssIndex/Header.css"

const Header = () => {
  return (
    <header className="header-wrapper">
      <div className="top-container">
        <div className="top-content">
        </div>
      </div>

      <nav className="navbarra">
        <div className="navtext">
          <div className="left-nav">
            <Link to="/Home" className="nav-item nav-link">
              Inicio
            </Link>
            <Link to="/Servicios" className="nav-item nav-link">
              Servicios
            </Link>
            <Link to="/Adopcion" className="nav-item nav-link">
              Adopción
            </Link>
          </div>

          <div className="center-nav">
            <Link to="/Home" className="nav-item nav-link">
              <h1 className="icono">
                <span className="text-ico">#</span>MOYBE
              </h1>
            </Link>
          </div>

          <div className="right-nav">
            <Link to="/SobreNosotros" className="nav-item nav-link">
              Sobre Nosotros
            </Link>
            <Link to="/Login" aria-label="Iniciar sesión " className="nav-item nav-link">
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
              <span>Iniciar sesión</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header

