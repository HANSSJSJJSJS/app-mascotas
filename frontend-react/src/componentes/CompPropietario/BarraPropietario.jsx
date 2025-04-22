// src/componentes/BarraPropietario.jsx
import React, { useState, useEffect } from 'react';
import { Home, Calendar, User, FileText, Bone, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // 👈 Importa Link
import '../../stylos/cssProp/BarraPropietario.css';

const BarraPropietario = ({ onMenuSelect, onToggleMenu, menuAbierto }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, text: 'Inicio', path: '/' },
    { icon: Calendar, text: 'Agendar Cita', path: '/agendar-cita' },
    { icon: User, text: 'Actualizar Datos', path: '/actualizar-datos' },
    { icon: FileText, text: 'Historia Clínica', path: '/historia-clinica' },
    { icon: Bone, text: 'Mascota', path: '/mascota' },
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleItemClick = (itemText) => {
    if (onMenuSelect) onMenuSelect(itemText);
    if (isMobile && onToggleMenu) onToggleMenu();
  };

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
              onClick={() => handleItemClick(text)}
            >
              <Link to={path} className="link">
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
