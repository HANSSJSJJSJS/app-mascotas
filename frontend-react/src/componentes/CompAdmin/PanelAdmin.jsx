"use client"

// PanelAdmin.jsx
import { Outlet } from "react-router-dom"
import BarraLateral from "./BarraAdmin"
import "../../stylos/cssAdmin/PanelAdmin.css"

function PanelAdmin() {
  return (
    <div className="panel-admin">
      <BarraLateral />

      <div className="contenido-principal">
        <div className="area-contenido">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default PanelAdmin
