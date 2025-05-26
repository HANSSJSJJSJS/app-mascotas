// components/NavigationDrawer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Menu } from 'lucide-react';

export default function NavigationDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón para abrir el drawer en móviles */}
      <button 
        className="mobile-menu-button" 
        onClick={toggleDrawer}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay (solo visible cuando el drawer está abierto) */}
      {isOpen && (
        <div 
          className="drawer-overlay" 
          onClick={toggleDrawer}
        ></div>
      )}

      {/* Drawer */}
      <div className={`navigation-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button 
            className="close-drawer" 
            onClick={toggleDrawer}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="drawer-nav">
          <ul>
            <li>
              <Link to="/Servicios" onClick={toggleDrawer}>Servicios</Link>
            </li>
            <li>
              <Link to="/Adopcion" onClick={toggleDrawer}>Adopción</Link>
            </li>
            <li>
              <Link to="/SobreNosotros" onClick={toggleDrawer}>Sobre Nosotros</Link>
            </li>
            <li>
              <Link to="/Login" onClick={toggleDrawer}>Iniciar sesión</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}