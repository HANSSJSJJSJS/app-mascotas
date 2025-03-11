import './App.css';
import Footer from "./componentes/Footer";
import Header from "./componentes/Header";
/*import MascotaForm from './formulario/MascotaForm';*/
import Propietario from "./formulario/Propietario";
/*import CambioContraseña from "./formulario/CambioContraseña";*/




function App() {
  return (
    <div className="App">
      <Header/>
      <Propietario/>
      <Footer/>
    </div>
  );
}

export default App;
