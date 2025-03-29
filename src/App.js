import './App.css';
import React from 'react';
import Footer from "./componentes/Footer";
// import Header from "./componentes/Header";
import BarraLateral from './componentes/BarraLateral';
import Encabezado from './componentes/Encabezado';
import TablaMascotas from './componentes/TablaMascota';
import TarjetasEstadisticas from './componentes/TarjetaEstadistica';
// import MascotaForm from './formulario/MascotaForm';
// import Propietario from "./formulario/Propietario";
// import CambioContraseña from "./formulario/CambioContraseña";
// import HisCli from './componentes/HisCli';



function App() {
  return (
    <div className="App">
      <BarraLateral/>
      <Encabezado/>
      <TarjetasEstadisticas/>
      <TablaMascotas/>
      {/* <HisCli/> */}
      <Footer/>
    </div>
  );
}

export default App;