import React from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
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
const DashboardHome = React.lazy(() => import("../componentes/CompAdmin/DashboardHome"));
const GestionUsuarios = React.lazy(() => import("../componentes/CompAdmin/GestionUsuarios"));
const GestionRoles = React.lazy(() => import("../componentes/CompAdmin/GestionRoles"));
const GestionServicios = React.lazy(() => import("../componentes/CompAdmin/GestionServicios"));
const GestionCitas = React.lazy(() => import("../componentes/CompAdmin/GestionCitas"));
const HisCli = React.lazy(() => import("../componentes/CompAdmin/HisCli"));

// Componentes propietario
const PanelPropietario = React.lazy(() => import("../componentes/CompPropietario/PanelPropietario"));
const InicioPropietario = React.lazy(() => import("../componentes/CompPropietario/InicioPropietario"));
const FormularioCita = React.lazy(() => import("../componentes/CompFormularios/FormularioCita"));
const ActualizarPropietario = React.lazy(() => import("../componentes/CompPropietario/ActualizarPropietario"));
const Mascota = React.lazy(() => import("../componentes/CompPropietario/Mascota"));
const FormularioMascota = React.lazy(() => import("../componentes/CompFormularios/MascotaForm"));
const Ia = React.lazy(() => import("../componentes/CompPropietario/ia_pro"));

// Componentes veterinario
// El panel es el único componente que necesitamos importar directamente aquí ahora.
const PanelVet = React.lazy(() => import("../componentes/CompVet/PanelVet"))
const InicioVet = React.lazy(() => import("../componentes/CompVet/InicioVet"));
const HistorialClinico = React.lazy(() => import("../componentes/CompVet/HistorialClinico"));
const MascotasVet = React.lazy(() => import("../componentes/CompVet/Mascotas"));
const GestionCitasVet = React.lazy(() => import("../componentes/CompVet/GestionCitas"));

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

      {/* Rutas públicas */}
      <Route element={<RutasPublicas />}>
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Servicios" element={<Servicios />} />
        <Route path="/Adopcion" element={<Adopcion />} />
        <Route path="/SobreNosotros" element={<SobreNosotros />} />
        <Route path="/Propietario" element={<Propietario />} />
        <Route path="/OlvideContrasena" element={<OlvideContrasena />} />
        <Route path="/CambioContraseña" element={<CambioContraseña />} />
      </Route>

      {/* Rutas administrador */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="usuarios" element={<GestionUsuarios />} />
        <Route path="roles" element={<GestionRoles />} />
        <Route path="servicios" element={<GestionServicios />} />
        <Route path="gestion-citas" element={<GestionCitas />} />
      </Route>

      {/* Rutas propietario */}
      <Route
        element={
          isDevelopment ? (
            <RutasPropietario />
          ) : (
            <RutaProtegida rolPermitido="propietario">
              <RutasPropietario />
            </RutaProtegida>
          )
        }
      >
        <Route path="/PanelPropietario" element={<PanelPropietario />}>
          <Route index element={<InicioPropietario />} />
          <Route path="agendar-cita" element={<FormularioCita />} />
          <Route path="historia-clinica" element={<HisCli />} />
          <Route path="ActualizarPropietario" element={<ActualizarPropietario />} />
          <Route path="mascota" element={<Mascota />} />
          <Route path="mascota-form" element={<FormularioMascota />} />
          <Route path="ia" element={<Ia />} />
        </Route>
      </Route>

      {/* Rutas veterinario */}
      <Route
        element={
          isDevelopment ? (
            <PanelVet />
          ) : (
            <RutaProtegida rolPermitido="veterinario">
              <PanelVet />
            </RutaProtegida>
          )
        }
      >
        <Route path="/PanelVet" element={<InicioVet />} />
        <Route path="/PanelVet/mascotas" element={<MascotasVet />} />
        <Route path="/PanelVet/gestion-citas" element={<GestionCitas />} /> {/* Ruta correcta */}
        <Route path="/PanelVet/historial-clinico" element={<HistorialClinico />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;