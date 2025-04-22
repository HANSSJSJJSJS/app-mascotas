"use client"

import { useEffect } from "react"
import React from "react";
import "../../stylos/cssHome/SobreNosotros.css";
import Sobrenosotros1 from "../../imagenes/Sobrenosotros1.png";
import Sobrenosotros2 from "../../imagenes/Sobrenosotros2.jpg";
import Sobrenosotros3 from "../../imagenes/Sobrenosotros3.png";
import Sobrenosotros5 from "../../imagenes/Sobrenosotros5.jpg";
import logo from "../../imagenes/logo.png";
import vet1 from "../../imagenes/vet1.jpg"
import vet2 from "../../imagenes/vet2.jpg"
import vet3 from "../../imagenes/vet3.jpg"

function SobreNosotros() {
  useEffect(() => {
    window.scrollTo(0, 0)

    // Animación de aparición al hacer scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el)
    })

    return () => {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.unobserve(el)
      })
    }
  }, [])

  return (
    <div className="nosotros-page-wrapper">
      <div className="nosotros-container">
        {/* Nuestra Historia - Rediseñada */}
        <section className="historia-section section-padding animate-on-scroll">
          <div className="historia-bg-shape"></div>
          <div className="historia-content-wrapper">
            <div className="historia-header">
              <span className="historia-subtitle">Nuestra Trayectoria</span>
              <h2>Nuestra Historia</h2>
              <div className="historia-divider"></div>
            </div>

            <div className="historia-content">
              <div className="historia-text">
                <div className="historia-quote">
                  <span className="quote-mark">"</span>
                  <p>Cada mascota merece el mejor cuidado posible, con amor y profesionalismo.</p>
                </div>
                <p>
                  Fundada en el corazón de la ciudad, <span className="highlight">MOYBE</span> nació de la pasión
                  compartida por los animales de nuestros fundadores. Lo que comenzó como un pequeño consultorio hoy es
                  un centro veterinario de referencia, combinando tecnología de punta con un trato cálido y
                  personalizado.
                </p>
                <p>
                  Cada día, más de <span className="highlight-number">100</span> mascotas reciben atención en nuestras
                  instalaciones, y lo que más nos enorgullece es ver cómo crecemos junto a las familias que confían en
                  nosotros.
                </p>

                <div className="historia-stats">
                  <div className="stat-box">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">Años de experiencia</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">5000+</span>
                    <span className="stat-label">Pacientes felices</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">20+</span>
                    <span className="stat-label">Especialistas</span>
                  </div>
                </div>
              </div>
              <div className="historia-image-container">
                <div className="historia-image-wrapper">
                  <img
                    src={Sobrenosotros1 || "/placeholder.svg"}
                    alt="Equipo de MOYBE Veterinaria"
                    className="historia-image"
                  />
                  <div className="image-accent"></div>
                </div>
                <div className="historia-image-caption">
                  <span className="caption-year">Desde 2008</span>
                  <span className="caption-text">Cuidando con pasión</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="mision-vision-section section-padding animate-on-scroll">
          <div className="section-header">
            <h2>Misión y Visión</h2>
            <div className="section-divider"></div>
          </div>
          <div className="mv-container">
            <div
              className="mv-card"
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${Sobrenosotros2})` }}
            >
              <div className="mv-icon">
                <i className="mission-icon"></i>
              </div>
              <h3>Nuestra Misión</h3>
              <p>
                Proporcionar atención veterinaria excepcional que mejore la calidad de vida de las mascotas, educando a
                sus dueños y manteniendo los más altos estándares éticos y profesionales.
              </p>
            </div>
            <div
              className="mv-card"
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${Sobrenosotros3})` }}
            >
              <div className="mv-icon">
                <i className="vision-icon"></i>
              </div>
              <h3>Nuestra Visión</h3>
              <p>
                Ser reconocidos como el centro veterinario líder en innovación y cuidado compasivo, donde cada mascota
                recibe tratamiento como si fuera parte de nuestra propia familia.
              </p>
            </div>
          </div>
        </section>

        {/* Nuestro Equipo */}
        <section className="equipo-section section-padding animate-on-scroll">
          <div className="section-header">
            <h2>Nuestro Equipo Veterinario</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Profesionales dedicados al cuidado de tus mascotas</p>
          </div>

          <div className="equipo-grid">
            {/* Veterinario 1 */}
            <div className="vet-card">
              <div className="vet-foto-container">
                <img src={vet1 || "/placeholder.svg"} alt="Dra. María López" className="vet-foto" />
              </div>
              <div className="vet-info">
                <h3 className="vet-nombre">Dra. María López</h3>
                <p className="vet-especialidad">Cirugía Veterinaria</p>
                <p className="vet-experiencia">15 años de experiencia</p>
                <div className="vet-divider"></div>
                <p className="vet-descripcion">
                  Especialista en procedimientos quirúrgicos complejos y rehabilitación postoperatoria.
                </p>
              </div>
            </div>

            {/* Veterinario 2 */}
            <div className="vet-card">
              <div className="vet-foto-container">
                <img src={vet2 || "/placeholder.svg"} alt="Dr. Juan Pérez" className="vet-foto" />
              </div>
              <div className="vet-info">
                <h3 className="vet-nombre">Dr. Juan Pérez</h3>
                <p className="vet-especialidad">Medicina Interna</p>
                <p className="vet-experiencia">12 años de experiencia</p>
                <div className="vet-divider"></div>
                <p className="vet-descripcion">Experto en diagnóstico y tratamiento de enfermedades complejas.</p>
              </div>
            </div>

            {/* Veterinario 3 */}
            <div className="vet-card">
              <div className="vet-foto-container">
                <img src={vet3 || "/placeholder.svg"} alt="Dra. Ana García" className="vet-foto" />
              </div>
              <div className="vet-info">
                <h3 className="vet-nombre">Dra. Ana García</h3>
                <p className="vet-especialidad">Dermatología</p>
                <p className="vet-experiencia">10 años de experiencia</p>
                <div className="vet-divider"></div>
                <p className="vet-descripcion">
                  Especialista en alergias, enfermedades de piel y tratamientos dermatológicos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Instalaciones */}
        <section className="instalaciones-section section-padding animate-on-scroll">
          <div className="section-header">
            <h2>Nuestras Instalaciones</h2>
            <div className="section-divider"></div>
          </div>
          <div className="instalaciones-content">
            <div className="instalaciones-image">
              <img src={logo || "/placeholder.svg"} alt="Instalaciones MOYBE" />
            </div>
            <div className="instalaciones-text">
              <p>
                En MOYBE hemos creado un espacio diseñado específicamente para el confort y seguridad de tus mascotas.
                Contamos con:
              </p>
              <ul className="instalaciones-list">
                <li>
                  <span className="list-icon">🏥</span>
                  <div>
                    <h4>Quirófanos de Última Generación</h4>
                    <p>Equipados con tecnología avanzada para procedimientos seguros y precisos.</p>
                  </div>
                </li>
                <li>
                  <span className="list-icon">🔍</span>
                  <div>
                    <h4>Monitoreo 24/7</h4>
                    <p>
                      Área de hospitalización con supervisión constante para pacientes que requieren cuidados
                      especiales.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="list-icon">🧪</span>
                  <div>
                    <h4>Laboratorio Clínico</h4>
                    <p>Análisis y resultados inmediatos para diagnósticos rápidos y precisos.</p>
                  </div>
                </li>
                <li>
                  <span className="list-icon">🦮</span>
                  <div>
                    <h4>Rehabilitación Física</h4>
                    <p>Sala especializada para terapias y recuperación de mascotas.</p>
                  </div>
                </li>
                <li>
                  <span className="list-icon">🐱</span>
                  <div>
                    <h4>Áreas Separadas</h4>
                    <p>Zonas específicas para perros y gatos, reduciendo el estrés durante la visita.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tecnología */}
        <section
          className="tech-section section-padding animate-on-scroll"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(${Sobrenosotros5})` }}
        >
          <div className="tech-content">
            <div className="section-header light">
              <h2>Tecnología al Servicio de la Salud Animal</h2>
              <div className="section-divider light"></div>
            </div>
            <p>
              Invertimos continuamente en equipamiento de vanguardia para ofrecer diagnósticos precisos y tratamientos
              más efectivos. Desde ecógrafos de alta resolución hasta equipos de anestesia monitorizada, todo pensado
              para la seguridad de tus mascotas.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section className="valores-section section-padding animate-on-scroll">
          <div className="section-header">
            <h2>Nuestros Valores</h2>
            <div className="section-divider"></div>
          </div>
          <div className="valores-grid">
            <div className="valor-card">
              <div className="valor-icon">❤️🐾</div>
              <h3>Compasión</h3>
              <p>Tratamos a cada mascota con el mismo amor que nos gustaría para nuestros propios animales.</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">⭐</div>
              <h3>Excelencia</h3>
              <p>
                Mantenemos los más altos estándares médicos mediante educación continua y práctica basada en evidencia.
              </p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">🤝</div>
              <h3>Integridad</h3>
              <p>Honestidad y transparencia en cada diagnóstico, tratamiento y presupuesto.</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">🚀</div>
              <h3>Innovación</h3>
              <p>Adopción temprana de tecnologías y técnicas que beneficien a nuestros pacientes.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SobreNosotros;
