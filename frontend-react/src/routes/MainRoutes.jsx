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
import NotFound from "../componentes/CompHome/NotFound"; // Asegúrate que esta ruta sea correcta

// Componentes admin
import PanelPri from "../componentes/CompAdmin/PanelPri";
import ModuloCitas from "../componentes/CompAdmin/ModuloCitas";
import ModuloHorarios from "../componentes/CompAdmin/ModuloHorarios";
import ModuloEspecialidades from "../componentes/CompAdmin/ModuloEspecialidades";
import ModuloEspecialistas from "../componentes/CompAdmin/ModuloEspecialistas";
import TablaUsuarios from "../componentes/CompAdmin/TablaUsuarios";

const MainRoutes = () => {
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

      {/* Rutas admin protegidas */}
      <Route
        path="/PanelPri"
        element={
          <RutaProtegida rolPermitido="admin">
            <PanelPri />
          </RutaProtegida>
        }
      />
      <Route
        path="/ModuloCitas"
        element={
          <RutaProtegida rolPermitido="admin">
            <ModuloCitas />
          </RutaProtegida>
        }
      />
      <Route
        path="/ModuloHorarios"
        element={
          <RutaProtegida rolPermitido="admin">
            <ModuloHorarios />
          </RutaProtegida>
        }
      />
      <Route
        path="/ModuloEspecialidades"
        element={
          <RutaProtegida >
            <ModuloEspecialidades />
          </RutaProtegida>
        }
      />
      <Route
        path="/ModuloEspecialistas"
        element={
          <RutaProtegida rolPermitido="admin">
            <ModuloEspecialistas />
          </RutaProtegida>
        }
      />
      <Route
        path="/TablaUsuarios"
        element={
          <RutaProtegida rolPermitido="admin">
            <TablaUsuarios />
          </RutaProtegida>
        }
      />

      {/* Página 404 - Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;