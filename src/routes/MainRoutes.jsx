import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../componentes/index/Home";
import Servicios from "../componentes/CompHome/Servicios"
import Adopcion from "../componentes/CompHome/Adopcion";
import SobreNosotros from "../componentes/CompHome/SobreNosotros";
import Login from "../componentes/CompFormularios/Login";
import Propietario from "../componentes/CompFormularios/Propietario"
import OlvideContrasena from "../componentes/CompFormularios/OlvideContrasena";
import NotFound from "../componentes/CompHome/NotFound"; // Página para errores 404

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/adopcion" element={<Adopcion />} />
      <Route path="/SobreNosotros" element={<SobreNosotros />} />
      <Route path="/Propietario" element={<Propietario />} />
      <Route path="/OlvideContrasena" element={<OlvideContrasena />} />
      
      
      

      {/* Página de error 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
