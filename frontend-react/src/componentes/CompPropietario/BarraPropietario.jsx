import { useState, useEffect } from "react"
import { Home, Calendar, User, Bone, X, PawPrint } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import "../../stylos/cssPropietario/BarraPropietario.css"

const BarraPropietario = ({ onAlternarMenu, estaMenuAbierto, onCerrarSesion }) => {
  const [esMobile, setEsMobile] = useState(false)
  const ubicacionActual = useLocation()

  // Datos del propietario reales desde localStorage
  const [propietario, setPropietario] = useState({
    nombre: "",
    email: "",
    foto_perfil: ""
  });

  useEffect(() => {
    const userData = localStorage.getItem("pet-app-user");
    if (userData) {
      const parsed = JSON.parse(userData);
      // Normaliza foto_perfil: si viene con ruta, deja solo el nombre
      let foto_perfil = parsed.foto_perfil;
      if (foto_perfil && foto_perfil.startsWith("/uploads/propietarios/")) {
        foto_perfil = foto_perfil.replace("/uploads/propietarios/", "");
      }
      setPropietario({ ...parsed, foto_perfil });
    }
  }, []);

  // Función para obtener las iniciales del nombre
  const obtenerIniciales = (nombre) => {
    return nombre
      .split(" ")
      .map((palabra) => palabra.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Definir los elementos del menú
  const elementosMenu = [
    { icono: <Home size={20} />, texto: "Inicio", ruta: "/PanelPropietario" },
    { icono: <Calendar size={20} />, texto: "Agendar Cita", ruta: "/PanelPropietario/agendar-cita" },
    { icono: <User size={20} />, texto: "Actualizar Datos", ruta: "/PanelPropietario/ActualizarPropietario" },
    { icono: <Bone size={20} />, texto: "Mascota", ruta: "/PanelPropietario/Mascota" },
  ]

  useEffect(() => {
    const verificarSiEsMobile = () => {
      setEsMobile(window.innerWidth < 1024)
    }

    verificarSiEsMobile()
    window.addEventListener("resize", verificarSiEsMobile)

    return () => window.removeEventListener("resize", verificarSiEsMobile)
  }, [])

  return (
    <aside className={`barra-navegacion-moderna ${esMobile ? "mobile" : ""} ${!estaMenuAbierto ? "colapsada" : ""}`}>
      {/* Botón de cerrar para móvil */}
      {esMobile && (
        <button onClick={onAlternarMenu} className="boton-cerrar-moderno">
          <X size={20} />
        </button>
      )}

      {/* Encabezado con logo */}
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

      {/* Tarjeta de perfil moderna y prominente */}
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

      {/* Menú de navegación moderno */}
      <nav className="nav-moderno">
        <ul className="menu-moderno">
          {elementosMenu.map((elemento, indice) => (
            <li key={indice}>
              <Link
                to={elemento.ruta}
                className={`enlace-moderno ${ubicacionActual.pathname === elemento.ruta ? "activo" : ""}`}
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
  )
}

export default BarraPropietario
