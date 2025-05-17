"use client"
import { Menu } from "lucide-react"
import "../../stylos/cssAdmin/Encabezado.css"

const EncabezadoAdmin = () => {
  return (
    <header className="encabezado">
      <div className="boton-menu">
        <Menu size={20} />
        <span>MENU</span>
      </div>

      <div className="info-usuario">
        <span>Admin</span>
        <small>Administrador</small>
      </div>
    </header>
  )
}

export default EncabezadoAdmin
