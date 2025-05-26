"use client"

import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import "../../stylos/cssAdmin/PanelAdmin.css"
import BarraLateral from "./BarraAdmin"
import EncabezadoAdmin from "./EncabezadoAdmin"

const PanelAdmin = () => {
  const [menuAbierto, setMenuAbierto] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const [userData] = useState({
    username: "Admin",
    role: "Administrador",
    email: "admin@example.com",
  })

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
    <div className="admin-panel">
      <div className="app-container">
        <BarraLateral onToggleMenu={toggleMenu} menuAbierto={menuAbierto} />
        <EncabezadoAdmin userData={userData} isSidebarOpen={menuAbierto} />
        <div
          className="content-wrapper"
          style={{
            marginLeft: menuAbierto ? "180px" : "60px",
            width: menuAbierto ? "calc(100% - 180px)" : "calc(100% - 60px)",
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
    </div>
  )
}

export default PanelAdmin
