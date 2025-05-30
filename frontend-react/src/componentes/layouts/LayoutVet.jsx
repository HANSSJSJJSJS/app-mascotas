import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BarraVet from '../CompVet/BarraVet';
import EncabezadoVet from '../CompVet/EncabezadoVet';
import { useAuth } from '../../context/AuthContext';
import InactivityModal from '../common/InactivityModal';

const LayoutVet = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate('/Login');
    }
  }, [usuario, navigate]);

  return (
    <div className="app-container vet-layout">
      <BarraVet />
      <div className="content-wrapper">
        <EncabezadoVet />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
      <InactivityModal />
    </div>
  );
};

export default LayoutVet;