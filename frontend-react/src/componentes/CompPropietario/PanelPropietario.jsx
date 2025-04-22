"use client"

import { useState } from "react"
import "../../stylos/cssProp/PanelPropietario.css"
import { Routes, Route } from "react-router-dom"
import BarraPropietario from "../CompPropietario/BarraPropietario.jsx"
import EncabezadoPropietario from "../CompPropietario/EncabezadoPropietario.jsx"
import HisCli from "../CompAdmin/HisCli.jsx"
import FormularioCita from "../CompFormularios/FormularioCita.jsx"

const PanelPropietario = () => {
  const [menuAbierto, setMenuAbierto] = useState(true)
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("Inicio")

  const [userData] = useState({
    username: "Juan Pérez",
    role: "Propietario",
    email: "juan@example.com",
  })

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  const handleMenuSelect = (opcion) => {
    setOpcionSeleccionada(opcion)
  }

  return (
    <div className="app-container">
      <BarraPropietario onMenuSelect={handleMenuSelect} onToggleMenu={toggleMenu} menuAbierto={menuAbierto} />

      <div className="content-wrapper">
        <EncabezadoPropietario onToggleMenu={toggleMenu} userData={userData} />

        <div className="content-area">
          <Routes>
            <Route
              path="/"
              element={
                <div className="page-content">
                  <h2>{opcionSeleccionada}</h2>
                  <p>Contenido de {opcionSeleccionada} se mostrará aquí</p>
                </div>
              }
            />
            <Route path="/agendar-cita" element={<FormularioCita />} />
            <Route path="/historia-clinica" element={<HisCli />} />
            <Route
              path="/actualizar-datos"
              element={
                <div className="page-content">
                  <h2>Actualizar Datos</h2>
                  <p>Formulario para actualizar datos se mostrará aquí</p>
                </div>
              }
            />
            <Route
              path="/mascota"
              element={
                <div className="page-content">
                  <h2>Mascota</h2>
                  <p>Información de mascota se mostrará aquí</p>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default PanelPropietario;
