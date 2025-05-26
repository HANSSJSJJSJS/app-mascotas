import { Bell, Calendar, Clipboard, PawPrint, User, Home, Clock, ChevronRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { Link } from 'react-router-dom';
import "../../stylos/cssPropietario/InicioPropietario.css"

export default function InicioPropietario() {
  // Obtener la fecha actual para mostrarla en el encabezado
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('es-ES', options);
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-white"> {/* Fondo blanco */}
      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6"> {/* Centrado con margen automático y padding */}
        <div className="page-content">
          {/* Encabezado de bienvenida */}
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

          {/* Dashboard content */}
          <div className="dashboard-grid">
            <div>
              {/* Resumen */}
              <div className="dashboard-section">
                <h3 className="section-title">Resumen</h3>
                <div className="stats-container">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <PawPrint size={18} />
                    </div>
                    <div className="stat-info">
                      <h3>Mascotas</h3>
                      <div className="stat-value">2</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <Calendar size={18} />
                    </div>
                    <div className="stat-info">
                      <h3>Próximas citas</h3>
                      <div className="stat-value">2</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <Bell size={18} />
                    </div>
                    <div className="stat-info">
                      <h3>Recordatorios</h3>
                      <div className="stat-value">2</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Próximas citas */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h3 className="section-title">Próximas citas</h3>
                  <button className="view-all-button">
                    Ver todas <ChevronRight size={16} />
                  </button>
                </div>
                <div className="appointments-container">
                  <div className="appointment-card today">
                    <div className="appointment-icon">
                      <Calendar size={18} />
                    </div>
                    <div className="appointment-details">
                      <h3>Vacunación - Max</h3>
                      <div className="appointment-date">
                        <CalendarIcon size={14} className="mini-icon" />
                        <span>miércoles, 14 de junio de 2023</span>
                      </div>
                      <div className="appointment-time">
                        <ClockIcon size={14} className="mini-icon" />
                        <span>10:30 - Dr. García</span>
                      </div>
                    </div>
                    <div className="appointment-actions">
                      <button className="action-button">Confirmar</button>
                    </div>
                  </div>

                  <div className="appointment-card">
                    <div className="appointment-icon">
                      <Calendar size={18} />
                    </div>
                    <div className="appointment-details">
                      <h3>Control - Luna</h3>
                      <div className="appointment-date">
                        <CalendarIcon size={14} className="mini-icon" />
                        <span>miércoles, 21 de junio de 2023</span>
                      </div>
                      <div className="appointment-time">
                        <ClockIcon size={14} className="mini-icon" />
                        <span>15:00 - Dra. Rodríguez</span>
                      </div>
                    </div>
                    <div className="appointment-actions">
                      <button className="action-button">Confirmar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* Mis mascotas */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h3 className="section-title">Mis mascotas</h3>
                  <button className="view-all-button">
                    Ver todas <ChevronRight size={16} />
                  </button>
                </div>
                <div className="pets-container">
                  <div className="pet-card">
                    <div className="pet-image-container">
                      <PawPrint size={20} className="text-white" />
                    </div>
                    <div className="pet-details">
                      <h4 className="pet-name">Max</h4>
                      <p className="pet-breed">Perro - Labrador</p>
                      <p className="pet-age">3 años</p>
                    </div>
                    <button className="pet-details-button">
                      Ver ficha <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="pet-card">
                    <div className="pet-image-container">
                      <PawPrint size={20} className="text-white" />
                    </div>
                    <div className="pet-details">
                      <h4 className="pet-name">Luna</h4>
                      <p className="pet-breed">Gato - Siamés</p>
                      <p className="pet-age">2 años</p>
                    </div>
                    <button className="pet-details-button">
                      Ver ficha <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="add-pet-card">
                    <span className="add-icon">+</span>
                    <span>Agregar mascota</span>
                  </div>
                </div>
              </div>

              {/* Recordatorios */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h3 className="section-title">Recordatorios</h3>
                  <button className="view-all-button">
                    Ver todos <ChevronRight size={16} />
                  </button>
                </div>
                <div className="reminders-container">
                  <div className="reminder-card today">
                    <div className="reminder-icon">
                      <Bell size={18} />
                    </div>
                    <div className="reminder-details">
                      <h4 className="reminder-text">Desparasitación de Max</h4>
                      <div className="reminder-date">
                        <CalendarIcon size={14} className="mini-icon" />
                        <span>viernes, 9 de junio de 2023</span>
                      </div>
                    </div>
                  </div>

                  <div className="reminder-card">
                    <div className="reminder-icon">
                      <Bell size={18} />
                    </div>
                    <div className="reminder-details">
                      <h4 className="reminder-text">Comprar alimento para Luna</h4>
                      <div className="reminder-date">
                        <CalendarIcon size={14} className="mini-icon" />
                        <span>miércoles, 7 de junio de 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
