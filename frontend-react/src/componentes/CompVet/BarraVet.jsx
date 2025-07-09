import { useState, useEffect, useMemo } from "react";
import { Calendar, FileText, PawPrint, Stethoscope, X } from 'lucide-react';
// 1. IMPORTA useNavigate DE react-router-dom
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../stylos/cssVet/BarraVet.css";
import { useAuth } from '../../context/AuthContext';
import { encodePath } from "../../funcionalidades/routeUtils";
// 2. IMPORTA Swal
import Swal from "sweetalert2";

const BarraVet = ({ onToggleMenu, menuAbierto }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  // 3. EXTRAE 'logout' DEL HOOK useAuth
  const { usuario, loading, logout } = useAuth();
  // 4. INICIALIZA 'navigate'
  const navigate = useNavigate();

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

  // Este useEffect ahora funcionará correctamente
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