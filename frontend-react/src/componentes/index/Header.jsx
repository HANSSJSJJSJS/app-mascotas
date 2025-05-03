"use client"

import { NavLink } from "react-router-dom"
import { useState } from "react"
import "../../stylos/cssIndex/Header.css"

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <header className="header-wrapper">
      <div className="top-container">
        <div className="top-content">{/* Puedes agregar contenido adicional aquí (ej: banner promocional) */}</div>
      </div>

      <nav className="navbarra">
        <div className="navtext">
          <div className="left-nav desktop-nav">
            <NavLink to="/Home" className={({ isActive }) => `nav-item nav-link ${isActive ? "active" : ""}`}>
              Inicio
            </NavLink>
            <NavLink to="/Servicios" className={({ isActive }) => `nav-item nav-link ${isActive ? "active" : ""}`}>
              Servicios
            </NavLink>
            <NavLink to="/Adopcion" className={({ isActive }) => `nav-item nav-link ${isActive ? "active" : ""}`}>
              Adopción
            </NavLink>
          </div>

          <div className="center-nav">
            <NavLink to="/Home" className="nav-item nav-link logo-link">
              <h1 className="icono">
                <span className="text-ico">#</span>MOYBE
              </h1>
            </NavLink>
          </div>

          <div className="right-nav desktop-nav">
            <NavLink to="/SobreNosotros" className={({ isActive }) => `nav-item nav-link ${isActive ? "active" : ""}`}>
              Sobre Nosotros
            </NavLink>
            <NavLink
              to="/Login"
              aria-label="Iniciar sesión"
              className={({ isActive }) => `nav-item nav-link login-link ${isActive ? "active" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-person-heart"
                viewBox="0 0 16 16"
              >
                <path d="M9 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h10s1 0 1-1-1-4-6-4-6 3-6 4m13.5-8.09c1.387-1.425 4.855 1.07 0 4.277-4.854-3.207-1.387-5.702 0-4.276Z" />
              </svg>
              <span className="login-text">Iniciar sesión</span>
            </NavLink>
          </div>

          <div className="mobile-menu-toggle" onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={menuOpen ? "hidden" : ""}
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={menuOpen ? "" : "hidden"}
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      <div className={`mobile-dropdown-menu ${menuOpen ? "open" : ""}`}>
        <NavLink
          to="/Home"
          className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
          onClick={closeMenu}
        >
          Inicio
        </NavLink>
        <NavLink
          to="/Servicios"
          className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
          onClick={closeMenu}
        >
          Servicios
        </NavLink>
        <NavLink
          to="/Adopcion"
          className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
          onClick={closeMenu}
        >
          Adopción
        </NavLink>
        <NavLink
          to="/SobreNosotros"
          className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
          onClick={closeMenu}
        >
          Sobre Nosotros
        </NavLink>
        <NavLink
          to="/Login"
          className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
          onClick={closeMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-person-heart"
            viewBox="0 0 16 16"
          >
            <path d="M9 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h10s1 0 1-1-1-4-6-4-6 3-6 4m13.5-8.09c1.387-1.425 4.855 1.07 0 4.277-4.854-3.207-1.387-5.702 0-4.276Z" />
          </svg>
          Iniciar sesión
        </NavLink>
      </div>
    </header>
  )
}

export default Header
