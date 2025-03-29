import React from 'react';
import { Menu } from 'lucide-react';
import '../stylos/Encabezado.css';

const Encabezado = () => {
    return (
        <header className="encabezado">
            <button className="boton-menu">
                <Menu size={20} />
                <span>MENU</span>
            </button>
            <div className="info-usuario">
                <span>Admin</span>
                <small>Administrador</small>
            </div>
            <div className="tarjeta-bienvenida">
                <h2>👋 Bienvenido: admin</h2>
            </div>
        </header>
    );
};

export default Encabezado;