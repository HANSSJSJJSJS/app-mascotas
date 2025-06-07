import { useEffect, useState } from 'react';
import {
  Bell, Calendar, PawPrint, Clock, ChevronRight, CalendarIcon, ClockIcon
} from 'lucide-react';
import axios from 'axios';
import "../../stylos/cssPropietario/InicioPropietario.css";

export default function InicioPropietario() {
  const [mascotas, setMascotas] = useState([]);
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const [citas, setCitas] = useState([]);
  const [recordatoriosPendientes, setRecordatoriosPendientes] = useState(0);

  useEffect(() => {
    // Formatear fecha y hora
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setFormattedDate(today.toLocaleDateString('es-ES', options));
    const hours = today.getHours();
    const minutes = today.getMinutes();
    setFormattedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);

    // Obtener mascotas del usuario
    const fetchMascotas = async () => {
      try {
        const usuarioActual = JSON.parse(localStorage.getItem("userData"));
        console.log(usuarioActual)
        if (!usuarioActual?.id_usuario) {
          console.error("ID de usuario no disponible");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/api/propietario/${usuarioActual.id_usuario}/mascotas`
        );
        setMascotas(response.data);
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
      }
    };

    const fetchCitas = async() => {
      try {
        const usuarioActual = JSON.parse(localStorage.getItem("userData"));
        console.log(usuarioActual)
        if (!usuarioActual?.id_usuario) {
          console.error("ID de usuario no disponible");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/api/propietario/${usuarioActual.id_usuario}/citas`
        );

        const citasObtenidas = response.data;
        setCitas(citasObtenidas);
        console.log(citasObtenidas)

        // Contar solo las pendientes
        const pendientes = citasObtenidas.filter(cita => cita.estado === "PENDIENTE").length;
        setRecordatoriosPendientes(pendientes);

      } catch (error) {
        console.error("Error al obtener mascotas:", error);
      }   
    };

    fetchMascotas();
    fetchCitas();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
        <div className="page-content">
          {/* Encabezado */}
          <div className="welcome-header">
            <div>
              <h2 className="welcome-title">Bienvenido a Moybe</h2>
              <div className="welcome-date">
                <Calendar size={16} className="mini-icon" />
                <span>{formattedDate}</span>
              </div>
            </div>
            <div className="welcome-time">
              <Clock size={16} className="time-icon" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Sección de resumen */}
          <div className="dashboard-section">
            <h3 className="section-title">Resumen</h3>
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon">
                  <PawPrint size={18} />
                </div>
                <div className="stat-info">
                  <h3>Mascotas</h3>
                  <div className="stat-value">{mascotas.length}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={18} />
                </div>
                <div className="stat-info">
                  <h3>Próximas citas</h3>
                  <div className="stat-value">{citas.length}</div> {/* Reemplazar con data real */}
                </div>
              </div>
            </div>
          </div>

          {/* Mis mascotas */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title">Mis mascotas</h3>
              <button className="view-all-button">
                Ver todas <ChevronRight size={16} />
              </button>
            </div>
            <div className="pets-container">
              {mascotas.map((mascota, index) => (
                <div key={index} className="pet-card">
                  <div className="pet-image-container">
                    <PawPrint size={20} className="text-white" />
                  </div>
                  <div className="pet-details">
                    <h4 className="pet-name">{mascota.nombre}</h4>
                    <p className="pet-breed">{mascota.especie} - {mascota.raza}</p>
                    <p className="pet-age">{mascota.edad} años</p>
                  </div>
                  <button className="pet-details-button">
                    Ver ficha <ChevronRight size={16} />
                  </button>
                </div>
              ))}

              {/* Card para agregar mascota */}
              <div className="add-pet-card">
                <span className="add-icon">+</span>
                <span>Agregar mascota</span>
              </div>
            </div>
          </div>

{/* Próximas citas dinámicas (pendientes y dentro de 3 días) */}
<div className="dashboard-section">
  <div className="section-header">
    <h3 className="section-title">Próximas citas</h3>
  </div>
  <div className="appointments-container">
    {citas && citas.length > 0 ? (
      citas
        .filter(cita => {
          if (cita.estado !== "PENDIENTE") return false;

          const hoy = new Date();
          const fechaCita = new Date(cita.fecha);
          // Calcular diferencia en días
          const diffTime = fechaCita - hoy;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return diffDays >= 0 && diffDays <= 4; //Dias antes de proxima cita esto es configurable
        })
        .map((cita, index) => (
          <div className="appointment-card today" key={index}>
            <div className="appointment-icon">
              <Calendar size={18} />
            </div>
            <div className="appointment-details">
              <h3>{cita.tipo} - {cita.nombre_mascota}</h3>
              <div className="appointment-date">
                <CalendarIcon size={14} className="mini-icon" />
                <span>
                  {new Date(cita.fecha).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="appointment-time">
                <ClockIcon size={14} className="mini-icon" />
                <span>{cita.hora} - {cita.veterinario}</span>
              </div>
            </div>
            <div className="appointment-actions">
              <button className="action-button">Confirmar</button>
            </div>
          </div>
        ))
    ) : (
      <p>No hay citas próximas pendientes.</p>
    )}
  </div>
</div>

        </div>
      </main>
    </div>
  );
}
