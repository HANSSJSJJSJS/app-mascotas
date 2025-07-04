"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import '../../stylos/cssAdmin/GestionCitas.css';
import {
  PlusCircle, Search, Edit, Trash2, Calendar, Clock, User, CheckCircle,
  AlertTriangle, XCircle, PlayCircle, SkipForward, FileText
} from "react-feather"
import Swal from "sweetalert2"
import { useAuth } from "../../context/AuthContext"; // <-- IMPORTANTE: Importa el hook

const API_URL = "http://localhost:3001/api/admin"

// --- Icono Personalizado para la Huella ---
const PawPrintIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="4" cy="8" r="2" /><path d="M12 20a4 4 0 0 0-8 0Z" /><path d="M20 20a4 4 0 0 0-8 0Z" />
  </svg>
)

// --- Componente Modal Mejorado ---
const CitaModal = ({ isOpen, onClose, onSave, cita, listas, citas }) => {
  const [formData, setFormData] = useState({})
  const [mascotasDelPropietario, setMascotasDelPropietario] = useState([])
  const [errors, setErrors] = useState({
    fech_cit: '',
    hora: '',
    solapamiento: ''
  })

  useEffect(() => {
    const initialState = cita
      ? { ...cita, fech_cit: cita.fech_cit.split("T")[0] }
      : {
          id_pro: "",
          cod_mas: "",
          cod_ser: "",
          id_vet: "",
          fech_cit: new Date().toISOString().split("T")[0],
          hora: "09:00",
          estado: "PENDIENTE",
          notas: "",
        }
    setFormData(initialState)

    if (initialState.id_pro) {
      setMascotasDelPropietario(listas.mascotas.filter((m) => m.id_pro === initialState.id_pro))
    } else {
      setMascotasDelPropietario([])
    }
  }, [cita, isOpen, listas.mascotas])

  const validateFecha = (fecha) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fechaCita = new Date(fecha)
    
    if (fechaCita < hoy) {
      return 'No se permiten fechas pasadas'
    }
    
    const unMesDespues = new Date()
    unMesDespues.setMonth(unMesDespues.getMonth() + 1)
    
    if (fechaCita > unMesDespues) {
      return 'Solo se permiten citas hasta con 1 mes de anticipación'
    }
    
    return ''
  }

  const validateHora = (hora) => {
    const [horas, minutos] = hora.split(':').map(Number)
    
    if (horas < 8 || (horas === 18 && minutos > 0) || horas >= 19) {
      return 'El horario de atención es de 8:00 am a 6:00 pm'
    }
    
    return ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    if (name === 'fech_cit') {
      setErrors(prev => ({...prev, fech_cit: validateFecha(value)}))
    }
    
    if (name === 'hora') {
      setErrors(prev => ({...prev, hora: validateHora(value)}))
    }
    
    if (name === 'id_pro') {
      const propietarioId = Number.parseInt(value, 10)
      setMascotasDelPropietario(listas.mascotas.filter((m) => m.id_pro === propietarioId))
      setFormData((prev) => ({ ...prev, cod_mas: "" }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const fechaError = validateFecha(formData.fech_cit)
    const horaError = validateHora(formData.hora)
    
    setErrors({
      fech_cit: fechaError,
      hora: horaError,
      solapamiento: ''
    })
    
    if (fechaError || horaError) {
      return
    }
    
    const fechaHoraCita = new Date(`${formData.fech_cit}T${formData.hora}:00`)
    const fechaHoraFinCita = new Date(fechaHoraCita)
    fechaHoraFinCita.setMinutes(fechaHoraFinCita.getMinutes() + 90)
    
    const citaExistente = citas.find(c => {
      if (c.cod_cit === formData.cod_cit) return false
      
      const fechaExistente = new Date(c.fech_cit)
      const horaExistente = c.hora.split(':')
      const fechaHoraExistente = new Date(fechaExistente)
      fechaHoraExistente.setHours(parseInt(horaExistente[0], 10), parseInt(horaExistente[1], 10))
      
      const fechaHoraFinExistente = new Date(fechaHoraExistente)
      fechaHoraFinExistente.setMinutes(fechaHoraFinExistente.getMinutes() + 90)
      
      return (
        (fechaHoraCita >= fechaHoraExistente && fechaHoraCita < fechaHoraFinExistente) ||
        (fechaHoraFinCita > fechaHoraExistente && fechaHoraFinCita <= fechaHoraFinExistente) ||
        (fechaHoraCita <= fechaHoraExistente && fechaHoraFinCita >= fechaHoraFinExistente)
      )
    })
    
    if (citaExistente) {
      setErrors(prev => ({
        ...prev,
        solapamiento: `Ya existe una cita programada para ${citaExistente.nom_mas} a esa hora`
      }))
      return
    }
    
    onSave(formData)
  }

  if (!isOpen) return null
  const isEditing = !!cita
  const modalTitle = isEditing ? "Editar Cita Médica" : "Agendar Nueva Cita"
  const modalSubtitle = isEditing
    ? `Modificando la cita #${cita.cod_cit}`
    : "Complete los datos para programar una nueva cita"

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container enhanced-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header enhanced-header">
          <div className="modal-header-content">
            <div className="modal-icon-wrapper">
              <Calendar size={28} />
            </div>
            <div className="modal-title-section">
              <h3 className="modal-main-title">{modalTitle}</h3>
              <p className="modal-subtitle">{modalSubtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn enhanced-close">
            <XCircle size={24} />
          </button>
        </div>
        <form className="modal-body enhanced-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="section-title">
              <User size={20} />
              <span>Información del Cliente</span>
            </div>
            <div className="form-row">
              <div className="form-group enhanced-group">
                <label htmlFor="id_pro" className="enhanced-label">
                  <User size={16} /> Propietario
                </label>
                <select name="id_pro" value={formData.id_pro || ""} onChange={handleChange} required className="enhanced-select" >
                  <option value="" disabled>Seleccionar propietario...</option>
                  {listas.propietarios.map((p) => ( <option key={p.id_usuario} value={p.id_usuario}>{p.nombre} {p.apellido}</option> ))}
                </select>
              </div>
              <div className="form-group enhanced-group">
                <label htmlFor="cod_mas" className="enhanced-label">
                  <PawPrintIcon size={16} /> Mascota
                </label>
                <select name="cod_mas" value={formData.cod_mas || ""} onChange={handleChange} required disabled={!formData.id_pro} className="enhanced-select" >
                  <option value="" disabled>{!formData.id_pro ? "Primero seleccione propietario" : "Seleccionar mascota..."}</option>
                  {mascotasDelPropietario.map((m) => ( <option key={m.cod_mas} value={m.cod_mas}>{m.nom_mas}</option> ))}
                </select>
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="section-title">
              <CheckCircle size={20} />
              <span>Detalles del Servicio</span>
            </div>
            <div className="form-row">
              <div className="form-group enhanced-group">
                <label htmlFor="cod_ser" className="enhanced-label">
                  <CheckCircle size={16} /> Servicio Médico
                </label>
                <select name="cod_ser" value={formData.cod_ser || ""} onChange={handleChange} required className="enhanced-select" >
                  <option value="" disabled>Seleccionar servicio...</option>
                  {listas.servicios.map((s) => ( <option key={s.cod_ser} value={s.cod_ser}>{s.nom_ser}</option> ))}
                </select>
              </div>
              <div className="form-group enhanced-group">
                <label htmlFor="id_vet" className="enhanced-label">
                  <User size={16} /> Veterinario Asignado
                </label>
                <select name="id_vet" value={formData.id_vet || ""} onChange={handleChange} required className="enhanced-select" >
                  <option value="" disabled>Seleccionar veterinario...</option>
                  {listas.veterinarios.map((v) => ( <option key={v.id_usuario} value={v.id_usuario}>Dr. {v.nombre} {v.apellido}</option>))}
                </select>
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="section-title">
              <Calendar size={20} />
              <span>Programación</span>
            </div>
            <div className="form-row">
              <div className="form-group enhanced-group">
                <label htmlFor="fech_cit" className="enhanced-label">
                  <Calendar size={16} /> Fecha de la Cita
                </label>
                <input 
                  type="date" 
                  name="fech_cit" 
                  value={formData.fech_cit || ""} 
                  onChange={handleChange} 
                  required 
                  className={`enhanced-input ${errors.fech_cit ? 'input-error' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]}
                />
                {errors.fech_cit && <div className="error-message">{errors.fech_cit}</div>}
              </div>
              <div className="form-group enhanced-group">
                <label htmlFor="hora" className="enhanced-label">
                  <Clock size={16} /> Hora de la Cita
                </label>
                <input 
                  type="time" 
                  name="hora" 
                  value={formData.hora || ""} 
                  onChange={handleChange} 
                  required 
                  className={`enhanced-input ${errors.hora ? 'input-error' : ''}`}
                  min="08:00"
                  max="18:00"
                  step="1800"
                />
                {errors.hora && <div className="error-message">{errors.hora}</div>}
              </div>
              {errors.solapamiento && (
                <div className="form-group full-width">
                  <div className="error-message solapamiento-error">
                    <AlertTriangle size={14} /> {errors.solapamiento}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="form-section">
            <div className="section-title">
              <AlertTriangle size={20} />
              <span>Estado y Observaciones</span>
            </div>
            <div className="form-group enhanced-group full-width">
              <label htmlFor="estado" className="enhanced-label">
                <AlertTriangle size={16} /> Estado de la Cita
              </label>
              <select name="estado" value={formData.estado || "PENDIENTE"} onChange={handleChange} required className="enhanced-select" >
                <option value="PENDIENTE">🟡 Pendiente</option>
                <option value="CONFIRMADA">🔵 Confirmada</option>
                <option value="REALIZADA">🟢 Realizada</option>
                <option value="CANCELADA">🔴 Cancelada</option>
                <option value="NO_ASISTIDA">⚫ No Asistió</option>
              </select>
            </div>
            <div className="form-group enhanced-group full-width">
              <label htmlFor="notas" className="enhanced-label">
                <Edit size={16} /> Notas y Observaciones
              </label>
              <textarea name="notas" value={formData.notas || ""} onChange={handleChange} rows="4" placeholder="Ingrese observaciones especiales, síntomas reportados, etc..." className="enhanced-textarea" ></textarea>
            </div>
          </div>
          <div className="modal-footer enhanced-footer">
            <button type="button" className="btn btn-secondary enhanced-btn" onClick={onClose}>
              <XCircle size={18} /> Cancelar
            </button>
            <button type="submit" className="btn btn-primary enhanced-btn">
              <CheckCircle size={18} /> {isEditing ? "Actualizar Cita" : "Agendar Cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- NUEVO COMPONENTE: MODAL DE AUDITORÍA ---
const AuditLogModal = ({ isOpen, onClose, logData, citaId }) => {
  if (!isOpen) return null;

  const getActionInfo = (action) => {
    switch (action) {
      case 'INSERT': return { text: 'Creada', color: '#22c55e' };
      case 'UPDATE': return { text: 'Actualizada', color: '#f97316' };
      case 'DELETE': return { text: 'Eliminada', color: '#ef4444' };
      default: return { text: action, color: '#64748b' };
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container audit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header enhanced-header">
          <div className="modal-header-content">
            <div className="modal-icon-wrapper">
              <FileText size={28} />
            </div>
            <div className="modal-title-section">
              <h3 className="modal-main-title">Historial de Cambios</h3>
              <p className="modal-subtitle">Cita #{citaId}</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn enhanced-close">
            <XCircle size={24} />
          </button>
        </div>
        <div className="modal-body">
          {logData.length > 0 ? (
            <div className="audit-timeline">
              {logData.map((log, index) => {
                const actionInfo = getActionInfo(log.accion);
                return (
                  <div key={index} className="audit-timeline-item">
                    <span className="audit-action" style={{ backgroundColor: actionInfo.color }}>
                      {actionInfo.text}
                    </span>
                    <div className="audit-details">
                      <div className="audit-field">
                        <strong>Campo:</strong> {log.campo_modificado}
                      </div>
                      {log.accion === 'UPDATE' && (
                        <>
                          <div className="audit-values">
                            <strong>Antes:</strong> {log.valor_anterior || 'Vacío'}
                          </div>
                          <div className="audit-values">
                            <strong>Después:</strong> {log.valor_nuevo || 'Vacío'}
                          </div>
                        </>
                      )}
                      {log.accion !== 'UPDATE' && (
                        <div className="audit-values">
                          <strong>Datos:</strong> {log.valor_nuevo || log.valor_anterior || 'N/A'}
                        </div>
                      )}
                    </div>
                    <div className="audit-meta">
                      <span>{new Date(log.fecha_modificacion).toLocaleString('es-CO')}</span>
                      <span>Modificado por: {log.usuario_db}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-audit-data">No hay historial de cambios para esta cita.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal ---
const GestionCitas = () => {
  const { usuario } = useAuth(); // <-- Se obtiene el usuario del contexto
  const loggedInUserId = usuario?.id_usuario; // <-- Se obtiene el ID de forma segura

  const [citas, setCitas] = useState([])
  const [kpiData, setKpiData] = useState({})
  const [listas, setListas] = useState({ mascotas: [], propietarios: [], veterinarios: [], servicios: [] })
  const [isCitaModalOpen, setIsCitaModalOpen] = useState(false)
  const [selectedCita, setSelectedCita] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("TODOS")
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLog, setAuditLog] = useState([]);
  const [citaIdForAudit, setCitaIdForAudit] = useState(null);

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [citasRes, kpiRes, listasRes] = await Promise.all([
        axios.get(`${API_URL}/citas`),
        axios.get(`${API_URL}/citas/stats`),
        axios.get(`${API_URL}/citas-data`),
      ])
      setCitas(citasRes.data)
      setKpiData(kpiRes.data)
      setListas(listasRes.data)
    } catch (err) {
      setError("Error al cargar los datos. Por favor, intente de nuevo.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredCitas = useMemo(() => {
    return citas.filter((cita) => {
      const searchTermLower = searchTerm.toLowerCase()
      const matchesStatus = statusFilter === "TODOS" || cita.estado === statusFilter
      if (!matchesStatus) {
        return false
      }
      if (searchTermLower === "") {
        return true
      }
      const nomMas = cita.nom_mas || ""
      const nomPro = cita.nom_pro || ""
      const nomVet = cita.nom_vet || ""
      const nomSer = cita.nom_ser || ""
      return (
        nomMas.toLowerCase().includes(searchTermLower) ||
        nomPro.toLowerCase().includes(searchTermLower) ||
        nomVet.toLowerCase().includes(searchTermLower) ||
        nomSer.toLowerCase().includes(searchTermLower)
      )
    })
  }, [citas, searchTerm, statusFilter])

  const getStatusInfo = (estado) => {
    const ESTATUS = {
      PENDIENTE: { className: "status-pendiente", icon: <AlertTriangle size={14} /> },
      CONFIRMADA: { className: "status-confirmada", icon: <CheckCircle size={14} /> },
      CANCELADA: { className: "status-cancelada", icon: <XCircle size={14} /> },
      REALIZADA: { className: "status-realizada", icon: <PlayCircle size={14} /> },
      NO_ASISTIDA: { className: "status-no-asistida", icon: <SkipForward size={14} /> },
    }
    return ESTATUS[estado] || ESTATUS.PENDIENTE
  }

  const handleEdit = (cita) => {
    setSelectedCita(cita)
    setIsCitaModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedCita(null)
    setIsCitaModalOpen(true)
  }

  const handleViewAudit = async (cod_cit) => {
    try {
      const response = await axios.get(`${API_URL}/citas/audit/${cod_cit}`);
      setAuditLog(response.data);
      setCitaIdForAudit(cod_cit);
      setIsAuditModalOpen(true);
    } catch (error) {
      console.error("Error fetching audit log:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar el historial de cambios.',
        icon: 'error',
        confirmButtonColor: "#495a90",
        customClass: { popup: "swal2-custom-popup" }
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#495a90",
      cancelButtonColor: "#8196eb",
      confirmButtonText: "Sí, ¡eliminar!",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "swal2-custom-popup",
        title: "swal2-custom-title",
        confirmButton: "swal2-custom-confirm",
        cancelButton: "swal2-custom-cancel",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/citas/${id}`, {
            data: { modifying_user_id: loggedInUserId }
          })
          fetchData()
          Swal.fire({
            title: "¡Eliminada!", text: "La cita ha sido eliminada.", icon: "success",
            confirmButtonColor: "#495a90", customClass: { popup: "swal2-custom-popup" }
          })
        } catch (err) {
          Swal.fire({
            title: "Error", text: "No se pudo eliminar la cita.", icon: "error",
            confirmButtonColor: "#495a90", customClass: { popup: "swal2-custom-popup" }
          })
        }
      }
    })
  }

  const handleSave = async (citaData) => {
    const url = citaData.cod_cit ? `${API_URL}/citas/${citaData.cod_cit}` : `${API_URL}/citas`
    const method = citaData.cod_cit ? "put" : "post"
    const payload = { ...citaData, modifying_user_id: loggedInUserId };

    try {
      await axios[method](url, payload)
      setIsCitaModalOpen(false)
      fetchData()
      Swal.fire({
        title: "¡Guardado!", text: "La cita ha sido guardada correctamente.", icon: "success",
        confirmButtonColor: "#495a90", customClass: { popup: "swal2-custom-popup" }
      })
    } catch (err) {
      Swal.fire({
        title: "Error", text: "No se pudo guardar la cita. Verifique los campos.", icon: "error",
        confirmButtonColor: "#495a90", customClass: { popup: "swal2-custom-popup" }
      })
    }
  }

  return (
    <div className="citas-admin-container">
      <CitaModal
        isOpen={isCitaModalOpen}
        onClose={() => setIsCitaModalOpen(false)}
        cita={selectedCita}
        listas={listas}
        onSave={handleSave}
        citas={citas}
      />
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logData={auditLog}
        citaId={citaIdForAudit}
      />
      <div className="citas-admin-header">
        <div className="header-icon-container">
          <Calendar size={36} color="white" />
        </div>
        <div className="header-text-container">
          <h1>Agenda de Citas</h1>
          <p>Gestiona, agenda y edita las citas de la clínica.</p>
        </div>
      </div>
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card stat-today">
            <div className="stat-number">{kpiData.totalHoy || 0}</div>
            <div className="stat-label">Citas Hoy</div>
            <div className="stat-icon"><Calendar size={20} /></div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-number">{kpiData.pendientes || 0}</div>
            <div className="stat-label">Pendientes</div>
            <div className="stat-icon"><AlertTriangle size={20} /></div>
          </div>
          <div className="stat-card stat-confirmed">
            <div className="stat-number">{kpiData.confirmadas || 0}</div>
            <div className="stat-label">Confirmadas</div>
            <div className="stat-icon"><CheckCircle size={20} /></div>
          </div>
          <div className="stat-card stat-completed">
            <div className="stat-number">{kpiData.realizadas || 0}</div>
            <div className="stat-label">Realizadas</div>
            <div className="stat-icon"><PlayCircle size={20} /></div>
          </div>
        </div>
      </div>
      <div className="table-section">
        <div className="table-header">
          <div className="table-title">
            <h2>Lista de Citas</h2>
            <span className="table-count">{filteredCitas.length} citas</span>
          </div>
          <button className="add-btn" onClick={handleAdd}>
            <PlusCircle size={18} /> Agendar Cita
          </button>
        </div>
        <div className="filters-bar">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Buscar por mascota, propietario, etc..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-dropdown">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="TODOS">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="REALIZADA">Realizada</option>
              <option value="CANCELADA">Cancelada</option>
              <option value="NO_ASISTIDA">No Asistió</option>
            </select>
          </div>
        </div>
        <div className="table-container">
          {loading && <div className="loading-state">Cargando citas...</div>}
          {error && <div className="error-state">{error}</div>}
          {!loading && !error && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Paciente y Propietario</th>
                  <th>Servicio</th>
                  <th>Veterinario</th>
                  <th>Fecha y Hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCitas.map((cita) => {
                  const status = getStatusInfo(cita.estado)
                  return (
                    <tr key={cita.cod_cit}>
                      <td>
                        <div className="patient-info">
                          <div className="patient-avatar">{cita.nom_mas.charAt(0).toUpperCase()}</div>
                          <div className="patient-details">
                            <div className="patient-name">{cita.nom_mas}</div>
                            <div className="owner-name">{cita.nom_pro}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="service-tag">{cita.nom_ser}</span></td>
                      <td>
                        <div className="vet-info">
                          <User size={16} /><span>{cita.nom_vet || "No asignado"}</span>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <div className="date-row">
                            <Calendar size={14} />
                            {new Date(cita.fech_cit).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })}
                          </div>
                          <div className="time-row">
                            <Clock size={14} />
                            {new Date(`1970-01-01T${cita.hora}`).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true })}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${status.className}`}>
                          {status.icon} {cita.estado.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="log-btn" onClick={() => handleViewAudit(cita.cod_cit)} title="Ver Historial">
                            <FileText size={16} />
                          </button>
                          <button className="edit-btn" onClick={() => handleEdit(cita)} title="Editar">
                            <Edit size={16} />
                          </button>
                          <button className="delete-btn" onClick={() => handleDelete(cita.cod_cit)} title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default GestionCitas;