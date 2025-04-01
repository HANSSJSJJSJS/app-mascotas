import React from 'react';
import { Link } from 'react-router-dom';
import '../../stylos/Header.css'

const Header = () => {
  return (
    <header className="header-wrapper">
      <div className="top-container">
        <div className="links">
          <a href="#"><i className="bi bi-facebook"></i></a>
          <a href="#"><i className="bi bi-whatsapp"></i></a>
          <a href="#"><i className="bi bi-instagram"></i></a>
        </div>
      </div>

      <nav className="navbarra">
        <div className="navtext">
          <div className="left-nav">
            <Link to="/Login" className="nav-item nav-link">Inicio</Link>
            <Link to="/servicios" className="nav-item nav-link">Servicios</Link>
          </div>

          <div className="center-nav">
            <Link to="/" className="nav-item nav-link">
              <h1 className="icono"><span className="text-ico">#</span>MOYBE</h1>
            </Link>
          </div>

          <div className="right-nav">
            <Link to="/adopcion" className="nav-item nav-link">Adopción</Link>
            <Link to="/sobre-nosotros" className="nav-item nav-link">Sobre Nosotros</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
