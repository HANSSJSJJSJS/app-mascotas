import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import '../../stylos/cssAdmin/GestionCitas.css';
import { PlusCircle, Search, Edit, Trash2, Calendar, Clock, User, CheckCircle, AlertTriangle, XCircle, PlayCircle, SkipForward } from 'react-feather';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3001/api/admin';

// --- Icono Personalizado para la Huella ---
const PawPrintIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="4" cy="8" r="2" /><path d="M12 20a4 4 0 0 0-8 0Z" /><path d="M20 20a4 4 0 0 0-8 0Z" />
    </svg>
);

// --- Componente Modal Funcional ---
const CitaModal = ({ isOpen, onClose, onSave, cita, listas }) => {
    const [formData, setFormData] = useState({});
    const [mascotasDelPropietario, setMascotasDelPropietario] = useState([]);

    useEffect(() => {
        const initialState = cita 
            ? { ...cita, fech_cit: cita.fech_cit.split('T')[0] } // Formatear fecha
            : {
                id_pro: '', cod_mas: '', cod_ser: '', id_vet: '',
                fech_cit: new Date().toISOString().split('T')[0],
                hora: '09:00', estado: 'PENDIENTE', notas: ''
            };
        setFormData(initialState);

        // Si estamos editando una cita, cargar las mascotas del propietario
        if (cita && cita.id_pro) {
            setMascotasDelPropietario(listas.mascotas.filter(m => m.id_pro === cita.id_pro));
        }

    }, [cita, isOpen, listas.mascotas]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Si se cambia el propietario, actualizar la lista de mascotas
        if (name === 'id_pro') {
            const propietarioId = parseInt(value, 10);
            setMascotasDelPropietario(listas.mascotas.filter(m => m.id_pro === propietarioId));
            // Resetear la mascota seleccionada
            setFormData(prev => ({ ...prev, cod_mas: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;
    const modalTitle = cita ? `Editando Cita #${cita.cod_cit}` : 'Agendar Nueva Cita';

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{modalTitle}</h3>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                </div>
                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="id_pro">Propietario</label>
                            <select name="id_pro" value={formData.id_pro} onChange={handleChange} required>
                                <option value="" disabled>Seleccionar...</option>
                                {listas.propietarios.map(p => (
                                    <option key={p.id_usuario} value={p.id_usuario}>{p.nombre} {p.apellido}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cod_mas">Mascota</label>
                            <select name="cod_mas" value={formData.cod_mas} onChange={handleChange} required disabled={!formData.id_pro}>
                                <option value="" disabled>Seleccionar...</option>
                                {mascotasDelPropietario.map(m => (
                                    <option key={m.cod_mas} value={m.cod_mas}>{m.nom_mas}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cod_ser">Servicio</label>
                            <select name="cod_ser" value={formData.cod_ser} onChange={handleChange} required>
                                <option value="" disabled>Seleccionar...</option>
                                {listas.servicios.map(s => (
                                    <option key={s.cod_ser} value={s.cod_ser}>{s.nom_ser}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="id_vet">Veterinario</label>
                            <select name="id_vet" value={formData.id_vet} onChange={handleChange} required>
                                <option value="" disabled>Seleccionar...</option>
                                {listas.veterinarios.map(v => (
                                    <option key={v.id_usuario} value={v.id_usuario}>{v.nombre} {v.apellido}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="fech_cit">Fecha</label>
                            <input type="date" name="fech_cit" value={formData.fech_cit} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hora">Hora</label>
                            <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="estado">Estado de la Cita</label>
                            <select name="estado" value={formData.estado} onChange={handleChange} required>
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="CONFIRMADA">Confirmada</option>
                                <option value="REALIZADA">Realizada</option>
                                <option value="CANCELADA">Cancelada</option>
                                <option value="NO_ASISTIDA">No Asistió</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="notas">Notas Adicionales</label>
                            <textarea name="notas" value={formData.notas || ''} onChange={handleChange} rows="3" placeholder="El cliente indica que la mascota presenta..."></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Componente Principal
const GestionCitas = () => {
    const [citas, setCitas] = useState([]);
    const [kpiData, setKpiData] = useState({});
    const [listas, setListas] = useState({ mascotas: [], propietarios: [], veterinarios: [], servicios: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Función para obtener todos los datos necesarios
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [citasRes, kpiRes, listasRes] = await Promise.all([
                axios.get(`${API_URL}/citas`),
                axios.get(`${API_URL}/citas/stats`),
                axios.get(`${API_URL}/citas-data`),
            ]);
            setCitas(citasRes.data);
            setKpiData(kpiRes.data);
            setListas(listasRes.data);
        } catch (err) {
            setError('Error al cargar los datos. Por favor, intente de nuevo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const getStatusInfo = (estado) => {
        const ESTATUS = {
            PENDIENTE: { className: 'status-pendiente', icon: <AlertTriangle size={14}/> },
            CONFIRMADA: { className: 'status-confirmada', icon: <CheckCircle size={14}/> },
            CANCELADA: { className: 'status-cancelada', icon: <XCircle size={14}/> },
            REALIZADA: { className: 'status-realizada', icon: <PlayCircle size={14}/> },
            NO_ASISTIDA: { className: 'status-no-asistida', icon: <SkipForward size={14}/> },
        };
        return ESTATUS[estado] || ESTATUS.PENDIENTE;
    };

    const handleEdit = (cita) => {
        setSelectedCita(cita);
        setIsModalOpen(true);
    };
    
    const handleAdd = () => {
        setSelectedCita(null);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar',
            customClass: { popup: 'swal2-custom' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/citas/${id}`);
                    fetchData(); // Volver a cargar los datos
                    Swal.fire({
                        title: '¡Eliminada!', text: 'La cita ha sido eliminada.', icon: 'success',
                        customClass: { popup: 'swal2-custom' }
                    });
                } catch (err) {
                    Swal.fire({
                        title: 'Error', text: 'No se pudo eliminar la cita.', icon: 'error',
                        customClass: { popup: 'swal2-custom' }
                    });
                }
            }
        });
    };
    
    const handleSave = async (citaData) => {
        const url = citaData.cod_cit 
            ? `${API_URL}/citas/${citaData.cod_cit}` 
            : `${API_URL}/citas`;
        const method = citaData.cod_cit ? 'put' : 'post';

        try {
            await axios[method](url, citaData);
            setIsModalOpen(false);
            fetchData(); // Recargar datos
            Swal.fire({
                title: '¡Guardado!',
                text: 'La cita ha sido guardada correctamente.',
                icon: 'success',
                customClass: { popup: 'swal2-custom' }
            });
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo guardar la cita. Verifique los campos.',
                icon: 'error',
                customClass: { popup: 'swal2-custom' }
            });
        }
    };
    
    return (
        <div className="citas-admin-container">
            <CitaModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                cita={selectedCita}
                listas={listas}
                onSave={handleSave}
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

            <div className="kpi-container">
                 <div className="kpi-card"><h4>Citas para Hoy</h4><div className="kpi-value">{kpiData.totalHoy || 0}</div><Calendar className="kpi-icon" /></div>
                 <div className="kpi-card"><h4>Pendientes</h4><div className="kpi-value">{kpiData.pendientes || 0}</div><AlertTriangle className="kpi-icon" /></div>
                 <div className="kpi-card"><h4>Confirmadas</h4><div className="kpi-value">{kpiData.confirmadas || 0}</div><CheckCircle className="kpi-icon" /></div>
                 <div className="kpi-card"><h4>Realizadas Hoy</h4><div className="kpi-value">{kpiData.realizadasHoy || 0}</div><PlayCircle className="kpi-icon" /></div>
            </div>

            <div className="citas-table-wrapper">
                <div className="citas-controls-bar">
                    <div className="search-container">
                        <Search className="search-icon" size={20} />
                        <input type="text" placeholder="Buscar por mascota, propietario..." />
                    </div>
                    <div className="filters-container">
                        <select><option>Todos los estados</option></select>
                        <input type="date" />
                    </div>
                    <button className="btn btn-primary" onClick={handleAdd}><PlusCircle size={18}/><span>Agendar Cita</span></button>
                </div>
                
                <div className="citas-table-container">
                    {loading && <p>Cargando citas...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                    <table className="citas-table">
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
                            {citas.map((cita) => {
                                const status = getStatusInfo(cita.estado);
                                return (
                                <tr key={cita.cod_cit}>
                                    <td>
                                        <div className="cell-paciente">
                                            <img src={`https://placehold.co/40x40/c2d8ff/1a2540?text=${cita.nom_mas.charAt(0)}`} alt={cita.nom_mas} className="paciente-avatar" />
                                            <div>
                                                <span className="paciente-nombre">{cita.nom_mas}</span>
                                                <span className="propietario-nombre">{cita.nom_pro}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{cita.nom_ser}</td>
                                    <td>{cita.nom_vet}</td>
                                    <td>
                                        <div className="cell-fecha">
                                            <span><Calendar size={14}/> {new Date(cita.fech_cit).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            <span><Clock size={14}/> {new Date(`1970-01-01T${cita.hora}Z`).toLocaleTimeString('es-CO', {hour: '2-digit', minute:'2-digit', hour12: true})}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${status.className}`}>
                                            {status.icon}
                                            {cita.estado.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon" onClick={() => handleEdit(cita)} title="Editar Cita"><Edit size={18} /></button>
                                            <button className="btn-icon btn-delete" onClick={() => handleDelete(cita.cod_cit)} title="Eliminar Cita"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GestionCitas;

