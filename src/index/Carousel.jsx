import React from 'react';
import { BiArrowLeftCircleFill, BiArrowRightCircleFill } from 'react-icons/bi';

const Carousel = () => {
  return (
    <div className="container-carusel">
      <div id="header-carousel" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img className="w-100" src="/img/carousel-1.jpg" alt="Emergency vet" />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-1" style={{ maxWidth: '900px' }}>
                <span className="text">24/7 Para ti</span>
                <h1 className="display">Emergencias veterinarias</h1>
                <p className="lead">Cuando más nos necesites, estaremos ahí</p>
                <a className="boton" href="/citas" target="_blank">Agenda tu cita</a>
              </div>
            </div>
          </div>
          
          <div className="carousel-item">
            <img className="w-100" src="/img/carousel-2.jpg" alt="Pet spa" />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{ maxWidth: '900px' }}>
                <span className="textt">Spa & Grooming</span>
                <h1 className="displayy">Un día de belleza para tu mascota</h1>
                <p className="leadd">Mimos y cuidados especiales que se merecen</p>
                <a href="/citas" className="botton">Reservar Sesión</a>
              </div>
            </div>
          </div>
        </div>
        
        <a className="carousel-control-prev" href="#header-carousel" data-slide="prev">
          <div className="primary">
            <BiArrowLeftCircleFill size={45} />
          </div>
        </a>
        <a className="carousel-control-next" href="#header-carousel" data-slide="next">
          <div className="primaryy">
            <BiArrowRightCircleFill size={45} />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Carousel;