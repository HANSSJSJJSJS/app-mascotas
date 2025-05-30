// PanelPropietario.jsx
import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import "../../stylos/cssPropietario/PanelPropietario.css"
import BarraPropietario from "./BarraPropietario"
import EncabezadoPropietario from "./EncabezadoPropietario"
import { useLocation } from 'react-router-dom';

const PanelPropietario = () => {
  const [menuAbierto, setMenuAbierto] = useState(true)
  const [isMobile, setIsMobile] = useState(false) 

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setMenuAbierto(false)
      } else {
        setMenuAbierto(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  return (
    <div className="app-container">
      <BarraPropietario onToggleMenu={toggleMenu} menuAbierto={menuAbierto} />
      <EncabezadoPropietario onToggleMenu={toggleMenu} userData={userData} isSidebarOpen={menuAbierto} />
      <div
        className="content-wrapper"
        style={{
          marginLeft: menuAbierto ? "-20vh" : "70px",
          width: menuAbierto ? "calc(100% - 250px)" : "calc(100% - 70px)",
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
