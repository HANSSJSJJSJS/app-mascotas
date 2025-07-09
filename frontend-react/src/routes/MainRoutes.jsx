import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import RutaProtegida from "./RutaProtegida";
import LayoutPublico from "../componentes/layouts/LayoutPublico";
import LayoutPropietario from "../componentes/layouts/LayoutPropietario";
import Loading from "../componentes/index/Loading";

// Componentes públicos
const Home = React.lazy(() => import("../componentes/index/Home"));
const Servicios = React.lazy(() => import("../componentes/CompHome/Servicios"));
const Adopcion = React.lazy(() => import("../componentes/CompHome/Adopcion"));
const SobreNosotros = React.lazy(() => import("../componentes/CompHome/SobreNosotros"));
const Login = React.lazy(() => import("../componentes/CompFormularios/Login"));
const Propietario = React.lazy(() => import("../componentes/CompFormularios/Propietario"));
const OlvideContrasena = React.lazy(() => import("../componentes/CompFormularios/OlvideContrasena"));
const CambioContraseña = React.lazy(() => import("../componentes/CompFormularios/CambioContraseña"));
const NotFound = React.lazy(() => import("../componentes/CompHome/NotFound"));

// NUEVO DASHBOARD DE ADMINISTRADOR
const AdminDashboard = React.lazy(() => import("../componentes/CompAdmin/AdminDashboard"));

// Componentes propietario
const PanelPropietario = React.lazy(() => import("../componentes/CompPropietario/PanelPropietario"));

// Componentes veterinario
// El panel es el único componente que necesitamos importar directamente aquí ahora.
const PanelVet = React.lazy(() => import("../componentes/CompVet/PanelVet"));

const MainRoutes = () => {
  
  const isDevelopment = process.env.NODE_ENV === 'development';

  const RutasPublicas = () => (
    <React.Suspense fallback={<Loading />}>
      <LayoutPublico>
        <Outlet />
      </LayoutPublico>
    </React.Suspense>
  );

  const RutasPropietario = () => (
    <React.Suspense fallback={<Loading />}>
      <LayoutPropietario>
        <Outlet />
      </LayoutPropietario>
    </React.Suspense>
  );

  // NOTA: El LayoutVet ahora será llamado dentro del propio PanelVet para que pueda
  // envolver al componente hijo correcto. Por lo tanto, RutasVet ya no es necesario.

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Home" replace />} />

      {/* Rutas públicas (Sin cambios) */}
      <Route element={<RutasPublicas />}>
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Servicios" element={<Servicios />} />
        <Route path="/Adopcion" element={<Adopcion />} />
        <Route path="/SobreNosotros" element={<SobreNosotros />} />
        <Route path="/Propietario" element={<Propietario />} />A
        <Route path="/OlvideContrasena" element={<OlvideContrasena />} />
        <Route path="/CambioContraseña" element={<CambioContraseña />} />
      </Route>
      
      {/* RUTAS ADMINISTRADOR*/}
       <Route element={<RutaProtegida roles={[1]} />}> {/* Rol 1 para Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:encodedPath" element={<AdminDashboard />} />
      </Route>

      {/* RUTAS Propietario*/}
      <Route element={isDevelopment ? <RutasPropietario /> : <RutaProtegida rolPermitido="propietario"><RutasPropietario /></RutaProtegida>}>
          <Route path="/PanelPropietario" element={<PanelPropietario />} />
          <Route path="/PanelPropietario/:encodedPath" element={<PanelPropietario />} />
      </Route>

      {/* La protección de ruta se puede aplicar directamente aquí.
        Envolverá al componente PanelVet, que a su vez contiene la lógica de sub-rutas.
        Esto asegura que nadie pueda acceder a /PanelVet/* sin el rol correcto.
      */}
      <Route element={<RutaProtegida roles={[1, 2]} />}> {/* Ejemplo: Rol 1 (Admin) y 2 (Vet) pueden acceder */}
        <Route path="/PanelVet" element={<PanelVet />} />
        <Route path="/PanelVet/:encodedPath" element={<PanelVet />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;