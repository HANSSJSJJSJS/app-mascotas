import { BrowserRouter as Router } from "react-router-dom";
import Header from "./componentes/index/Header";
import MainRoutes from "./routes/MainRoutes"; 
import Footer from './componentes/index/Footer';


function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <MainRoutes /> 
      </div>
      <Footer />
    </Router>
  );
}

export default App;

