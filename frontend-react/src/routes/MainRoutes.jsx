// MainRoutes.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import RutaProtegida from "./RutaProtegida";
import LayoutPublico from "../componentes/layouts/LayoutPublico";
import LayoutPropietario from "../componentes/layouts/LayoutPropietario";
import LayoutVet from "../componentes/layouts/LayoutVet";
import Loading from "../componentes/index/Loading";
import useCerrarSesionAlRetroceder from "../funcionalidades/CerrarSesion";

// Componentes públicos
const Home = React.lazy(() => import("../componentes/index/Home"));
const Servicios = React.lazy(() => import("../componentes/CompHome/Servicios"));
const Adopcion = React.lazy(() => import("../componentes/CompHome/Adopcion"));
const SobreNosotros = React.lazy(() => import("../componentes/CompHome/SobreNosotros"));
const Login = React.lazy(() => import("../componentes/CompFormularios/Login"));
const Propietario = React.lazy(() => import("../componentes/CompFormularios/Propietario"));
const OlvideContrasena = React.lazy(() => import("../componentes/CompFormularios/OlvideContrasena"));
const CambioContraseña = React.lazy(() => import("../componentes/CompFormularios/CambioContraseña"))
const NotFound = React.lazy(() => import("../componentes/CompHome/NotFound"));

// NUEVO DASHBOARD DE ADMINISTRADOR
const AdminDashboard = React.lazy(() => import("../componentes/CompAdmin/AdminDashboard"))
const DashboardHome = React.lazy(() => import("../componentes/CompAdmin/DashboardHome"))
const GestionUsuarios = React.lazy(() => import("../componentes/CompAdmin/GestionUsuarios"))
const GestionRoles = React.lazy(() => import("../componentes/CompAdmin/GestionRoles"))
const GestionServicios = React.lazy(() => import("../componentes/CompAdmin/GestionServicios"))
const GestionCitas = React.lazy(() => import("../componentes/CompAdmin/GestionCitas"));

const HisCli = React.lazy(() => import("../componentes/CompAdmin/HisCli"));



// Componentes propietario
const PanelPropietario = React.lazy(() => import("../componentes/CompPropietario/PanelPropietario"));
const InicioPropietario = React.lazy(() => import("../componentes/CompPropietario/InicioPropietario"));
const FormularioCita = React.lazy(() => import("../componentes/CompFormularios/FormularioCita"));
const ActualizarPropietario = React.lazy(() => import("../componentes/CompPropietario/ActualizarPropietario"));
const Mascota = React.lazy(() => import("../componentes/CompPropietario/Mascota"));
const FormularioMascota =React.lazy(() => import("../componentes/CompFormularios/MascotaForm"))

// Componentes veterinario
const PanelVet = React.lazy(() => import("../componentes/CompVet/PanelVet"))
const InicioVet = React.lazy(() => import("../componentes/CompVet/InicioVet"));
const HistorialClinico = React.lazy(() => import("../componentes/CompVet/HistorialClinico"));
const Consultas = React.lazy(() => import("../componentes/CompVet/Consultas"));
const NuevaConsulta = React.lazy(() => import("../componentes/CompVet/NuevaConsulta"));
const MascotasVet = React.lazy(() => import("../componentes/CompVet/Mascotas"));
const GestionCitasVet = React.lazy(() => import("../componentes/CompVet/GestionCitas"));

const MainRoutes = () => {
  // ✅ USAR EL HOOK PARA CERRAR SESIÓN AL RETROCEDER
  useCerrarSesionAlRetroceder();
  
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

  const RutasVet = () => (
    <React.Suspense fallback={<Loading />}>
      <LayoutVet>
        <Outlet />
      </LayoutVet>
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
        <Route path="/CambioContraseña" element={<CambioContraseña />} />
      </Route>
      
      {/* RUTAS ADMINISTRADOR */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="usuarios" element={<GestionUsuarios />} />
        <Route path="roles" element={<GestionRoles />} />
        <Route path="servicios" element={<GestionServicios />} />
        <Route path="gestion-citas" element={<GestionCitas />} />
        <Route path="gestion-usuarios" element={<GestionUsuarios />} />
        <Route path="gestion-roles" element={<GestionRoles />} />
        <Route path="gestion-servicios" element={<GestionServicios />} /> 
      </Route>

      {/* Rutas propietario */}
      <Route element={isDevelopment ? <RutasPropietario /> : <RutaProtegida rolPermitido="propietario"><RutasPropietario /></RutaProtegida>}>
        <Route path="/PanelPropietario" element={<PanelPropietario />}>
          <Route index element={<InicioPropietario />} />
          <Route path="agendar-cita" element={<FormularioCita />} />
          <Route path="historia-clinica" element={<HisCli />} />
          <Route path="ActualizarPropietario" element={<ActualizarPropietario />} />
          <Route path="mascota" element={<Mascota />} />
          <Route path="mascota-form" element={<FormularioMascota />} />
        </Route>
      </Route>

      {/* Rutas veterinario */}
      {/* <Route element={isDevelopment ? <RutasVet /> : <RutaProtegida rolPermitido="veterinario"><RutasVet /></RutaProtegida>}> */}
        <Route path="/PanelVet" element={<PanelVet />}>
          <Route index element={<InicioVet />} />
          <Route path="nueva-consulta" element={<NuevaConsulta />} />
          <Route path="consultas" element={<Consultas />} />
          <Route path="historial-clinico" element={<HistorialClinico />} />
          <Route path="mascotas" element={<MascotasVet />} />
          <Route path="gestion-citas" element={<GestionCitasVet />} />
        </Route>
        {/* </Route> */}

      {/* Página 404 - Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;