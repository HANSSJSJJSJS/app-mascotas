import React from 'react';
import '../stylos/Header.css';
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"></link>

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
            <a href="/" className="nav-item nav-link">Inicio</a>
            <a href="/servicios" className="nav-item nav-link">Servicios</a>
            <a href="/productos" className="nav-item nav-link">Tienda</a>
          </div>
          
          <div className="center-nav">
            <a href="/" className="nav-item nav-link">
              <h1 className="icono"><span className="text-ico">#</span>MOYBE</h1>
            </a>
          </div>
          
          <div className="right-nav">
            <a href="/adopcion" className="nav-item nav-link">Adopción</a>
            <a href="/blog" className="nav-item nav-link">Blog</a>
            <a href="/sobre-nosotros" className="nav-item nav-link">Sobre Nosotros</a>
          </div>
        </div> 
      </nav>
    </header>
  );
};

export default Header;