import { useState, useEffect } from 'react';
import ViewHistorialModal from '../CompVet/ViewHistorialModal';
import CreateHistorialModal from '../CompVet/CreateHistorialModal';
import { PlusCircle, Search, Eye } from 'react-bootstrap-icons';
import Ban from 'react-bootstrap-icons/dist/icons/ban';
import CheckCircle from 'react-bootstrap-icons/dist/icons/check-circle';
import { useNavigate } from "react-router-dom";
import '../../stylos/cssVet/ModalHistorial.css';
import '../../stylos/cssVet/HistorialClinico.css';


const HistorialClinico = () => {
  const [historiales, setHistoriales] = useState([]);
  const [filteredHistoriales, setFilteredHistoriales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedHistorial, setSelectedHistorial] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const cargarHistoriales = () => {
    fetch("http://localhost:3001/api/historiales")
      .then(res => res.json())
      .then(data => {
        const historialesFormateados = data.map(h => ({
          id: h.cod_his,
          cod_mas: h.cod_mas,
          mascota: {
            nombre: h.nom_mas,
            especie: h.especie,
            raza: h.raza,
            edad: h.edad,
            peso: h.peso,
            propietario: h.propietario,
            telefono: h.telefono,
          },
          motivo: h.descrip_his,
          tratamiento: h.tratamiento,
          fecha: h.fech_his,
          activo: true,
        }));
        setHistoriales(historialesFormateados);
        setFilteredHistoriales(historialesFormateados);
      })
      .catch(err => console.error("Error al obtener historiales:", err));
  };

  useEffect(() => {
    cargarHistoriales();
  }, []);

  useEffect(() => {
    const filtered = historiales.filter(
      (historial) =>
        historial.mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        historial.mascota.propietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        historial.mascota.especie.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistoriales(filtered);
  }, [searchTerm, historiales]);

  const handleCreateHistorial = (newHistorial) => {
    fetch("http://localhost:3001/api/historiales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fech_his: newHistorial.fecha,
        descrip_his: newHistorial.motivo,
        tratamiento: newHistorial.tratamiento,
        cod_mas: newHistorial.cod_mas
      })
    })
      .then(res => res.json())
      .then(() => {
        cargarHistoriales();
        setShowCreateForm(false);
      })
      .catch(err => console.error("Error al crear historial:", err));
  };

  const toggleHistorialStatus = (id) => {
    const updatedHistoriales = historiales.map((h) =>
      h.id === id ? { ...h, activo: !h.activo } : h
    );
    setHistoriales(updatedHistoriales);
  };

  const handleViewHistorial = (historial) => {
    setSelectedHistorial(historial);
    setShowViewModal(true);
  };

  const stats = {
    total: historiales.length,
    activos: historiales.filter(h => h.activo).length,
    inactivos: historiales.filter(h => !h.activo).length,
  };

  const getAnimalIcon = (especie) => {
    switch (especie.toLowerCase()) {
      case "perro": return "🐕";
      case "gato": return "🐱";
      case "ave": return "🐦";
      case "conejo": return "🐰";
      case "hamster": return "🐹";
      default: return "🐾";
    }
  };

  const getStatusIcon = (activo) => activo ? "✅" : "❌";

  return (
    <div className="vet-container">
      <header className="vet-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="main-title">🏥 Gestión de Historiales Clínicos</h1>
            <p className="subtitle">
              {currentTime.toLocaleDateString("es-ES", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })} - {currentTime.toLocaleTimeString("es-ES", {
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
          <button
            className="btn-new-appointment"
            onClick={() => navigate("/PanelVet/historial-clinico/nuevo/nuevo", { state: { fromHistorialClinico: true } })}
          >
            <PlusCircle /> Nuevo Historial
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card stat-today"><div className="stat-icon">📋</div><div className="stat-content"><h3>{stats.total}</h3><p>Historiales Totales</p></div></div>
        <div className="stat-card stat-pending"><div className="stat-icon">✅</div><div className="stat-content"><h3>{stats.activos}</h3><p>Activos</p></div></div>
        <div className="stat-card stat-completed"><div className="stat-icon">❌</div><div className="stat-content"><h3>{stats.inactivos}</h3><p>Inactivos</p></div></div>
      </section>

      <section className="filters-section">
        <div className="filters-container">
          <div className="search-container">
            <input type="text" placeholder="🔍 Buscar por mascota, propietario o especie..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
          </div>
        </div>
      </section>

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
                        <p>{historial.mascota.especie} • {historial.mascota.raza} • {historial.mascota.edad} años</p>
                      </div>
                    </div>
                    <div className="appointment-status">
                      <span className={`status-badge ${historial.activo ? 'status-confirmada' : 'status-cancelada'}`}>
                        {getStatusIcon(historial.activo)} {historial.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>

                  <div className="appointment-body">
                    <div className="info-row"><span className="label">👤 Propietario:</span><span>{historial.mascota.propietario}</span></div>
                    <div className="info-row"><span className="label">📞 Teléfono:</span><span>{historial.mascota.telefono}</span></div>
                    <div className="info-row"><span className="label">⚖️ Peso:</span><span>{historial.mascota.peso} kg</span></div>
                    <div className="info-row"><span className="label">📅 Fecha:</span><span>{new Date(historial.fecha).toLocaleDateString()}</span></div>
                    <div className="info-row"><span className="label">📝 Motivo:</span><span>{historial.motivo}</span></div>
                    <div className="info-row"><span className="label">💊 Tratamiento:</span><span>{historial.tratamiento}</span></div>
                  </div>

                  <div className="appointment-actions">
                    <button className="btn-edit" onClick={() => handleViewHistorial(historial)} title="Ver historial"><Eye /> Ver</button>
                    <button className={`action-btn ${historial.activo ? 'btn-delete' : 'btn-save'}`} onClick={() => toggleHistorialStatus(historial.id)} title={historial.activo ? "Desactivar" : "Activar"}>
                      {historial.activo ? <Ban /> : <CheckCircle />} {historial.activo ? " Desactivar" : " Activar"}
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
              <button className="create-first-button" onClick={() => setShowCreateForm(true)}>
                <PlusCircle className="icon" /> Crear primer historial
              </button>
            </div>
          )}
        </div>
      </section>

      {showViewModal && selectedHistorial && (
        <ViewHistorialModal
          historial={selectedHistorial}
          onClose={() => {
            setShowViewModal(false);
            setSelectedHistorial(null);
          }}
        />
      )}

      {showCreateForm && (
        <CreateHistorialModal
          onClose={() => setShowCreateForm(false)}
          onCreate={handleCreateHistorial}
        />
      )}
    </div>
  );
};

export default HistorialClinico;
