import React, { useState } from 'react';
import BarraLateral from './BarraAdmin';
import Encabezado from './EncabezadoAdmin';
import TarjetaEstadistica from './TarjetaEstadistica';
import TablaMascota from './TablaMascota';

function PanelPri() {
  const [barraLateralAbierta, setBarraLateralAbierta] = useState(true);
  const [menuActivo, setMenuActivo] = useState('Inicio');
  const [datosUsuario] = useState({
    nombreUsuario: 'admin',
    rol: 'Administrador'
  });

  const alternarBarraLateral = () => {
    setBarraLateralAbierta(!barraLateralAbierta);
  };

  const manejarSeleccionMenu = (itemMenu) => {
    setMenuActivo(itemMenu);
    // Aquí podrías cargar contenido diferente según el menú seleccionado
    console.log(`Menú seleccionado: ${itemMenu}`);
  };

  const manejarSeleccionMascota = (mascota) => {
    alert(`Mascota seleccionada: ${mascota.nombre}\nPropietario: ${mascota.propietario}`);
    // Aquí podrías abrir un modal con más detalles o navegar a otra vista
  };

  return (
    <div className={`panel-principal ${barraLateralAbierta ? '' : 'barra-lateral-colapsada'}`}>
      <BarraLateral 
        alternarBarraLateral={alternarBarraLateral}
        itemActivo={menuActivo}
        alSeleccionarMenu={manejarSeleccionMenu}
      />
      
      <div className={`contenido-principal ${barraLateralAbierta ? '' : 'expandido'}`}>
        <Encabezado 
          alAlternarMenu={alternarBarraLateral} 
          datosUsuario={datosUsuario} 
        />
        
        <div className="area-contenido">
          <h1>Panel de Administración - {menuActivo}</h1>
          
          <TarjetaEstadistica />
          
          <TablaMascota alSeleccionarMascota={manejarSeleccionMascota} />
        </div>
      </div>
    </div>
  );
}

export default PanelPri;