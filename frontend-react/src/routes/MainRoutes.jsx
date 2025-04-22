// MainRoutes.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import RutaProtegida from "./RutaProtegida";
import LayoutPublico from "../componentes/layouts/LayoutPublico";
import LayoutAdmin from "../componentes/layouts/LayoutAdmin";
import LayoutPropietario from "../componentes/layouts/LayoutPropietario";

// Componentes públicos
const Home = React.lazy(() => import("../componentes/index/Home"));
const Servicios = React.lazy(() => import("../componentes/CompHome/Servicios"));
const Adopcion = React.lazy(() => import("../componentes/CompHome/Adopcion"));
const SobreNosotros = React.lazy(() => import("../componentes/CompHome/SobreNosotros"));
const Login = React.lazy(() => import("../componentes/CompFormularios/Login"));
const Propietario = React.lazy(() => import("../componentes/CompFormularios/Propietario"));
const OlvideContrasena = React.lazy(() => import("../componentes/CompFormularios/OlvideContrasena"));
const NotFound = React.lazy(() => import("../componentes/CompHome/NotFound"));

// Componentes admin
const PanelPri = React.lazy(() => import("../componentes/CompAdmin/PanelPri"));
const ModuloCitas = React.lazy(() => import("../componentes/CompAdmin/ModuloCitas"));
const ModuloHorarios = React.lazy(() => import("../componentes/CompAdmin/ModuloHorarios"));
const ModuloEspecialidades = React.lazy(() => import("../componentes/CompAdmin/ModuloEspecialidades"));
const ModuloEspecialistas = React.lazy(() => import("../componentes/CompAdmin/ModuloEspecialistas"));
const TablaUsuarios = React.lazy(() => import("../componentes/CompAdmin/TablaUsuarios"));

// Componentes propietario
const PanelPropietario = React.lazy(() => import("../componentes/CompPropietario/PanelPropietario"));
const InicioPropietario = React.lazy(() => import("../componentes/CompPropietario/InicioPropietario"));
const FormularioCita = React.lazy(() => import("../componentes/CompFormularios/FormularioCita"));
const HisCli = React.lazy(() => import("../componentes/CompAdmin/HisCli"));
const ActualizarDatos = React.lazy(() => import("../componentes/CompPropietario/ActualizarDatos"));
const Mascota = React.lazy(() => import("../componentes/CompPropietario/Mascota"));

const Loading = () => <div className="loading-spinner">Cargando...</div>;

const MainRoutes = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const RutasPublicas = () => (
    <React.Suspense fallback={<Loading />}>
      <LayoutPublico>
        <Outlet />
      </LayoutPublico>
    </React.Suspense>
  );

  const RutasAdmin = () => (
    <React.Suspense fallback={<Loading />}>
      <LayoutAdmin>
        <Outlet />
      </LayoutAdmin>
    </React.Suspense>
  );

  const RutasPropietario = () => (
    <React.Suspense fallback={<Loading />}>
      <LayoutPropietario>
        <Outlet />
      </LayoutPropietario>
    </React.Suspense>
  );

  return (
    <Routes>
      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/Home" replace />} />
      
      {/* Rutas públicas */}
      <Route element={<RutasPublicas />}>
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Servicios" element={<Servicios />} />
        <Route path="/Adopcion" element={<Adopcion />} />
        <Route path="/SobreNosotros" element={<SobreNosotros />} />
        <Route path="/Propietario" element={<Propietario />} />
        <Route path="/OlvideContrasena" element={<OlvideContrasena />} />
      </Route>

      {/* Rutas admin */}
      <Route element={isDevelopment ? <RutasAdmin /> : 
        <RutaProtegida rolPermitido="admin"><RutasAdmin /></RutaProtegida>}>
        <Route path="/PanelPri" element={<PanelPri />} />
        <Route path="/ModuloCitas" element={<ModuloCitas />} />
        <Route path="/ModuloHorarios" element={<ModuloHorarios />} />
        <Route path="/ModuloEspecialidades" element={<ModuloEspecialidades />} />
        <Route path="/ModuloEspecialistas" element={<ModuloEspecialistas />} />
        <Route path="/TablaUsuarios" element={<TablaUsuarios />} />
      </Route>

      {/* Rutas propietario */}
      <Route element={isDevelopment ? <RutasPropietario /> : 
        <RutaProtegida rolPermitido="propietario"><RutasPropietario /></RutaProtegida>}>
        <Route path="/PanelPropietario" element={<PanelPropietario />}>
          <Route index element={<InicioPropietario />} />
          <Route path="agendar-cita" element={<FormularioCita />} />
          <Route path="historia-clinica" element={<HisCli />} />
          <Route path="actualizar-datos" element={<ActualizarDatos />} />
          <Route path="mascota" element={<Mascota />} />
        </Route>
      </Route>

      {/* Página 404 - Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;