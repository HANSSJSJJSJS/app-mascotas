import { useState, useEffect } from "react";
import '../../stylos/cssVet/GestionCitas.css';

// Horarios disponibles
const HORARIOS_DISPONIBLES = ["09:00", "11:00", "13:00", "15:00", "17:00"];

const GestionCitas = () => {
  const [citas, setCitas] = useState([]);

useEffect(() => {
  fetch("http://localhost:3001/api/citas")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setCitas(data);
    })
    .catch((error) => {
      console.error("Error al obtener citas:", error);
    });
}, []);
useEffect(() => {
  // Datos que quieres enviar en el cuerpo del POST
  const nuevaCita = {
    nombre: "Juan Pérez",
    fecha: "2025-07-01",
    hora: "10:00",
    motivo: "Consulta médica"
  };

  fetch("http://localhost:3001/api/citas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaCita)
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Cita creada:", data);
    })
    .catch((error) => {
      console.error("Error al crear la cita:", error);
    });
}, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingCita, setEditingCita] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [errors, setErrors] = useState({});

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Formulario para nueva cita o edición
  const [formData, setFormData] = useState({
    mascota: "",
    propietario: "",
    fecha: "",
    hora: "",
    tipo: "Consulta General",
    prioridad: "media",
    motivo: "",
    tipoMascota: "perro",
    raza: "",
    telefono: "",
    email: "",
  });

  const resetForm = () => {
    setFormData({
      mascota: "",
      propietario: "",
      fecha: "",
      hora: "",
      tipo: "Consulta General",
      prioridad: "media",
      motivo: "",
      tipoMascota: "perro",
      raza: "",
      telefono: "",
      email: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];
    
    if (!formData.mascota) newErrors.mascota = "Nombre de mascota requerido";
    if (!formData.propietario) newErrors.propietario = "Propietario requerido";
    if (!formData.fecha) {
      newErrors.fecha = "Fecha requerida";
    } else if (formData.fecha < today) {
      newErrors.fecha = "No se pueden agendar citas en fechas pasadas";
    }
    if (!formData.hora) newErrors.hora = "Hora requerida";
    if (!formData.telefono) newErrors.telefono = "Teléfono requerido";
    if (!formData.email) newErrors.email = "Email requerido";
    if (!formData.motivo) newErrors.motivo = "Motivo requerido";
    
    // Validar que no haya citas duplicadas en misma fecha y hora
    const citaExistente = citas.find(c => 
      c.fecha === formData.fecha && 
      c.hora === formData.hora &&
      (!editingCita || c.id !== editingCita.id)
    );
    
    if (citaExistente) {
      newErrors.hora = "Ya existe una cita programada para esta fecha y hora";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (editingCita) {
      // Editar cita existente
      setCitas((prev) =>
        prev.map((cita) =>
          cita.id === editingCita.id ? { ...formData, id: editingCita.id, estado: editingCita.estado } : cita,
        ),
      );
    } else {
      // Crear nueva cita
      const nuevaCita = {
        ...formData,
        id: Date.now().toString(),
        estado: "pendiente",
      };
      setCitas((prev) => [...prev, nuevaCita]);
    }

    setShowModal(false);
    setEditingCita(null);
    resetForm();
  };

  const handleEdit = (cita) => {
    setEditingCita(cita);
    setFormData({ ...cita });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
      setCitas((prev) => prev.filter((cita) => cita.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setCitas((prev) => prev.map((cita) => (cita.id === id ? { ...cita, estado: newStatus } : cita)));
  };

  const openNewAppointmentModal = () => {
    resetForm();
    setEditingCita(null);
    setShowModal(true);
  };

  // Filtrar citas
  const filteredCitas = citas?.filter((cita) => {
    const matchesSearch =
      cita.mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.propietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.motivo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = filterEstado === "todos" || cita.estado === filterEstado;
    const matchesTipo = filterTipo === "todos" || cita.tipo === filterTipo;

    return matchesSearch && matchesEstado && matchesTipo;
  });

  // Estadísticas
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
      case "pendiente":
        return "⏳";
      case "confirmada":
        return "✅";
      case "completada":
        return "🏁";
      case "cancelada":
        return "❌";
      default:
        return "📋";
    }
  };

  const getPriorityIcon = (prioridad) => {
    switch (prioridad) {
      case "urgente":
        return "🚨";
      case "alta":
        return "⚡";
      case "media":
        return "📋";
      case "baja":
        return "📝";
      default:
        return "📋";
    }
  };

  const getAnimalIcon = (tipo) => {
    switch (tipo) {
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

  return (
    <div className="vet-container">
      {/* Header */}
      <header className="vet-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="main-title">🏥 Gestión de Citas Veterinarias</h1>
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
          <button className="btn-new-appointment" onClick={openNewAppointmentModal}>
            ➕ Nueva Cita
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card stat-today">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.hoy}</h3>
            <p>Citas Hoy</p>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendientes}</h3>
            <p>Pendientes</p>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completadas}</h3>
            <p>Completadas</p>
          </div>
        </div>
        <div className="stat-card stat-urgent">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>{stats.urgentes}</h3>
            <p>Urgentes</p>
          </div>
        </div>
      </section>

      {/* Consultation Types */}
      <section className="consultation-types">
        <h2>📊 Distribución por Tipo de Consulta</h2>
        <div className="types-grid">
          <div className="type-card">
            <div className="type-number">{tiposConsulta["Consulta General"]}</div>
            <div className="type-label">Consulta General</div>
          </div>
          <div className="type-card">
            <div className="type-number">{tiposConsulta["Emergencia"]}</div>
            <div className="type-label">Emergencia</div>
          </div>
          <div className="type-card">
            <div className="type-number">{tiposConsulta["Control"]}</div>
            <div className="type-label">Control</div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Buscar por mascota, propietario o motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
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

      {/* Appointments Table */}
      <section className="appointments-section">
        <div className="section-header">
          <h2>📋 Listado de Citas ({filteredCitas.length})</h2>
        </div>

        <div className="appointments-container">
          {filteredCitas.length > 0 ? (
            <div className="appointments-grid">
              {filteredCitas.map((cita) => (
                <div key={cita.id} className={`appointment-card priority-${cita.prioridad}`}>
                  <div className="appointment-header">
                    <h3>{cita.mascota}</h3>
                    <span className="animal-type">{getAnimalIcon(cita.tipoMascota)} {cita.tipoMascota} - {cita.raza}</span>
                  </div>

                  <div className="appointment-details">
                    <div className="detail-section">
                      {console.log(citas)}
                      <h4>Propietario</h4>
                      <p>{cita.prop_nombre}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Teléfono</h4>
                      <p>{cita.prop_telefono}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Email</h4>
                      <p>{cita.prop_email}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Fecha</h4>
                      <p>{cita.fecha}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Hora</h4>
                      <p>{cita.hora}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Estado</h4>
                      <p>{cita.estado}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Servicio</h4>
                      <p>{cita.servicio}</p>
                    </div>
                  </div>

                  <div className="appointment-footer">
                    <div className="status-info">
                      <span className={`status-badge status-${cita.estado}`}>
                        {getStatusIcon(cita.estado)} {cita.estado}
                      </span>
                      <span className={`priority-badge priority-${cita.prioridad}`}>
                        {getPriorityIcon(cita.prioridad)} {cita.prioridad}
                      </span>
                    </div>

                    <div className="appointment-actions">
                      <select
                        value={cita.estado}
                        onChange={(e) => handleStatusChange(cita.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                      <button className="btn-edit" onClick={() => handleEdit(cita)} title="Editar cita">
                        ✏️
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(cita.id)} title="Eliminar cita">
                        🗑️
                      </button>
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
              <button className="btn-new-appointment" onClick={openNewAppointmentModal}>
                ➕ Crear Nueva Cita
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCita ? "✏️ Editar Cita" : "➕ Nueva Cita"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ❌
              </button>
            </div>

            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>🐾 Nombre de la Mascota</label>
                  <input 
                    type="text" 
                    name="mascota" 
                    value={formData.mascota} 
                    onChange={handleInputChange} 
                    required 
                  />
                  {errors.mascota && <span className="error-message">{errors.mascota}</span>}
                </div>

                <div className="form-group">
                  <label>👤 Propietario</label>
                  <input
                    type="text"
                    name="propietario"
                    value={formData.propietario}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.propietario && <span className="error-message">{errors.propietario}</span>}
                </div>

                <div className="form-group">
                  <label>📞 Teléfono</label>
                  <input 
                    type="tel" 
                    name="telefono" 
                    value={formData.telefono} 
                    onChange={handleInputChange} 
                    required 
                  />
                  {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                </div>

                <div className="form-group">
                  <label>📧 Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>🐕 Tipo de Mascota</label>
                  <select name="tipoMascota" value={formData.tipoMascota} onChange={handleInputChange} required>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="ave">Ave</option>
                    <option value="conejo">Conejo</option>
                    <option value="hamster">Hámster</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>🏷️ Raza</label>
                  <input 
                    type="text" 
                    name="raza" 
                    value={formData.raza} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>📅 Fecha</label>
                  <input 
                    type="date" 
                    name="fecha" 
                    value={formData.fecha} 
                    onChange={handleInputChange} 
                    required 
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.fecha && <span className="error-message">{errors.fecha}</span>}
                </div>

                <div className="form-group">
                  <label>🕐 Hora</label>
                  <select 
                    name="hora" 
                    value={formData.hora} 
                    onChange={handleInputChange} 
                    required
                  >
                    <option value="">Seleccione una hora</option>
                    {HORARIOS_DISPONIBLES.map(hora => (
                      <option key={hora} value={hora}>{hora}</option>
                    ))}
                  </select>
                  {errors.hora && <span className="error-message">{errors.hora}</span>}
                </div>

                <div className="form-group">
                  <label>🏥 Tipo de Consulta</label>
                  <select name="tipo" value={formData.tipo} onChange={handleInputChange} required>
                    <option value="Consulta General">Consulta General</option>
                    <option value="Emergencia">Emergencia</option>
                    <option value="Control">Control</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>⚡ Prioridad</label>
                  <select name="prioridad" value={formData.prioridad} onChange={handleInputChange} required>
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>📝 Motivo de la Consulta</label>
                <textarea
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleInputChange}
                  rows="3"
                  required
                ></textarea>
                {errors.motivo && <span className="error-message">{errors.motivo}</span>}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  ❌ Cancelar
                </button>
                <button type="submit" className="btn-save">
                  💾 {editingCita ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCitas;