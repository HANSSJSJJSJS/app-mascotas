import React from 'react';
import { Outlet } from 'react-router-dom';
import BarraAdmin from '../CompAdmin/BarraAdmin';
import EncabezadoAdmin from '../CompAdmin/EncabezadoAdmin';

const LayoutAdmin = () => {
  return (
    <div className="app-container admin-layout">
      <BarraAdmin />
      <div className="content-wrapper">
        <EncabezadoAdmin />
        <div className="content-area">
          <Outlet /> {/* Cambia children por Outlet */}
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;