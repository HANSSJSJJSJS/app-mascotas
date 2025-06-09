import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BarraPropietario from '../CompPropietario/BarraPropietario';
import EncabezadoPropietario from '../CompPropietario/EncabezadoPropietario';
import { useAuth } from '../../context/AuthContext';
import InactivityModal from '../common/InactivityModal';

const LayoutPropietario = () => {
  {/*const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate('/Login');
    }
  }, [usuario, navigate]);*/}

  return (
    <div className="app-container propietario-layout">
      <BarraPropietario />
      <div className="content-wrapper">
        <EncabezadoPropietario />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
      <InactivityModal />
    </div>
  );
};

export default LayoutPropietario;