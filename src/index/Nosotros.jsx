import React from 'react';
import { BiHeartFill, BiToggleRight, BiShop } from 'react-icons/bi';
import { BiStar } from 'react-icons/bi';

const Nosotros = () => {
  return (
    <div className="container-ab">
      <div className="about">
        <div className="iconos">
          <a href="#"><BiHeartFill className="bii" /></a>
          <a href="#"><BiToggleRight className="bii" /></a>
          <a href="#"><BiShop className="bii" /></a>
        </div>

        <div className="teetx-container">
          <div className="teetx">
            <span className="saluu">Salud Preventiva</span>
            <h1 className="subsa">Calendario de vacunación al día</h1>
            <p className="subsub">Protección completa para una vida saludable</p>
          </div>
        </div>

        <div className="row">
          <div className="vert-text">
            <h4 className="font-weight-bold">Sobre nosotros</h4>
            <h5 className="text-muted mb-3">Moybe: Donde el amor y la salud de tu mascota son nuestra prioridad.</h5>
            <p>En Moybe, nos apasiona el bienestar de tus mascotas...</p>
            <a href="/login" className="shadow__btn">Registrarse</a>
          </div>

          <div className="col">
            <div className="position-relative">
              <img className="position" src="/img/about.png" alt="About us" />
            </div>
            <div className="cool">
              <h4 className="text-about">Nuestros Servicios</h4>
              <p className="text-of">Ofrecemos atención veterinaria integral...</p>
              <h5 className="text-muted mb-3"><BiStar className="me-3" />Consultas y chequeos generales</h5>
              <h5 className="text-muted mb-3"><BiStar className="me-3" />Vacunación y desparasitación</h5>
              <h5 className="text-muted mb-3"><BiStar className="me-3" />Cirugías y tratamientos especializados</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;