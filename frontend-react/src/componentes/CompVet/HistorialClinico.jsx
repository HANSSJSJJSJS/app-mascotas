import { useState, useEffect } from 'react';
import ViewHistorialModal from '../CompVet/ViewHistorialModal';
import { PlusCircle, Search, Eye } from 'react-bootstrap-icons';
import Ban from 'react-bootstrap-icons/dist/icons/ban';
import CheckCircle from 'react-bootstrap-icons/dist/icons/check-circle';

const HistorialClinico = () => {
  const [historiales, setHistoriales] = useState([]);
  const [filteredHistoriales, setFilteredHistoriales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedHistorial, setSelectedHistorial] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedHistoriales = localStorage.getItem('historiales-veterinaria');
    if (savedHistoriales) {
      const parsed = JSON.parse(savedHistoriales);
      setHistoriales(parsed);
      setFilteredHistoriales(parsed);
    } else {
      // Datos de ejemplo
      const historialesEjemplo = [
        {
          id: "1",
          mascota: {
            nombre: "Max",
            especie: "Perro",
            raza: "Golden Retriever",
            edad: 3,
            peso: 28.5,
            propietario: "María González",
            telefono: "+57 300 123 4567",
          },
          consultas: [
            {
              id: "1-1",
              fecha: "2024-01-15",
              motivo: "Consulta de rutina",
              diagnostico: "Salud excelente",
              tratamiento: "Vacuna múltiple",
              veterinario: "Ana Rodríguez",
              observaciones: "Próxima cita en 6 meses",
            },
          ],
          activo: true,
          fechaCreacion: "2024-01-15T10:30:00.000Z",
        }
      ];
      setHistoriales(historialesEjemplo);
      setFilteredHistoriales(historialesEjemplo);
      localStorage.setItem('historiales-veterinaria', JSON.stringify(historialesEjemplo));
    }
  }, []);

  // Filtrar historiales
  useEffect(() => {
    const filtered = historiales.filter(
      (historial) =>
        historial.mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        historial.mascota.propietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        historial.mascota.especie.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistoriales(filtered);
  }, [searchTerm, historiales]);

  const saveToLocalStorage = (newHistoriales) => {
    localStorage.setItem('historiales-veterinaria', JSON.stringify(newHistoriales));
    setHistoriales(newHistoriales);
  };

  const handleCreateHistorial = (newHistorial) => {
    const updatedHistoriales = [...historiales, newHistorial];
    saveToLocalStorage(updatedHistoriales);
    setShowCreateForm(false);
  };

  const toggleHistorialStatus = (id) => {
    const updatedHistoriales = historiales.map((h) => 
      h.id === id ? { ...h, activo: !h.activo } : h
    );
    saveToLocalStorage(updatedHistoriales);
  };

  const handleViewHistorial = (historial) => {
    setSelectedHistorial(historial);
    setShowViewModal(true);
  };

  // Estadísticas
  const stats = {
    total: historiales.length,
    activos: historiales.filter(h => h.activo).length,
    inactivos: historiales.filter(h => !h.activo).length,
    conConsultas: historiales.filter(h => h.consultas.length > 0).length,
  };

  const getAnimalIcon = (especie) => {
    switch (especie.toLowerCase()) {
      case "perro":
        return "🐕";
      case "gato":
        return "🐱";
      case "ave":
        return "🐦";
      case "conejo":
        return "🐰";
      case "hamster":
        return "🐹";
      default:
        return "🐾";
    }
  };

  const getStatusIcon = (activo) => {
    return activo ? "✅" : "❌";
  };

  return (
    <div className="vet-container">
      {/* Header */}
      <header className="vet-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="main-title">🏥 Gestión de Historiales Clínicos</h1>
            <p className="subtitle">
              {currentTime.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              -{" "}
              {currentTime.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card stat-today">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Historiales Totales</p>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.activos}</h3>
            <p>Activos</p>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{stats.inactivos}</h3>
            <p>Inactivos</p>
          </div>
        </div>
        <div className="stat-card stat-urgent">
          <div className="stat-icon">🏥</div>
          <div className="stat-content">
            <h3>{stats.conConsultas}</h3>
            <p>Con Consultas</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Buscar por mascota, propietario o especie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </section>

      {/* Historiales List */}
      <section className="appointments-section">
        <div className="section-header">
          <h2>📋 Listado de Historiales ({filteredHistoriales.length})</h2>
        </div>

        <div className="appointments-container">
          {filteredHistoriales.length > 0 ? (
            <div className="appointments-grid">
              {filteredHistoriales.map((historial) => (
                <div key={historial.id} className={`appointment-card ${historial.activo ? 'active' : 'inactive'}`}>
                  <div className="appointment-header">
                    <div className="pet-info">
                      <span className="animal-icon">{getAnimalIcon(historial.mascota.especie)}</span>
                      <div>
                        <h3>{historial.mascota.nombre}</h3>
                        <p>
                          {historial.mascota.especie} • {historial.mascota.raza} • {historial.mascota.edad} años
                        </p>
                      </div>
                    </div>
                    <div className="appointment-status">
                      <span className={`status-badge ${historial.activo ? 'status-confirmada' : 'status-cancelada'}`}>
                        {getStatusIcon(historial.activo)} {historial.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>

                  <div className="appointment-body">
                    <div className="info-row">
                      <span className="label">👤 Propietario:</span>
                      <span>{historial.mascota.propietario}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">📞 Teléfono:</span>
                      <span>{historial.mascota.telefono}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">⚖️ Peso:</span>
                      <span>{historial.mascota.peso} kg</span>
                    </div>
                    <div className="info-row">
                      <span className="label">🏥 Consultas:</span>
                      <span>{historial.consultas.length}</span>
                    </div>
                  </div>

                  <div className="appointment-actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleViewHistorial(historial)}
                      title="Ver historial"
                    >
                      <Eye /> Ver
                    </button>
                    <button 
                      className={`action-btn ${historial.activo ? 'btn-delete' : 'btn-save'}`}
                      onClick={() => toggleHistorialStatus(historial.id)}
                      title={historial.activo ? "Desactivar" : "Activar"}
                    >
                      {historial.activo ? <Ban /> : <CheckCircle />} 
                      {historial.activo ? " Desactivar" : " Activar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <div className="no-appointments-icon">🔍</div>
              <h3>No se encontraron historiales</h3>
              <p>Intenta ajustar los filtros de búsqueda o crea un nuevo historial</p>
              <button 
                className="create-first-button"
                onClick={() => setShowCreateForm(true)}
              >
                <PlusCircle className="icon" />
                Crear primer historial
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal para ver historial */}
      {showViewModal && selectedHistorial && (
        <ViewHistorialModal
          historial={selectedHistorial}
          onClose={() => {
            setShowViewModal(false);
            setSelectedHistorial(null);
          }}
        />
      )}
    </div>
  );
};

export default HistorialClinico;