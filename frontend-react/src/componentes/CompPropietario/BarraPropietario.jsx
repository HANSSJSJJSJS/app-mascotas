import { useState, useEffect } from "react";
import { Home, Calendar, User, Bone, X, PawPrint } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "../../stylos/cssPropietario/BarraPropietario.css";
import { encodePath } from "../../funcionalidades/routeUtils";
// 1. IMPORTA Swal PARA LAS ALERTAS
import Swal from "sweetalert2";

const BarraPropietario = ({ onAlternarMenu, estaMenuAbierto, onCerrarSesion }) => {
  const [esMobile, setEsMobile] = useState(false);
  const ubicacionActual = useLocation();

  // Datos del propietario (sin cambios)
  const [propietario, setPropietario] = useState({
    nombre: "",
    email: "",
    foto_perfil: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("pet-app-user");
    if (userData) {
      const parsed = JSON.parse(userData);
      let foto_perfil = parsed.foto_perfil;
      if (foto_perfil && foto_perfil.startsWith("/uploads/propietarios/")) {
        foto_perfil = foto_perfil.replace("/uploads/propietarios/", "");
      }
      setPropietario({ ...parsed, foto_perfil });
    }
  }, []);

  // Función para obtener iniciales (sin cambios)
  const obtenerIniciales = (nombre) => {
    return nombre
      .split(" ")
      .map((palabra) => palabra.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const elementosMenu = [
    { icono: <Home size={20} />, texto: "Inicio", path: "inicio" },
    { icono: <Calendar size={20} />, texto: "Agendar Cita", path: "agendar-cita" },
    { icono: <User size={20} />, texto: "Actualizar Datos", path: "ActualizarPropietario" },
    { icono: <Bone size={20} />, texto: "Mascota", path: "mascota" },
  ];

  const estaActivo = (path) => {
    if (path === 'inicio') {
      return ubicacionActual.pathname === '/PanelPropietario' || ubicacionActual.pathname === `/PanelPropietario/${encodePath('inicio')}`;
    }
    return ubicacionActual.pathname.includes(encodePath(path));
  };
  
  // useEffect para el tamaño de pantalla (sin cambios)
  useEffect(() => {
    const verificarSiEsMobile = () => {
      setEsMobile(window.innerWidth < 1024);
    };
    verificarSiEsMobile();
    window.addEventListener("resize", verificarSiEsMobile);
    return () => window.removeEventListener("resize", verificarSiEsMobile);
  }, []);

  // 2. AÑADE EL useEffect PARA MANEJAR EL BOTÓN DE RETROCESO
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault(); // Previene la navegación
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
          // Usa la función que viene por props para cerrar sesión
          onCerrarSesion();
        } else {
          // Vuelve a añadir el estado al historial para que el usuario no quede "atrapado"
          window.history.pushState(null, "", window.location.href);
        }
      });
    };

    // Añade el estado inicial al historial y el listener
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    // Limpia el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onCerrarSesion]); // La dependencia es la función de cerrar sesión

  return (
    <aside className={`barra-navegacion-moderna ${esMobile ? "mobile" : ""} ${!estaMenuAbierto ? "colapsada" : ""}`}>
      {/* El resto del código JSX no necesita cambios */}
      {esMobile && (
        <button onClick={onAlternarMenu} className="boton-cerrar-moderno">
          <X size={20} />
        </button>
      )}

      <div className="encabezado-moderno">
        <div
          className="contenedor-logo-moderno"
          onClick={!esMobile ? onAlternarMenu : undefined}
          style={{ cursor: !esMobile ? "pointer" : "default" }}
        >
          <PawPrint size={24} className="icono-logo-moderno" />
          {estaMenuAbierto && <span className="texto-logo-moderno">PET MOYBE</span>}
        </div>
      </div>

      <div className="tarjeta-perfil-moderna">
        <div className="contenedor-avatar-grande">
          {propietario.foto_perfil ? (
            <img
              src={
                propietario.foto_perfil.startsWith("/uploads/")
                  ? `http://localhost:3001${propietario.foto_perfil}`
                  : `http://localhost:3001/uploads/propietarios/${propietario.foto_perfil}`
              }
              alt={`Avatar de ${propietario.nombre}`}
              className="avatar-grande"
            />
          ) : (
            <div className="avatar-iniciales-grande">{obtenerIniciales(propietario.nombre)}</div>
          )}
          <div className="indicador-online-grande"></div>
        </div>
        {estaMenuAbierto && (
          <div className="info-propietario-moderna">
            <span className="nombre-propietario-moderno">{propietario.nombre}</span>
          </div>
        )}
      </div>

      <nav className="nav-moderno">
        <ul className="menu-moderno">
          {elementosMenu.map((elemento, indice) => (
            <li key={indice}>
              <Link
                to={elemento.path === 'inicio' ? '/PanelPropietario' : `/PanelPropietario/${encodePath(elemento.path)}`}
                className={`enlace-moderno ${estaActivo(elemento.path) ? "activo" : ""}`}
                onClick={() => esMobile && onAlternarMenu()}
              >
                <div className="contenedor-icono-moderno">{elemento.icono}</div>
                {estaMenuAbierto && <span className="texto-enlace-moderno">{elemento.texto}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default BarraPropietario;