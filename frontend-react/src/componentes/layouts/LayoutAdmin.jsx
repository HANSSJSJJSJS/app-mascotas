import React,{useEffect} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BarraAdmin from '../CompAdmin/BarraAdmin';
import EncabezadoAdmin from '../CompAdmin/EncabezadoAdmin';
import { useAuth } from '../../context/AuthContext';
import InactivityModal from '../common/InactivityModal';

const LayoutAdmin = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate('/Login');
    }
  }, [usuario]);

  return (
    <div className="app-container admin-layout">
      <BarraAdmin />
      <div className="content-wrapper">
        <EncabezadoAdmin />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
      <InactivityModal />
    </div>
  );
};

export default LayoutAdmin;