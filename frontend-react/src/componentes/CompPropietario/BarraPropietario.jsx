"use client"

import { useState, useEffect } from "react"
import { Home, Calendar, User, Bone, X, LogOut, PawPrint } from 'lucide-react'
import { Link, useLocation } from "react-router-dom"
import "../../stylos/cssPropietario/BarraPropietario.css"

const BarraPropietario = ({ onAlternarMenu, estaMenuAbierto, onCerrarSesion }) => {
  const [esMobile, setEsMobile] = useState(false)
  const ubicacionActual = useLocation()

  // Definir los elementos del menú con mejor estructura
  const elementosMenu = [
    { icono: <Home size={18} />, texto: "Inicio", ruta: "/PanelPropietario" },
    { icono: <Calendar size={18} />, texto: "Agendar Cita", ruta: "/PanelPropietario/agendar-cita" },
    { icono: <User size={18} />, texto: "Actualizar Datos", ruta: "/PanelPropietario/ActualizarPropietario" },
    { icono: <Bone size={18} />, texto: "Mascota", ruta: "/PanelPropietario/Mascota" },
  ]

  useEffect(() => {
    const verificarSiEsMobile = () => {
      setEsMobile(window.innerWidth < 1024)
    }
    verificarSiEsMobile()
    window.addEventListener("resize", verificarSiEsMobile)
    return () => window.removeEventListener("resize", verificarSiEsMobile)
  }, [])


  return (
    <aside className={`barra-navegacion ${esMobile ? "mobile" : ""} ${!estaMenuAbierto ? "colapsada" : ""}`}>
      {/* Botón de cerrar para móvil */}
      {esMobile && (
        <button onClick={onAlternarMenu} className="boton-cerrar">
          <X size={20} />
        </button>
      )}

      {/* Encabezado de la barra lateral con logo */}
      <div
        className="encabezado-barra"
        onClick={!esMobile ? onAlternarMenu : undefined}
        style={{ cursor: !esMobile ? "pointer" : "default" }}
      >
        <div className="contenedor-logo">
          <PawPrint size={24} className="icono-logo" />
          {estaMenuAbierto && <span className="texto-logo">PET MOYBE</span>}
        </div>
      </div>

      {/* Contenedor con scroll para el menú */}
      <div className="contenedor-scroll-menu">
        <nav>
          <ul className="menu-navegacion">
            {elementosMenu.map((elemento, indice) => (
              <li key={indice} className={ubicacionActual.pathname === elemento.ruta ? "activo" : ""}>
                <Link to={elemento.ruta} className="enlace" onClick={() => esMobile && onAlternarMenu()}>
                  <div className="contenedor-icono">{elemento.icono}</div>
                  <span className="contenedor-texto">{elemento.texto}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default BarraPropietario