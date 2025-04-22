// PanelPropietario.jsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import "../../stylos/cssProp/PanelPropietario.css";
import BarraPropietario from "./BarraPropietario";
import EncabezadoPropietario from "./EncabezadoPropietario";

const PanelPropietario = () => {
  const [menuAbierto, setMenuAbierto] = useState(true);

  const [userData] = useState({
    username: "Juan Pérez",
    role: "Propietario",
    email: "juan@example.com",
  });

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <div className="app-container">
      <BarraPropietario 
        onToggleMenu={toggleMenu} 
        menuAbierto={menuAbierto}
      />
      <div className="content-wrapper">
        <EncabezadoPropietario 
          onToggleMenu={toggleMenu} 
          userData={userData} 
        />
        <div className="content-area">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default PanelPropietario;
