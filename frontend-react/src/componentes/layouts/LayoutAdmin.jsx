import React from 'react';
import BarraAdmin from '../CompAdmin/BarraAdmin';
import EncabezadoAdmin from '../CompAdmin/EncabezadoAdmin';

const LayoutAdmin = ({ children }) => {
  return (
    <div className="app-container admin-layout">
      <BarraAdmin />
      <div className="content-wrapper">
        <EncabezadoAdmin />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;