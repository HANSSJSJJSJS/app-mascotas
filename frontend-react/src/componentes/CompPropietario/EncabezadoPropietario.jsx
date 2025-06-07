import { LogOut, Menu } from 'lucide-react';
import PropTypes from "prop-types";
import "../../stylos/cssPropietario/EncabezadoPropietario.css";

const EncabezadoPropietario = ({ 
  onToggleMenu, 
  estaMenuAbierto, 
  userData = {}, 
  onCerrarSesion 
}) => {
  const { nombre = "", apellido = "", username = "" } = userData;
  const nombreCompleto = nombre || apellido ? `${nombre} ${apellido}` : "Propietario";

  return (
    <div className={`encabezado-container ${estaMenuAbierto ? "menu-abierto" : "menu-cerrado"}`}>
      <header className="encabezado">
        <button className="boton-menu" onClick={onToggleMenu} aria-label="Alternar menú">
          <Menu size={20} />
          <span>MENU</span>
        </button>

        <div className="controles-encabezado">
          <div className="info-usuario">
            <span>{username || "Propietario"}</span>
            <span>{nombreCompleto}</span>
          </div>

          <button 
            className="boton-cerrar-sesion" 
            onClick={onCerrarSesion}
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>
    </div>
  );
};

EncabezadoPropietario.propTypes = {
  onToggleMenu: PropTypes.func.isRequired,
  estaMenuAbierto: PropTypes.bool.isRequired,
  userData: PropTypes.shape({
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    username: PropTypes.string,
  }), 
  onCerrarSesion: PropTypes.func.isRequired,
};

export default EncabezadoPropietario;
