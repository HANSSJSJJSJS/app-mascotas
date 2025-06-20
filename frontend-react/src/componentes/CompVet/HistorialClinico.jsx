import { useState, useEffect } from 'react';
import ViewHistorialModal from '../CompVet/ViewHistorialModal';
import { PlusCircle, Search, Eye } from 'react-bootstrap-icons';
import Ban from 'react-bootstrap-icons/dist/icons/ban';
import CheckCircle from 'react-bootstrap-icons/dist/icons/check-circle';
import '../../stylos/cssVet/HistorialClinico.css';

const HistorialClinico = () => {
  const [historiales, setHistoriales] = useState([]);
  const [filteredHistoriales, setFilteredHistoriales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedHistorial, setSelectedHistorial] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

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



  return (
    <div className="historial-clinico-container">
      <div className="header-section">
        <div className="header-content">
          <h1 className="main-title">Gestión de Historiales Clínicos</h1>
          <p className="subtitle">Sistema de gestión veterinaria</p>
        </div>
        <button 
          className="create-button"
          onClick={() => setShowCreateForm(true)}
        >
          <PlusCircle className="icon" />
          Crear Historial
        </button>
      </div>

      <div className="search-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre de mascota, propietario o especie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de historiales */}
      <div className="historiales-list">
        {filteredHistoriales.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">
                <PlusCircle />
              </div>
              <h3>No hay historiales clínicos</h3>
              <p>
                Comienza creando el primer historial clínico para una mascota
              </p>
              <button 
                className="create-first-button"
                onClick={() => setShowCreateForm(true)}
              >
                Crear primer historial
              </button>
            </div>
          </div>
        ) : (
          filteredHistoriales.map((historial) => (
            <div 
              key={historial.id}
              className="historial-card"
            >
              <div className="card-header">
                <div className="pet-info">
                  <div className="pet-main-info">
                    <h2 className="pet-name">
                      {historial.mascota.nombre}
                      <span className={`status-badge ${historial.activo ? 'active' : 'inactive'}`}>
                        {historial.activo ? "Activo" : "Inactivo"}
                      </span>
                    </h2>
                    <p className="pet-details">
                      {historial.mascota.especie} • {historial.mascota.raza} • {historial.mascota.edad} años
                    </p>
                  </div>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewHistorial(historial)}
                      title="Ver historial"
                    >
                      <Eye />
                    </button>
                    <button 
                      className={`action-btn ${historial.activo ? 'deactivate-btn' : 'activate-btn'}`}
                      onClick={() => toggleHistorialStatus(historial.id)}
                      title={historial.activo ? "Desactivar" : "Activar"}
                    >
                      {historial.activo ? <Ban /> : <CheckCircle />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Propietario:</span>
                    <p className="info-value">{historial.mascota.propietario}</p>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Teléfono:</span>
                    <p className="info-value">{historial.mascota.telefono}</p>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Peso:</span>
                    <p className="info-value">{historial.mascota.peso} kg</p>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Consultas:</span>
                    <p className="info-value">{historial.consultas.length}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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