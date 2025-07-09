import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../stylos/cssPropietario/PanelPropietario.css";
import BarraPropietario from "./BarraPropietario";
import EncabezadoPropietario from "./EncabezadoPropietario";
import Loading from "../index/Loading"; // Componente de carga para Suspense
import { encodePath, decodePath } from "../../funcionalidades/routeUtils"; // Asegúrate de importar ambas

// --- Componentes de las sub-secciones (cargados de forma perezosa) ---
const InicioPropietario = React.lazy(() => import("./InicioPropietario"));
const FormularioCita = React.lazy(() => import("../CompFormularios/FormularioCita"));
const HisCli = React.lazy(() => import("../CompAdmin/HisCli"));
const ActualizarPropietario = React.lazy(() => import("./ActualizarPropietario"));
const Mascota = React.lazy(() => import("./Mascota"));
const FormularioMascota = React.lazy(() => import("../CompFormularios/MascotaForm"));
const Ia = React.lazy(() => import("./ia_pro"));


const PanelPropietario = () => {
  const [estaMenuAbierto, setEstaMenuAbierto] = useState(true);
  const [esMobile, setEsMobile] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("pet-app-user")) || {};

  // --- Lógica nueva para enrutamiento interno ---
  const { encodedPath } = useParams();

  const renderContent = () => {
    const path = encodedPath ? decodePath(encodedPath) : "inicio";

    switch (path) {
      case "inicio":
        return <InicioPropietario />;
      case "agendar-cita":
        return <FormularioCita />;
      case "historia-clinica":
        return <HisCli />;
      case "ActualizarPropietario":
        return <ActualizarPropietario />;
      case "mascota":
        return <Mascota />;
      case "mascota-form":
        return <FormularioMascota />;
      case "ia":
        return <Ia />;
      default:
        return <InicioPropietario />;
    }
  };

  // --- Tus hooks y funciones existentes (sin cambios) ---
  useEffect(() => {
    const verificarSiEsMobile = () => {
      const mobile = window.innerWidth < 1024;
      setEsMobile(mobile);
      setEstaMenuAbierto(!mobile);
    };

    verificarSiEsMobile();
    window.addEventListener("resize", verificarSiEsMobile);
    return () => window.removeEventListener("resize", verificarSiEsMobile);
  }, []);

  const onAlternarMenu = useCallback(() => {
    setEstaMenuAbierto(prev => !prev);
  }, []);

  const onCerrarSesion = useCallback(() => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  return (
    <div className="app-container">
      <BarraPropietario
        onAlternarMenu={onAlternarMenu}
        estaMenuAbierto={estaMenuAbierto}
        onCerrarSesion={onCerrarSesion}
      />
      
      <EncabezadoPropietario
        onToggleMenu={onAlternarMenu}
        userData={userData}
        estaMenuAbierto={estaMenuAbierto}
        onCerrarSesion={onCerrarSesion}
      />
      
      {/* El botón flotante ya usa encodePath, por lo que funcionará perfecto */}
      <button
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 2000,
          background: "linear-gradient(135deg, #8196eb, #495a90)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 64,
          height: 64,
          boxShadow: "0 4px 16px rgba(129,150,235,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s"
        }}
        title="Ir al chat IA"
        onClick={() => navigate(`/PanelPropietario/${encodePath("ia")}`)}
      >
        🤖
      </button>

      <div
        className="content-wrapper"
        style={{
          marginLeft: esMobile ? "0" : (estaMenuAbierto ? "250px" : "70px"),
          width: esMobile ? "100%" : (estaMenuAbierto ? "calc(100% - 250px)" : "calc(100% - 70px)"),
          transition: "margin-left 0.3s ease, width 0.3s ease",
        }}
      >
        <div
          className="content-area"
          style={{
            marginTop: "70px",
            padding: "20px",
            width: "100%",
          }}
        >
          {/* --- Se reemplaza Outlet por Suspense y la función de renderizado --- */}
          <Suspense fallback={<Loading />}>
            {renderContent()}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PanelPropietario;