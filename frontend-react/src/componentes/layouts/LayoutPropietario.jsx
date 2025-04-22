import React from 'react';
import { Outlet } from 'react-router-dom';
import BarraPropietario from '../CompPropietario/BarraPropietario';
import EncabezadoPropietario from '../CompPropietario/EncabezadoPropietario';

const LayoutPropietario = () => {
  return (
    <div className="app-container propietario-layout">
      <BarraPropietario />
      <div className="content-wrapper">
        <EncabezadoPropietario />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutPropietario;
