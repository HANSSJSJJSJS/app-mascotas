import React from "react";
import "../../stylos/SobreNosotros.css";
import Sobrenosotros1 from "../../imagenes/Sobrenosotros1.png";
import Sobrenosotros2 from "../../imagenes/Sobrenosotros2.jpg";
import Sobrenosotros3 from "../../imagenes/Sobrenosotros3.png";
import Sobrenosotros5 from "../../imagenes/Sobrenosotros5.jpg";
import logo from "../../imagenes//logo.png";

function SobreNosotros() {
    return (
        <div className="nosotros-container">
           
            {/* Nuestra Historia */}
            <section className="historia-section">
                <div className="historia-content">
                    <div className="historia-text">
                        <h2>Nuestra Historia</h2>
                        <p>
                            Fundada en el corazón de la ciudad, MOYBE nació de la pasión compartida por los animales 
                            de nuestros fundadores. Lo que comenzó como un pequeño consultorio hoy es un centro 
                            veterinario de referencia, combinando tecnología de punta con un trato cálido y personalizado.
                        </p>
                        <p>
                            Cada día, más de 100 mascotas reciben atención en nuestras instalaciones, y lo que más 
                            nos enorgullece es ver cómo crecemos junto a las familias que confían en nosotros.
                        </p>
                    </div>
                    <div className="historia-image">
                        <img src={Sobrenosotros1} alt="Equipo de MOYBE Veterinaria" />
                    </div>
                </div>
            </section>

            {/* Misión y Visión */}
            <section className="mision-vision-section">
               <div
                    className="mv-card"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${Sobrenosotros2})`
                    }}
                  >
                    <h3>Nuestra Misión</h3>
                    <p>
                        Proporcionar atención veterinaria excepcional que mejore la calidad de vida de las mascotas, 
                        educando a sus dueños y manteniendo los más altos estándares éticos y profesionales.
                    </p>
                </div>
                    <div
                        className="mv-card"
                        style={{
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${Sobrenosotros3})`
                        }}
                      >
                    <h3>Nuestra Visión</h3>
                    <p>
                        Ser reconocidos como el centro veterinario líder en innovación y cuidado compasivo, 
                        donde cada mascota recibe tratamiento como si fuera parte de nuestra propia familia.
                    </p>
                </div>
            </section>

            {/* Nuestro Equipo - Versión minimalista */}
            <section className="equipo-section">
                <div className="equipo-container">
                    <h2 className="section-title">Nuestro Equipo Veterinario</h2>
                    <p className="section-subtitle">Profesionales dedicados al cuidado de tus mascotas</p>
                    
                    <div className="equipo-grid-minimalista">
                        {/* Veterinarios originales */}
                        <div className="vet-card-minimalista">
                            <h3 className="vet-nombre">Dra. María López</h3>
                            <p className="vet-especialidad">Cirugía Veterinaria</p>
                            <p className="vet-experiencia">15 años de experiencia</p>
                            <div className="vet-divider"></div>
                            <p className="vet-descripcion">Especialista en procedimientos quirúrgicos complejos y rehabilitación postoperatoria.</p>
                        </div>
                        
                        <div className="vet-card-minimalista">
                            <h3 className="vet-nombre">Dr. Juan Pérez</h3>
                            <p className="vet-especialidad">Medicina Interna</p>
                            <p className="vet-experiencia">12 años de experiencia</p>
                            <div className="vet-divider"></div>
                            <p className="vet-descripcion">Experto en diagnóstico y tratamiento de enfermedades complejas.</p>
                        </div>
                        
                        <div className="vet-card-minimalista">
                            <h3 className="vet-nombre">Dra. Ana García</h3>
                            <p className="vet-especialidad">Dermatología</p>
                            <p className="vet-experiencia">10 años de experiencia</p>
                            <div className="vet-divider"></div>
                            <p className="vet-descripcion">Especialista en alergias, enfermedades de piel y tratamientos dermatológicos.</p>
                        </div>
                        
                        <div className="vet-card-minimalista">
                            <h3 className="vet-nombre">Dr. Carlos Rodríguez</h3>
                            <p className="vet-especialidad">Oftalmología</p>
                            <p className="vet-experiencia">8 años de experiencia</p>
                            <div className="vet-divider"></div>
                            <p className="vet-descripcion">Experto en salud ocular y cirugías oftalmológicas para mascotas.</p>
                        </div>
                        
                        <div className="vet-card-minimalista">
                            <h3 className="vet-nombre">Dra. Laura Martínez</h3>
                            <p className="vet-especialidad">Nutrición Animal</p>
                            <p className="vet-experiencia">6 años de experiencia</p>
                            <div className="vet-divider"></div>
                            <p className="vet-descripcion">Especialista en dietas personalizadas y manejo nutricional.</p>
                        </div>

                        {/* Nuevos veterinarios agregados */}
                        <div className="vet-card-minimalista">
                            <h3 className="vet-nombre">Dr. Luis Fernández</h3>
                            <p className="vet-especialidad">Cardiología</p>
                            <p className="vet-experiencia">9 años de experiencia</p>
                            <div className="vet-divider"></div>
                            <p className="vet-descripcion">Experto en diagnóstico y tratamiento de enfermedades cardíacas en animales.</p>
                        </div>

                        <div className="vet-card-minimalista">
                            <h3 className="vet-nombre">Dra. Sofía Ramírez</h3>
                            <p className="vet-especialidad">Oncología</p>
                            <p className="vet-experiencia">7 años de experiencia</p>
                            <div className="vet-divider"></div>
                            <p className="vet-descripcion">Especialista en diagnóstico y tratamiento del cáncer en mascotas.</p>
                        </div>

                        <div className="vet-card-minimalista">
                            <h3 className="vet-nombre">Dr. Javier Morales</h3>
                            <p className="vet-especialidad">Medicina de Emergencias</p>
                            <p className="vet-experiencia">11 años de experiencia</p>
                            <div className="vet-divider"></div>
                            <p className="vet-descripcion">Experto en atención de urgencias y cuidados intensivos veterinarios.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instalaciones */}
            <section className="instalaciones-section">
                <div className="instalaciones-image">
                    <img src={logo} alt="Instalaciones MOYBE" />
                </div>
                <div className="instalaciones-content">
                    <h2>Nuestras Instalaciones</h2>
                    <p>
                        En MOYBE hemos creado un espacio diseñado específicamente para el confort y seguridad 
                        de tus mascotas. Contamos con:
                    </p>
                    <ul>
                        <li>Quirófanos equipados con tecnología de última generación</li>
                        <li>Área de hospitalización con monitoreo 24/7</li>
                        <li>Laboratorio clínico propio para resultados inmediatos</li>
                        <li>Sala de rehabilitación física</li>
                        <li>Zonas separadas para perros y gatos</li>
                    </ul>
                </div>
            </section>

            {/* Tecnología */}
            <div
                    className="mv-card"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${Sobrenosotros5})`
                    }}
                  >
                <div className="tech-content">
                    <h2>Tecnología al Servicio de la Salud Animal</h2>
                    <p>
                        Invertimos continuamente en equipamiento de vanguardia para ofrecer diagnósticos precisos 
                        y tratamientos más efectivos. Desde ecógrafos de alta resolución hasta equipos de 
                        anestesia monitorizada, todo pensado para la seguridad de tus mascotas.
                    </p>
                </div>
            </div>

            {/* Valores */}
            <section className="valores-section">
                <h2 className="section-title">Nuestros Valores</h2>
                <div className="valores-grid">
                    <div className="valor-card">
                        <div className="valor-icon">❤️</div>
                        <h3>Compasión</h3>
                        <p>Tratamos a cada mascota con el mismo amor que nos gustaría para nuestros propios animales.</p>
                    </div>
                    <div className="valor-card">
                        <div className="valor-icon">🔬</div>
                        <h3>Excelencia</h3>
                        <p>Mantenemos los más altos estándares médicos mediante educación continua y práctica basada en evidencia.</p>
                    </div>
                    <div className="valor-card">
                        <div className="valor-icon">🤝</div>
                        <h3>Integridad</h3>
                        <p>Honestidad y transparencia en cada diagnóstico, tratamiento y presupuesto.</p>
                    </div>
                    <div className="valor-card">
                        <div className="valor-icon">🌱</div>
                        <h3>Innovación</h3>
                        <p>Adopción temprana de tecnologías y técnicas que beneficien a nuestros pacientes.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}


export default SobreNosotros;
