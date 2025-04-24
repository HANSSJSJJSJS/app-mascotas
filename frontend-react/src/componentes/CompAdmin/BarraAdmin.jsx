import React from 'react';
import { Home, Calendar, Users, Briefcase, Stethoscope, Bone, Clock, History, LogOut } from 'lucide-react';
import '../../stylos/cssAdmin/BarraLateral.css';

const BarraLateral = () => {
    return (
        <aside className="barra-lateral">
            <h2>MENU</h2>
            <nav>
                <ul className="menu-lateral">
                    {[
                        { icon: Home, text: 'Inicio' },
                        { icon: Calendar, text: 'Citas' },
                        { icon: Users, text: 'Usuarios', active: true },
                        { icon: Briefcase, text: 'Servicios' },
                        { icon: Stethoscope, text: 'Veterinarios' },
                        { icon: Bone, text: 'Mascotas' },
                        { icon: Clock, text: 'Horarios' },
                        { icon: History, text: 'Historial Clínico' },
                    ].map(({ icon: Icon, text, active }) => (
                        <li 
                            key={text} 
                            className={active ? 'active' : ''}
                        >
                            <a href="#">
                                <Icon />
                                <span>{text}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            
            <div className="close-sesion">
                <a href="#" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <LogOut size={16} />
                    <h3>Cerrar Sesión</h3>
                </a>
            </div>
        </aside>
    );
};

export default BarraLateral;