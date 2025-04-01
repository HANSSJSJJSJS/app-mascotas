import { BrowserRouter as Router } from "react-router-dom";
import Header from "./componentes/index/Header";
import MainRoutes from "./routes/MainRoutes"; 

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <MainRoutes /> 
      </div>
    </Router>
  );
}

export default App;

