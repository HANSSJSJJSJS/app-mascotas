import { Outlet, useNavigate } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import "../../stylos/cssPropietario/PanelPropietario.css"
import BarraPropietario from "./BarraPropietario"
import EncabezadoPropietario from "./EncabezadoPropietario"

const PanelPropietario = () => {
  const [estaMenuAbierto, setEstaMenuAbierto] = useState(true)
  const [esMobile, setEsMobile] = useState(false) 
  const navigate = useNavigate()

  const userData = JSON.parse(localStorage.getItem("pet-app-user")) || {}

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
    // Cerrar sesión directamente, sin confirmación
    localStorage.removeItem("userData")
    localStorage.removeItem("token")
    navigate("/login")
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
      {/* Botón flotante para ir al chat de IA */}
      <button
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 2000,
          background: "linear-gradient(135deg, #8196eb, #495a90)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 64,
          height: 64,
          boxShadow: "0 4px 16px rgba(129,150,235,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s"
        }}
        title="Ir al chat IA"
        onClick={() => navigate("/PanelPropietario/ia")}
      >
        🤖
      </button>
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