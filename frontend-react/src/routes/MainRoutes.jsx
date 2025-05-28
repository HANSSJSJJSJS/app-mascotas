// MainRoutes.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import RutaProtegida from "./RutaProtegida";
import LayoutPublico from "../componentes/layouts/LayoutPublico";
import LayoutAdmin from "../componentes/layouts/LayoutAdmin";
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

// Componentes admin
const PanelAdmin = React.lazy(() => import("../componentes/CompAdmin/PanelAdmin"));
const TarjetaEstadistica = React.lazy(() => import("../componentes/CompAdmin/TarjetaEstadistica"));
const ModuloCitas = React.lazy(() => import("../componentes/CompAdmin/ModuloCitas"));
const ModuloHorarios = React.lazy(() => import("../componentes/CompAdmin/ModuloHorarios"));
const ModuloAdministradores = React.lazy(() => import("../componentes/CompAdmin/ModuloAdministradores"));
const TablaMascotas = React.lazy(() => import("../componentes/CompAdmin/TablaMascotas"));
const TablaUsuarios = React.lazy(() => import("../componentes/CompAdmin/TablaUsuarios"));
const HisCli = React.lazy(() => import("../componentes/CompAdmin/HisCli"));
const Clientes = React.lazy(() => import("../componentes/CompAdmin/Clientes"));
const Veterinarios = React.lazy(() => import("../componentes/CompAdmin/Veterinarios"));

// Componentes propietario
const PanelPropietario = React.lazy(() => import("../componentes/CompPropietario/PanelPropietario"));
const InicioPropietario = React.lazy(() => import("../componentes/CompPropietario/InicioPropietario"));
const FormularioCita = React.lazy(() => import("../componentes/CompFormularios/FormularioCita"));
const ActualizarPropietario = React.lazy(() => import("../componentes/CompPropietario/ActualizarPropietario"));
const Mascota = React.lazy(() => import("../componentes/CompPropietario/Mascota"));

// Componentes veterinario
const PanelVet = React.lazy(() => import("../componentes/CompVet/PanelVet"))
const InicioVet = React.lazy(() => import("../componentes/CompVet/InicioVet"));
const AgendaVet = React.lazy(() => import("../componentes/CompVet/AgendaVet"));
const HisVet = React.lazy(() => import("../componentes/CompAdmin/HisCli"));
const Consultas = React.lazy(() => import("../componentes/CompVet/Consultas"));
const NuevaConsulta = React.lazy(() => import("../componentes/CompVet/NuevaConsulta"));
const Pacientes = React.lazy(() => import("../componentes/CompVet/Pacientes"));

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

      {/* Rutas admin */}
      <Route element={isDevelopment ? <RutasAdmin /> : <RutaProtegida rolPermitido="admin"><RutasAdmin /></RutaProtegida>}>
        <Route path="/PanelAdmin" element={<PanelAdmin />}>
          <Route index element={<ModuloCitas />} />
          <Route path="TablaCitas" element={<ModuloCitas />} />
          <Route path="inicio" element={<TarjetaEstadistica />} />
          <Route path="usuarios" element={<TablaUsuarios />} />
          <Route path="administradores" element={<ModuloAdministradores />} />
          <Route path="mascotas" element={<TablaMascotas />} />
          <Route path="horarios" element={<ModuloHorarios />} />
          <Route path="historial-clinico" element={<HisCli />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="veterinarios" element={<Veterinarios />} />
        </Route>
      </Route>

      {/* Rutas propietario */}
      <Route element={isDevelopment ? <RutasPropietario /> : <RutaProtegida rolPermitido="propietario"><RutasPropietario /></RutaProtegida>}>
        <Route path="/PanelPropietario" element={<PanelPropietario />}>
          <Route index element={<InicioPropietario />} />
          <Route path="agendar-cita" element={<FormularioCita />} />
          <Route path="historia-clinica" element={<HisCli />} />
          <Route path="ActualizarPropietario" element={<ActualizarPropietario />} />
          <Route path="mascota" element={<Mascota />} />
        </Route>
      </Route>

      {/* Rutas veterinario */}
      <Route element={isDevelopment ? <RutasVet /> : <RutaProtegida rolPermitido="veterinario"><RutasVet /></RutaProtegida>}>
        <Route path="/PanelVet" element={<PanelVet />}>
          <Route index element={<InicioVet />} />
          <Route path="nueva-consulta" element={<NuevaConsulta />} />
          <Route path="agenda" element={<AgendaVet />} />
          <Route path="consultas" element={<Consultas />} />
          <Route path="historial-clinico" element={<HisVet />} />
          <Route path="pacientes" element={<Pacientes />} />
        </Route>
      </Route>

      {/* Página 404 - Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;