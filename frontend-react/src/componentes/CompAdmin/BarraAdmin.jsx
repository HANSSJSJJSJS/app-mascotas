// BarraAdmin.jsx
import React from 'react';
import { Home, Calendar, Users, Briefcase, Stethoscope, Bone, Clock, History, Gift } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../../stylos/cssAdmin/BarraLateral.css';

const BarraAdmin = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, text: 'Inicio', path: '/PanelPri' },
    { icon: Calendar, text: 'Citas', path: '/ModuloCitas' },
    { icon: Users, text: 'Usuarios', path: '/TablaUsuarios' },
    { icon: Briefcase, text: 'Servicios', path: '/ModuloEspecialidades' },
    { icon: Stethoscope, text: 'Veterinarios', path: '/ModuloEspecialistas' },
    { icon: Bone, text: 'Mascotas', path: '/PanelPri' }, // ejemplo
    { icon: Clock, text: 'Horarios', path: '/ModuloHorarios' },
    { icon: History, text: 'Historial Clínico', path: '/PanelPri' }, // ejemplo
  ];

  return (
    <aside className="barra-lateral">
      <h2>MENU</h2>
      <nav>
        <ul className="menu-lateral">
          {menuItems.map(({ icon: Icon, text, path }) => (
            <li
              key={text}
              className={location.pathname === path ? 'active' : ''}
            >
              <Link to={path} className="link">
                <Icon />
                <span>{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="icono-regalo">
        <Gift size={50} />
      </div>
    </aside>
  );
};

export default BarraAdmin;
