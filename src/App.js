import './App.css';
import Footer from "./componentes/Footer";
import Header from "./componentes/Header";
/*import MascotaForm from './formulario/MascotaForm';*/
/*import Propietario from "./formulario/Propietario";*/
/*import CambioContraseña from "./formulario/CambioContraseña";*/
import Login from "./formulario/Login";


function App() {
  return (
    <div className="App">
      <Header/>
      <Login/>
      <Footer/>
    </div>
  );
}

export default App;
