// PanelPri.jsx
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import BarraLateral from './BarraAdmin';
import Encabezado from './EncabezadoAdmin';

function PanelPri() {
  const [barraLateralAbierta, setBarraLateralAbierta] = useState(true);
  const [datosUsuario] = useState({
    nombreUsuario: 'admin',
    rol: 'Administrador'
  });

  const alternarBarraLateral = () => {
    setBarraLateralAbierta(!barraLateralAbierta);
  };

  return (
    <div className={`panel-principal ${barraLateralAbierta ? '' : 'barra-lateral-colapsada'}`}>
      <BarraLateral 
        alternarBarraLateral={alternarBarraLateral}
      />
      
      <div className={`contenido-principal ${barraLateralAbierta ? '' : 'expandido'}`}>
        <Encabezado 
          alAlternarMenu={alternarBarraLateral} 
          datosUsuario={datosUsuario} 
        />

        <div className="area-contenido">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default PanelPri;
