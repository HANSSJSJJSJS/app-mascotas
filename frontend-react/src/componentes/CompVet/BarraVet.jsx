import { useState, useEffect, useMemo } from "react";
import { Calendar, FileText, PawPrint, Stethoscope, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import Swal from "sweetalert2";
import "../../stylos/cssVet/BarraVet.css";

const BarraVet = ({ onToggleMenu, menuAbierto }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { usuario, loading, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Stethoscope, text: "Inicio", path: "/PanelVet" },
    { icon: PawPrint, text: "Mascotas", path: "/PanelVet/mascotas" },
    { icon: Calendar, text: "Citas", path: "/PanelVet/gestion-citas" },
    { icon: FileText, text: "Historial Clínico", path: "/PanelVet/historial-clinico" }
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas cerrar la sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#8196eb",
        cancelButtonColor: "#1a2540",
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "No, quedarme",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
          navigate("/login");
        } else {
          window.history.pushState(null, "", window.location.href);
        }
      });
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, logout]);

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

  // Función para verificar si la ruta está activa
  const isActive = (path) => {
    return location.pathname === path || 
           (path !== "/PanelVet" && location.pathname.startsWith(path));
  };

  return (
    <aside className={`barra-lateral-vet ${isMobile ? "mobile" : ""} ${menuAbierto ? "open" : "closed"}`}>
      {isMobile && (
        <button onClick={onToggleMenu} className="close-button">
          <X size={20} />
        </button>
      )}

      <div className="barra-header">
        <PawPrint className="logo-icon" />
        {menuAbierto && <h2>PET MOYBE</h2>}
      </div>
      
      {!loading && usuario && (
        <div className="vet-info">
          {menuAbierto && (
            <>
              <div className="vet-role">{displayRole}</div>
              <div className="vet-name">{displayName}</div>
            </>
          )}
        </div>
      )}

      <nav>
        <ul className="menu-lateral-vet">
          {menuItems.map(({ icon: Icon, text, path }) => (
            <li key={path} className={isActive(path) ? "active" : ""}>
              <Link 
                to={path} 
                className="link" 
                onClick={() => isMobile && onToggleMenu()}
              >
                <Icon size={20} />
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