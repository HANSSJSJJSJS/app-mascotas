import { useState, useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import "../../stylos/cssVet/PanelVet.css";

// --- 1. IMPORTACIONES NECESARIAS ---
// Importa los componentes de la estructura del panel
import BarraVet from "./BarraVet";
import EncabezadoVet from "./EncabezadoVet";
// Importa la utilidad para decodificar
import { decodePath } from "../../funcionalidades/routeUtils";

// Importa TODOS los componentes que se pueden mostrar en el panel
import InicioVet from "./InicioVet";
import MascotasVet from "./Mascotas";
import GestionCitasVet from "./GestionCitas";
import HistorialClinico from "./HistorialClinico";
import NotFound from "../CompHome/NotFound"; // Para rutas inválidas

// --- 2. MAPA DE RUTAS ---
// Asocia la clave decodificada con el componente a renderizar
const routeComponentMap = {
  "inicio": InicioVet,
  "mascotas": MascotasVet,
  "gestion-citas": GestionCitasVet,
  "historial-clinico": HistorialClinico,
};


const PanelVet = () => {
  // Lógica para manejar el menú lateral (la mantuve de tu archivo original)
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setMenuAbierto(!mobile);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // --- 3. LÓGICA DE SUB-ENRUTAMIENTO ---
  const { encodedPath } = useParams(); // Obtiene el parámetro de la URL (ej: "aW5pY2lv")

  const renderContent = () => {
    // Si no hay parámetro, estamos en "/PanelVet", mostramos el inicio
    if (!encodedPath) {
      return <InicioVet />;
    }

    const decodedKey = decodePath(encodedPath); // Decodifica el parámetro
    const ComponentToRender = routeComponentMap[decodedKey]; // Busca el componente en el mapa

    // Si se encuentra un componente, lo renderiza. Si no, muestra la página de NotFound.
    return ComponentToRender ? <ComponentToRender /> : <NotFound />;
  };

  return (
    <div className="app-container">
      <BarraVet onToggleMenu={toggleMenu} menuAbierto={menuAbierto} />
      <EncabezadoVet onToggleMenu={toggleMenu} isSidebarOpen={menuAbierto} />
      <div
        className="content-wrapper"
        style={{
          marginLeft: menuAbierto ? "250px" : "70px",
          width: menuAbierto ? "calc(100% - 250px)" : "calc(100% - 70px)",
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
          {/* --- 4. SE REEMPLAZA <Outlet /> POR LA FUNCIÓN DE RENDERIZADO --- */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PanelVet;