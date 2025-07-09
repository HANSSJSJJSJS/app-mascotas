"use client"

import { NavLink } from "react-router-dom"
import { useState } from "react"
import "../../stylos/cssIndex/Header.css"

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  // Funciones para descargar manuales
  const downloadTechnicalManual = () => {
    const link = document.createElement("a")
    link.href = "/manuales/manual-tecnico.pdf"
    link.download = "Manual_Tecnico.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadUserManual = () => {
    const link = document.createElement("a")
    link.href = "/manuales/manual-usuario.pdf"
    link.download = "Manual_Usuario.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <header className="header-wrapper">
      <div className="top-container">
        {/* Icono de ayuda desplegable */}
        <div style={{ position: "relative", marginRight: "1rem" }}>
          <button
            className="help-icon-btn"
            onClick={() => setHelpOpen((prev) => !prev)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0
            }}
            aria-label="Ayuda"
          >
            {/* Icono de ayuda */}
            <svg width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm-.25-3.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0zm1.07-2.1c-.2.2-.32.37-.32.6v.25a.75.75 0 0 1-1.5 0v-.25c0-.7.37-1.2.77-1.6.37-.37.73-.73.73-1.15 0-.5-.4-.85-.97-.85-.5 0-.83.23-.97.7a.75.75 0 1 1-1.45-.5C5.5 4.23 6.4 3.5 8 3.5c1.47 0 2.47.97 2.47 2.15 0 .9-.57 1.5-1.15 2.1z"/>
            </svg>
          </button>
          {helpOpen && (
            <div
              style={{
                position: "absolute",
                top: "2.5rem",
                right: 0,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 1000,
                minWidth: "220px"
              }}
              onMouseLeave={() => setHelpOpen(false)}
            >
              <button
                style={{ width: "100%", padding: "20px", border: "none", background: "none", textAlign: "center", cursor: "pointer" }}
                onClick={downloadUserManual}
              >
                📄 Descargar Manual de Usuario
              </button>
              <button
                style={{ width: "100%", padding: "10px", border: "none", background: "none", textAlign: "center", cursor: "pointer" }}
                onClick={downloadTechnicalManual}
              >
                🛠️ Descargar Manual Técnico
              </button>
            </div>
          )}
        </div>

        <div className="top-content">{/* Puedes agregar contenido adicional aquí (ej: banner promocional) */}</div>
      </div>

      <nav className="navbarra">
        <div className="navtext">
          <div className="left-nav desktop-nav">
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
