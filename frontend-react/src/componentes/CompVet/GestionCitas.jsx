import { useState, useEffect } from "react";
import '../../stylos/cssVet/GestionCitas.css';
import FormularioCita from "../CompVet/FormularioCita";

const HORARIOS_DISPONIBLES = ["09:00", "11:00", "13:00", "15:00", "17:00"];

const GestionCitas = () => {
  const [citas, setCitas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetch("http://localhost:3001/api/citas")
      .then((res) => res.json())
      .then((data) => {
        setCitas(data);
      })
      .catch((error) => {
        console.error("Error al obtener citas:", error);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const openNewAppointmentModal = () => {
    setShowModal(true);
  };

  const handleStatusChange = (id, newStatus) => {
    setCitas((prev) => prev.map((cita) => (cita.id === id ? { ...cita, estado: newStatus } : cita)));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
      setCitas((prev) => prev.filter((cita) => cita.id !== id));
    }
  };

  const filteredCitas = citas?.filter((cita) => {
    const matchesSearch =
      cita.mascota?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.prop_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.motivo?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = filterEstado === "todos" || cita.estado === filterEstado;
    const matchesTipo = filterTipo === "todos" || cita.tipo === filterTipo;

    return matchesSearch && matchesEstado && matchesTipo;
  });

  const today = new Date().toISOString().split("T")[0];
  const stats = {
    hoy: citas.filter((c) => c.fecha === today).length,
    pendientes: citas.filter((c) => c.estado === "pendiente").length,
    completadas: citas.filter((c) => c.estado === "completada").length,
    urgentes: citas.filter((c) => c.prioridad === "urgente").length,
  };

  const tiposConsulta = {
    "Consulta General": citas.filter((c) => c.tipo === "Consulta General").length,
    Emergencia: citas.filter((c) => c.tipo === "Emergencia").length,
    Control: citas.filter((c) => c.tipo === "Control").length,
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case "pendiente": return "⏳";
      case "confirmada": return "✅";
      case "completada": return "🏁";
      case "cancelada": return "❌";
      default: return "📋";
    }
  };

  const getPriorityIcon = (prioridad) => {
    switch (prioridad) {
      case "urgente": return "🚨";
      case "alta": return "⚡";
      case "media": return "📋";
      case "baja": return "📝";
      default: return "📋";
    }
  };

  return (
    <div className="vet-container">
      <header className="vet-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="main-title">🏥 Gestión de Citas Veterinarias</h1>
            <p className="subtitle">
              {currentTime.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} -
              {currentTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button className="btn-new-appointment" onClick={openNewAppointmentModal}>
            ➕ Nueva Cita
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card stat-today"><div className="stat-icon">📅</div><div className="stat-content"><h3>{stats.hoy}</h3><p>Citas Hoy</p></div></div>
        <div className="stat-card stat-pending"><div className="stat-icon">⏳</div><div className="stat-content"><h3>{stats.pendientes}</h3><p>Pendientes</p></div></div>
        <div className="stat-card stat-completed"><div className="stat-icon">✅</div><div className="stat-content"><h3>{stats.completadas}</h3><p>Completadas</p></div></div>
        <div className="stat-card stat-urgent"><div className="stat-icon">🚨</div><div className="stat-content"><h3>{stats.urgentes}</h3><p>Urgentes</p></div></div>
      </section>


      <section className="filters-section">
        <div className="filters-container">
          <div className="search-container">
            <input type="text" placeholder="🔍 Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
          </div>
          <div className="filter-selects">
            <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="filter-select">
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} className="filter-select">
              <option value="todos">Todos los tipos</option>
              <option value="Consulta General">Consulta General</option>
              <option value="Emergencia">Emergencia</option>
              <option value="Control">Control</option>
            </select>
          </div>
        </div>
      </section>

      <section className="appointments-section">
        <div className="section-header"><h2>📋 Listado de Citas ({filteredCitas.length})</h2></div>
        <div className="appointments-container">
          {filteredCitas.length > 0 ? (
            <div className="appointments-grid">
              {filteredCitas.map((cita) => (
                <div key={cita.id} className={`appointment-card priority-${cita.prioridad}`}>
                  <div className="appointment-header"><h3>{cita.mascota}</h3></div>
                  <div className="appointment-details">
                    <div className="detail-section"><h4>Propietario</h4><p>{cita.prop_nombre}</p></div>
                    <div className="detail-section"><h4>Teléfono</h4><p>{cita.prop_telefono}</p></div>
                    <div className="detail-section"><h4>Email</h4><p>{cita.prop_email}</p></div>
                    <div className="detail-section"><h4>Fecha</h4><p>{cita.fecha}</p></div>
                    <div className="detail-section"><h4>Hora</h4><p>{cita.hora}</p></div>
                    <div className="detail-section"><h4>Estado</h4><p>{cita.estado}</p></div>
                    <div className="detail-section"><h4>Servicio</h4><p>{cita.servicio}</p></div>
                  </div>
                  <div className="appointment-footer">
                    <span className={`status-badge status-${cita.estado}`}>{getStatusIcon(cita.estado)} {cita.estado}</span>
                    <span className={`priority-badge priority-${cita.prioridad}`}>{getPriorityIcon(cita.prioridad)} {cita.prioridad}</span>
                    <div className="appointment-actions">
                      <select value={cita.estado} onChange={(e) => handleStatusChange(cita.id, e.target.value)} className="status-select">
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                      <button className="btn-delete" onClick={() => handleDelete(cita.id)}>🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <div className="no-appointments-icon">🔍</div>
              <h3>No se encontraron citas</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
              <button className="btn-new-appointment" onClick={openNewAppointmentModal}>➕ Crear Nueva Cita</button>
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Nueva Cita</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>❌</button>
            </div>
            <FormularioCita
              onSubmit={(nuevaCita) => {
                fetch("http://localhost:3001/api/citas", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(nuevaCita)
                })
                  .then(res => res.json())
                  .then((data) => {
                    setCitas((prev) => [...prev, data]);
                    setShowModal(false);
                  })
                  .catch((err) => console.error("Error al guardar cita:", err));
              }}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCitas;
