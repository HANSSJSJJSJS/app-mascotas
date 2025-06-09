import { Outlet } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import "../../stylos/cssPropietario/PanelPropietario.css"
import BarraPropietario from "./BarraPropietario"
import EncabezadoPropietario from "./EncabezadoPropietario"
import { useNavigate } from 'react-router-dom'

const PanelPropietario = () => {
  const [estaMenuAbierto, setEstaMenuAbierto] = useState(true)
  const [esMobile, setEsMobile] = useState(false) 
  const navigate = useNavigate()

  const userData = JSON.parse(localStorage.getItem("userData")) || {}

  useEffect(() => {
    const verificarSiEsMobile = () => {
      const mobile = window.innerWidth < 1024
      setEsMobile(mobile)
      if (mobile) {
        setEstaMenuAbierto(false)
      } else {
        setEstaMenuAbierto(true)
      }
    }

    verificarSiEsMobile()
    window.addEventListener("resize", verificarSiEsMobile)
    return () => window.removeEventListener("resize", verificarSiEsMobile)
  }, [])

  const onAlternarMenu = useCallback(() => {
    console.log('Alternando menú:', !estaMenuAbierto) // Para debug
    setEstaMenuAbierto(prev => !prev)
  }, [estaMenuAbierto])

  const onCerrarSesion = useCallback(() => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      // Limpiar datos del localStorage
      localStorage.removeItem("userData")
      localStorage.removeItem("token")
      
      // Redirigir al login
      navigate("/login")
    }
  }, [navigate])

  return (
    <div className="app-container">
      <BarraPropietario 
        onAlternarMenu={onAlternarMenu} 
        estaMenuAbierto={estaMenuAbierto}
        onCerrarSesion={onCerrarSesion}
      />
      
      <EncabezadoPropietario 
        onToggleMenu={onAlternarMenu} 
        userData={userData} 
        estaMenuAbierto={estaMenuAbierto}
        onCerrarSesion={onCerrarSesion}
      />
      
      <div
        className="content-wrapper"
        style={{
          marginLeft: esMobile ? "0" : (estaMenuAbierto ? "250px" : "70px"),
          width: esMobile ? "100%" : (estaMenuAbierto ? "calc(100% - 250px)" : "calc(100% - 70px)"),
          transition: "margin-left 0.3s ease, width 0.3s ease",
        }}
      >
        <div
          className="content-area"
          style={{
            marginTop: "70px",
            padding: "20px",
            width: "100%",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default PanelPropietario