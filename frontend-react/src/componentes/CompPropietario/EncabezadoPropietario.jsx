import React from 'react';
import { Menu } from 'lucide-react';
import '../../stylos/cssProp/EncabezadoPropietario.css';

const EncabezadoPropietario = ({ onToggleMenu, userData }) => {
  return (
    <>
      <header className="encabezado">
        <button className="boton-menu" onClick={onToggleMenu}>
          <Menu size={20} />
          <span>MENU</span>
        </button>
        <div className="info-usuario">
          <span>{userData?.username || 'Propietario'}</span>
          <small>{userData?.role || 'Propietario'}</small>
        </div>
      </header>

      <div className="tarjeta-bienvenida">
        <h2>👋 Bienvenido {userData?.username || 'Propietario'}</h2>
      </div>
    </>
  );
};

export default EncabezadoPropietario;
