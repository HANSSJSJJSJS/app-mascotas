import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../componentes/index/Home";
import Servicios from "../componentes/paginas/Servicios"
import Adopcion from "../componentes/paginas/Adopcion";
import SobreNosotros from "../componentes/paginas/SobreNosotros";
import Login from "../componentes/formulario/Login";
import Propietario from "../componentes/formulario/Propietario"
import OlvideContrasena from "../componentes/formulario/OlvideContrasena";
import NotFound from "../componentes/paginas/NotFound"; // Página para errores 404

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
