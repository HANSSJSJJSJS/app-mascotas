import React, { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Loading from "../index/Loading"; 
import { decodePath } from "../../funcionalidades/routeUtils"; // Importamos la función para decodificar
import "../../stylos/cssAdmin/AdminDashboard.css";

// Lazy-loading de los componentes del dashboard
const DashboardHome = React.lazy(() => import("./DashboardHome"));
const GestionUsuarios = React.lazy(() => import("./GestionUsuarios"));
const GestionRoles = React.lazy(() => import("./GestionRoles"));
const GestionServicios = React.lazy(() => import("./GestionServicios"));
const GestionCitas = React.lazy(() => import("./GestionCitas"));

const AdminDashboard = () => {
  // --- Tus estados actuales (sin cambios) ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Lógica de navegación y autenticación (sin cambios) ---
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // --- Lógica nueva para manejar el enrutamiento interno ---
  const { encodedPath } = useParams();

  const renderContent = () => {
    // Si no hay encodedPath en la URL, se usa 'dashboard' como valor por defecto
    const path = encodedPath ? decodePath(encodedPath) : "dashboard";

    switch (path) {
      case "dashboard":
        return <DashboardHome />;
      case "gestion-usuarios":
        return <GestionUsuarios />;
      case "gestion-roles":
        return <GestionRoles />;
      case "gestion-citas":
        return <GestionCitas />;
      case "gestion-servicios":
        return <GestionServicios />;
      default:
        // Si la ruta no coincide, volvemos al inicio del dashboard
        return <DashboardHome />;
    }
  };

  // --- Tus useEffects (sin cambios) ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  // --- Tu función para el menú (sin cambios) ---
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileMenuOpen}
        closeMobileMenu={() => setMobileMenuOpen(false)}
      />
      <div
        className={`admin-content ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${
          isMobile && mobileMenuOpen ? "mobile-menu-open" : ""
        }`}
      >
        <Topbar
          toggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          mobileMenuOpen={mobileMenuOpen}
        />
        <main className="admin-main">
          <Suspense fallback={<Loading />}>
            {renderContent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;