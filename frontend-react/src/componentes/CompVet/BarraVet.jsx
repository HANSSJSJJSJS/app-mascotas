// src/componentes/CompVet/BarraVet.jsx

import { useState, useEffect, useMemo } from "react";
import { Calendar, FileText, PawPrint, Stethoscope, X } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";
import "../../stylos/cssVet/BarraVet.css";
import { useAuth } from '../../context/AuthContext';
// 1. IMPORTA LA FUNCIÓN DE CODIFICACIÓN
import { encodePath } from "../../funcionalidades/routeUtils";

const BarraVet = ({ onToggleMenu, menuAbierto }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { usuario, loading } = useAuth();

  // 2. DEFINE LAS RUTAS SIN CODIFICAR
  //    'path' es la clave que se codificará.
  const menuItems = [
    { icon: Stethoscope, text: "Inicio", path: "inicio" },
    { icon: PawPrint, text: "Mascotas", path: "mascotas" },
    { icon: Calendar, text: "Citas", path: "gestion-citas" },
    { icon: FileText, text: "Historial Clínico", path: "historial-clinico" }
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const displayName = useMemo(() => {
    if (loading || !usuario) return "Dr. Veterinario";
    return usuario.nombre ? `Dr. ${usuario.nombre}` : "Dr. Veterinario";
  }, [usuario, loading]);

  const displayRole = useMemo(() => {
    if (loading || !usuario) return "Veterinario";
    switch (usuario.id_rol) {
      case 1: return "Administrador";
      case 2: return "Veterinario";
      case 3: return "Propietario";
      default: return "Usuario";
    }
  }, [usuario, loading]);

  return (
    <aside className={`barra-lateral-vet ${isMobile ? "mobile" : ""} ${menuAbierto ? "open" : "closed"}`}>
      {isMobile && (
        <button onClick={onToggleMenu} className="close-button">
          <X size={20} />
        </button>
      )}

      <div className="barra-header">
        <PawPrint className="logo-icon" />
        <h2 className={menuAbierto ? "" : "hidden"}>PET MOYBE</h2>
      </div>
      
      {!loading && usuario && (
        <div className="vet-info">
          <div className={`vet-role ${!menuAbierto ? "hidden" : ""}`}>{displayRole}</div>
          <div className={`vet-name ${!menuAbierto ? "hidden" : ""}`}>{displayName}</div>
        </div>
      )}

      <nav>
        <ul className="menu-lateral-vet">
          {menuItems.map(({ icon: Icon, text, path }) => (
            <li key={text} className={location.pathname.includes(encodePath(path)) ? "active" : ""}>
              {/* 3. CONSTRUYE LA URL CODIFICADA EN EL COMPONENTE LINK */}
              <Link 
                to={`/PanelVet/${encodePath(path)}`} 
                className="link" 
                onClick={() => isMobile && onToggleMenu()}
              >
                <Icon />
                {menuAbierto && <span>{text}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default BarraVet;