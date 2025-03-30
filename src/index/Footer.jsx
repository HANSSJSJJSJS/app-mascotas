import React from "react";
import '../stylos/Footer.css'

const Footer = () => {
return (
    <footer id="footer-container">
    <div className="footer-container animate__animated animate__rubberBand">
        <p>Cuidando a tus mascotas como si fueran nuestras</p>
        <div>
        <h3>Contacto</h3>
        <p>Carrera 73B Bis # 6 – 22 Sur</p>
        <p>Soacha, Colombia</p>
        <p>+57 215 1533</p>
        </div>
        <div>
        <h3>Horario</h3>
        <p>Lunes a Sábado: 8am – 5pm</p>
        <p>Urgencias: 24/7</p>
        <div className="social-icons">
            <img
            src="https://raw.githubusercontent.com/Vale250910/danna/refs/heads/main/img/facebook.png"
            alt="Facebook"
            />
            <img
            src="https://raw.githubusercontent.com/Vale250910/danna/refs/heads/main/img/instagram.png"
            alt="Instagram"
            />
            <img
            src="https://raw.githubusercontent.com/Vale250910/danna/refs/heads/main/img/whatsapp.png"
            alt="WhatsApp"
            />
        </div>
        </div>
    </div>
    </footer>
);
};

export default Footer;