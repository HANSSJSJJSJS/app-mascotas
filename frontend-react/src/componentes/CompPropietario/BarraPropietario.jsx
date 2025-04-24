import React, { useState, useEffect } from 'react';
import { Home, Calendar, User, FileText, Bone, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../../stylos/cssPropietario/BarraPropietario.css';

const BarraPropietario = ({ onToggleMenu, menuAbierto }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, text: 'Inicio', path: '/PanelPropietario' },
    { icon: Calendar, text: 'Agendar Cita', path: '/PanelPropietario/agendar-cita' },
    { icon: User, text: 'Actualizar Datos', path: '/PanelPropietario/ActualizarPropietario' },
    { icon: FileText, text: 'Historia Clínica', path: '/PanelPropietario/historia-clinica' },
    { icon: Bone, text: 'Mascota', path: '/PanelPropietario/mascota' },
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <aside className={`barra-lateral ${isMobile ? 'mobile' : ''} ${menuAbierto && isMobile ? 'open' : ''}`}>
      {isMobile && (
        <button 
          onClick={onToggleMenu}
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>
      )}

      <h2>MENU PROPIETARIO</h2>
      <nav>
        <ul className="menu-lateral">
          {menuItems.map(({ icon: Icon, text, path }) => (
            <li 
              key={text} 
              className={location.pathname === path ? 'active' : ''}
            >
              <Link 
                to={path} 
                className="link" 
                onClick={() => isMobile && onToggleMenu()}
              >
                <Icon />
                <span>{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default BarraPropietario;