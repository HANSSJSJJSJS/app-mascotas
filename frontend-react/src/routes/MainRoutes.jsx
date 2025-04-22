// MainRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RutaProtegida from "./RutaProtegida";

// Componentes públicos
import Home from "../componentes/index/Home";
import Servicios from "../componentes/CompHome/Servicios";
import Adopcion from "../componentes/CompHome/Adopcion";
import SobreNosotros from "../componentes/CompHome/SobreNosotros";
import Login from "../componentes/CompFormularios/Login";
import Propietario from "../componentes/CompFormularios/Propietario";
import OlvideContrasena from "../componentes/CompFormularios/OlvideContrasena";
import NotFound from "../componentes/CompHome/NotFound";

// Componentes admin
import PanelPri from "../componentes/CompAdmin/PanelPri";
import ModuloCitas from "../componentes/CompAdmin/ModuloCitas";
import ModuloHorarios from "../componentes/CompAdmin/ModuloHorarios";
import ModuloEspecialidades from "../componentes/CompAdmin/ModuloEspecialidades";
import ModuloEspecialistas from "../componentes/CompAdmin/ModuloEspecialistas";
import TablaUsuarios from "../componentes/CompAdmin/TablaUsuarios";

// Componentes prop
import PanelPropietario from "../componentes/CompPropietario/PanelPropietario.jsx";

const MainRoutes = () => {
  // Modo desarrollo - permite acceso sin autenticación
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <Routes>
      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/Home" replace />} />
      
      {/* Rutas públicas */}
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Servicios" element={<Servicios />} />
      <Route path="/Adopcion" element={<Adopcion />} />
      <Route path="/SobreNosotros" element={<SobreNosotros />} />
      <Route path="/Propietario" element={<Propietario />} />
      <Route path="/OlvideContrasena" element={<OlvideContrasena />} />

      {/* Rutas admin - temporalmente accesibles en desarrollo */}
      {isDevelopment ? (
        <>
          <Route path="/PanelPri" element={<PanelPri />} />
          <Route path="/ModuloCitas" element={<ModuloCitas />} />
          <Route path="/ModuloHorarios" element={<ModuloHorarios />} />
          <Route path="/ModuloEspecialidades" element={<ModuloEspecialidades />} />
          <Route path="/ModuloEspecialistas" element={<ModuloEspecialistas />} />
          <Route path="/TablaUsuarios" element={<TablaUsuarios />} />
          <Route path="/PanelPropietario/*" element={<PanelPropietario />} />
        </>
      ) : (
        <>
          <Route
            path="/PanelPri"
            element={
              <RutaProtegida rolPermitido="admin">
                <PanelPri />
              </RutaProtegida>
            }
          />
          {/* Resto de rutas protegidas en producción... */}
        </>
      )}

      {/* Página 404 - Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;