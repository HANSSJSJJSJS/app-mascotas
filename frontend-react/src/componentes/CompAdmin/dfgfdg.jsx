import React, { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import {
    Users, Plus, Search, Edit, Trash2, Eye,
    UserCheck, XCircle, CheckCircle, Calendar, MapPin, Mail, Shield, AlertTriangle, FileText
} from "lucide-react";
import "../../stylos/cssAdmin/GestionUsuarios.css?v=3";
import Loading from '../index/Loading';
import { useAuth } from '../../context/AuthContext'; 

// --- MODAL DE AUDITORÍA PARA USUARIOS (INTEGRADO) ---
const AuditLogModal = ({ isOpen, onClose, logData, userName, userId }) => {
    if (!isOpen) return null;

    const getActionInfo = (action) => {
        switch (action) {
            case 'INSERT':
                return { color: '#22c55e', icon: <Plus size={16} /> };
            case 'UPDATE':
                return { color: 'var(--color-light-blue, #8196eb)', icon: <Edit size={14} /> };
            case 'DELETE':
                return { color: '#ef4444', icon: <Trash2 size={14} /> };
            default:
                return { color: 'var(--color-medium-blue, #495a90)', icon: <FileText size={14} /> };
        }
    };

    const formatFieldName = (field) => {
        const names = {
            'nombre': 'Nombre', 'apellido': 'Apellido', 'email': 'Email',
            'telefono': 'Teléfono', 'direccion': 'Dirección', 'barrio': 'Barrio',
            'ciudad': 'Ciudad', 'id_rol': 'Rol', 'id_tipo': 'Tipo de Persona',
            'estado': 'Estado', 'Creación de Usuario': 'Usuario Creado',
            'Eliminación de Usuario': 'Usuario Eliminado'
        };
        return names[field] || field.replace(/_/g, ' ');
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container audit-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header audit-header-usuarios">
                    <div className="modal-header-content">
                        <div className="modal-icon-wrapper"><Users size={24} /></div>
                        <div className="modal-title-section">
                            <h3 className="modal-main-title">Historial del Usuario</h3>
                            <p className="modal-subtitle">"{userName}" (ID: #{userId})</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="modal-close-btn"><XCircle size={22} /></button>
                </div>
                <div className="modal-body">
                    {logData && logData.length > 0 ? (
                        <div className="audit-timeline">
                            {logData.map((log) => {
                                const actionInfo = getActionInfo(log.accion);
                                return (
                                    <div key={log.audit_id} className="audit-timeline-item">
                                        <div className="audit-icon-container" style={{ backgroundColor: actionInfo.color }}>{actionInfo.icon}</div>
                                        <div className="audit-content">
                                            <div className="audit-header">
                                                <span className="audit-action-text">{formatFieldName(log.campo_modificado)}</span>
                                                <span className="audit-meta">{new Date(log.fecha_modificacion).toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })}</span>
                                            </div>
                                            <div className="audit-details">
                                                {log.accion === 'UPDATE' && (
                                                    <>
                                                        <div className="audit-change-row"><span className="audit-label">Antes:</span><span className="audit-value audit-value-old">{log.valor_anterior || 'N/A'}</span></div>
                                                        <div className="audit-change-row"><span className="audit-label">Después:</span><span className="audit-value audit-value-new">{log.valor_nuevo || 'N/A'}</span></div>
                                                    </>
                                                )}
                                                {(log.accion === 'INSERT' || log.accion === 'DELETE') && (
                                                    <div className="audit-change-row"><span className="audit-label">{log.accion === 'INSERT' ? 'Detalle:' : 'Info:'}</span><span className="audit-full-value">{log.valor_nuevo || log.valor_anterior}</span></div>
                                                )}
                                            </div>
                                            <div className="audit-user">Modificado por: <strong>{log.usuario_db}</strong></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="no-audit-data">
                            <FileText size={48} /><p>No se encontraron registros de cambios para este usuario.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
const GestionUsuarios = () => {
    const { usuario } = useAuth();
    const loggedInUserId = usuario?.id_usuario;

    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("lista");
    const [searchTerm, setSearchTerm] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [personTypes, setPersonTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    const [auditLog, setAuditLog] = useState([]);
    const [currentUserForAudit, setCurrentUserForAudit] = useState(null);

    const initialFormData = {
        nombre: "", apellido: "", email: "", tipoDocumento: "CC",
        numeroDocumento: "", genero: "", fechaNacimiento: "",
        telefono: "", ciudad: "", barrio: "", direccion: "",
        rol: "", tipoPersona: "", password: "",
        confirmarPassword: "", estado: 1,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});

    const fetchData = async () => {
        if (!loading) setLoading(true);
        setError(null);
        try {
            const [usersResponse, rolesResponse, personTypesResponse] = await Promise.all([
                axios.get('http://localhost:3001/api/admin/users'),
                axios.get('http://localhost:3001/api/admin/roles'),
                axios.get('http://localhost:3001/api/admin/person-types')
            ]);
            setUsuarios(Array.isArray(usersResponse.data) ? usersResponse.data : []);
            setRoles(Array.isArray(rolesResponse.data) ? rolesResponse.data : []);
            setPersonTypes(Array.isArray(personTypesResponse.data) ? personTypesResponse.data : []);
        } catch (err) {
            console.error("Error al cargar los datos:", err);
            const errorMessage = err.response?.data?.message || "No se pudieron cargar los datos.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loggedInUserId) {
            // Solo si ya tenemos el ID del usuario, procedemos a cargar los datos.
            fetchData();
        }
    }, [loggedInUserId]);

    useEffect(() => {
        const tabFromUrl = searchParams.get('tab');
        if (tabFromUrl === 'registrar') {
            handleOpenForm();
        } else if (tabFromUrl === 'lista') {
            setActiveTab('lista');
        }
    }, [searchParams]);

    const getNombreCompleto = (usuario) => `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();

    const filteredUsuarios = usuarios.filter((usuario) => {
        const nombreCompleto = getNombreCompleto(usuario);
        return (
            (usuario.id_usuario?.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
            (nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) {
            setFormErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const nameRegex = /^[A-Za-z\sÁÉÍÓÚáéíóúñÑ]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{7,10}$/;
        const documentRegex = /^[0-9]{7,11}$/;
        const nomenclaturaRegex = /^(C(alle)?|Cl|l|Cll|Carrera|Kr|K|Cra|Cr|Avenida|Av|A|Transversal|Tv|Tr|Trans|Diagonal|Dg|Diag|D|AK|AC)\s+\d+/i;

        if (!formData.nombre.trim() || !nameRegex.test(formData.nombre)) errors.nombre = "Nombre inválido (solo letras).";
        if (!formData.apellido.trim() || !nameRegex.test(formData.apellido)) errors.apellido = "Apellido inválido (solo letras).";
        if (!formData.email.trim() || !emailRegex.test(formData.email)) errors.email = "El formato del email es inválido.";
        if (!formData.numeroDocumento.trim()) {
            errors.numeroDocumento = "El documento es obligatorio.";
        } else if (!documentRegex.test(formData.numeroDocumento)) {
            errors.numeroDocumento = "El documento debe tener entre 7 y 11 números.";
        }
        if (!formData.genero) errors.genero = "Debes seleccionar un género.";
        if (!formData.telefono.trim() || !phoneRegex.test(formData.telefono)) errors.telefono = "El teléfono debe tener de 7 a 10 números.";
        if (!formData.rol) errors.rol = "Debes seleccionar un rol.";
        if (!formData.tipoPersona) errors.tipoPersona = "Debes seleccionar un tipo de persona.";
        if (!formData.barrio.trim()) {
            errors.barrio = "El barrio es obligatorio.";
        } else if (formData.barrio.trim().length < 3 || formData.barrio.trim().length > 30) {
            errors.barrio = "El barrio debe tener entre 3 y 30 caracteres.";
        }
        if (!formData.ciudad.trim()) {
            errors.ciudad = "La ciudad es obligatoria.";
        } else if (formData.ciudad.trim().length < 3 || formData.ciudad.trim().length > 30) {
            errors.ciudad = "La ciudad debe tener entre 3 y 30 caracteres.";
        }
        if (!formData.direccion.trim()) {
            errors.direccion = "La dirección es obligatoria.";
        } else {
            const direccion = formData.direccion.trim();
            if (direccion.length < 5) {
                errors.direccion = "La dirección es demasiado corta.";
            } else if (!/^[a-zA-Z0-9\s.,°#-]+$/.test(direccion)) {
                errors.direccion = "La dirección contiene caracteres no válidos.";
            } else if (!/\d/.test(direccion)) {
                errors.direccion = "La dirección debe incluir un número.";
            } else if (!/[a-zA-Z]/.test(direccion)) {
                errors.direccion = "La dirección debe incluir texto descriptivo.";
            } else if (/(.)\1\1\1/.test(direccion)) {
                errors.direccion = "La dirección contiene caracteres repetidos de forma sospechosa.";
            } else if (/^\d+$/.test(direccion)) {
                errors.direccion = "La dirección no puede ser solo números.";
            } else if (!nomenclaturaRegex.test(direccion)) {
                errors.direccion = "Formato inválido. Use: Calle (C/Cl/Cll), Carrera (K/Kr/Cra/Cr), Avenida (Av/A), Transversal (Tv/Tr/Trans), Diagonal (Dg/Diag/D)";
            }
        }
        if (!formData.fechaNacimiento) {
            errors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
        } else {
            const today = new Date();
            const birthDate = new Date(formData.fechaNacimiento);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                errors.fechaNacimiento = "El usuario debe ser mayor de 18 años.";
            }
        }
        if (!isEditing) {
            if (!formData.password || formData.password.length < 8) {
                errors.password = "La contraseña debe tener al menos 8 caracteres.";
            }
        }
        if (formData.password && formData.password !== formData.confirmarPassword) {
            errors.confirmarPassword = "Las contraseñas no coinciden.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            Swal.fire({
                icon: 'error',
                title: 'Formulario Incompleto',
                text: 'Por favor, corrige los errores marcados en el formulario.',
                customClass: { popup: 'professional-swal-popup' }
            });
            return;
        }

        setIsSubmitting(true);
        setError(null);
        
        // Se añade el ID del usuario que modifica la información
        const payload = {
            nombre: formData.nombre, apellido: formData.apellido, email: formData.email,
            tipo_documento: formData.tipoDocumento, numeroid: formData.numeroDocumento,
            genero: formData.genero, fecha_nacimiento: formData.fechaNacimiento,
            telefono: formData.telefono || null, ciudad: formData.ciudad,
            barrio: formData.barrio, direccion: formData.direccion,
            id_rol: parseInt(formData.rol, 10), id_tipo: parseInt(formData.tipoPersona, 10),
            contrasena: formData.password, estado: formData.estado,
            modifying_user_id: loggedInUserId // <-- MODIFICACIÓN AQUÍ
        };

        if (isEditing && !payload.contrasena) {
            delete payload.contrasena;
        }

        try {
            if (isEditing) {
                await axios.put(`http://localhost:3001/api/admin/users/${editingUserId}`, payload);
                Swal.fire({ title: '¡Usuario Actualizado!', text: 'Los datos se han guardado correctamente.', icon: 'success', customClass: { popup: 'professional-swal-popup' } });
            } else {
                await axios.post('http://localhost:3001/api/admin/users', payload);
                Swal.fire({ title: '¡Registro Exitoso!', text: 'El nuevo usuario ha sido creado.', icon: 'success', customClass: { popup: 'professional-swal-popup' } });
            }

            setActiveTab('lista');
            setFormErrors({});
            await fetchData();

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocurrió un error.';
            setError(errorMessage);
            Swal.fire({ icon: 'error', title: 'Error', text: errorMessage, customClass: { popup: 'professional-swal-popup' } });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenForm = (usuario = null) => {
        setError(null);
        setFormErrors({});
        if (usuario) {
            setIsEditing(true);
            setEditingUserId(usuario.id_usuario);
            setFormData({
                nombre: usuario.nombre || "",
                apellido: usuario.apellido || "",
                email: usuario.email || "",
                tipoDocumento: usuario.tipo_documento || "CC",
                numeroDocumento: usuario.numeroid || "",
                genero: usuario.genero || "",
                fechaNacimiento: usuario.fecha_nacimiento ? new Date(usuario.fecha_nacimiento).toISOString().split('T')[0] : "",
                telefono: usuario.telefono || "",
                ciudad: usuario.ciudad || "",
                barrio: usuario.barrio || "",
                direccion: usuario.direccion || "",
                rol: usuario.id_rol || "",
                tipoPersona: usuario.id_tipo || "",
                password: "",
                confirmarPassword: "",
                estado: usuario.estado,
            });
        } else {
            setIsEditing(false);
            setEditingUserId(null);
            setFormData(initialFormData);
        }
        setActiveTab("registrar");
    };

    const handleDelete = async (userId, userName) => {
        const result = await Swal.fire({
            title: `¿Estás seguro de eliminar a ${userName}?`,
            text: "Esta acción no se puede revertir.",
            icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'No, cancelar',
            confirmButtonColor: '#d33', cancelButtonColor: '#495a90',
            customClass: { popup: 'professional-swal-popup' }
        });

        if (result.isConfirmed) {
            try {
                // MODIFICACIÓN AQUÍ: Se envía el ID del modificador en el cuerpo de la petición DELETE
                await axios.delete(`http://localhost:3001/api/admin/users/${userId}`, {
                    data: { modifying_user_id: loggedInUserId }
                });
                await Swal.fire({ title: '¡Eliminado!', text: `El usuario ${userName} ha sido eliminado.`, icon: 'success', timer: 1500, showConfirmButton: false, customClass: { popup: 'professional-swal-popup' } });
                await fetchData();
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'No se pudo eliminar el usuario.' });
            }
        }
    };

    const handleViewAudit = async (usuario) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/admin/users/audit/${usuario.id_usuario}`);
            setAuditLog(response.data);
            setCurrentUserForAudit(usuario);
            setIsAuditModalOpen(true);
        } catch (error) {
            console.error("Error al obtener el historial del usuario:", error);
            Swal.fire({ title: 'Error', text: 'No se pudo cargar el historial de cambios.', icon: 'error' });
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="gestion-usuarios">
            <AuditLogModal
                isOpen={isAuditModalOpen}
                onClose={() => setIsAuditModalOpen(false)}
                logData={auditLog}
                userName={currentUserForAudit ? getNombreCompleto(currentUserForAudit) : ''}
                userId={currentUserForAudit?.id_usuario}
            />
            <div className="page-header-compact">
                <div className="header-content-centered">
                    <div className="title-container">
                        <div className="header-icon"><Users size={32} /></div>
                        <div className="header-text">
                            <h1>Gestión de Usuarios</h1>
                            <p>Administra todos los usuarios del sistema</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tabs-container">
                <div className="tabs">
                    <button className={`tab ${activeTab === "lista" ? "active" : ""}`} onClick={() => { setActiveTab("lista"); setIsEditing(false); setFormErrors({}) }}>
                        <Eye size={18} /> Lista de Usuarios
                    </button>
                    <button className={`tab ${activeTab === "registrar" ? "active" : ""}`} onClick={() => handleOpenForm()}>
                        {isEditing ? <Edit size={18} /> : <Plus size={18} />}
                        {isEditing ? 'Editando Usuario' : 'Registrar Usuario'}
                    </button>
                </div>
            </div>

            <div className="tab-content">
                {activeTab === "lista" && (
                    <div className="lista-usuarios">
                        <div className="search-section">
                            <div className="search-container">
                                <Search size={20} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Buscar por ID, nombre o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>
                        
                        {error && <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}
                
                        <div className="usuarios-grid">
                            {filteredUsuarios.length > 0 ? filteredUsuarios.map((usuario) => (
                                <div key={usuario.id_usuario} className="usuario-card">
                                    <div className="usuario-header">
                                        <div className={`usuario-avatar ${usuario.nombre_rol?.toLowerCase().replace(/[\s/]/g, '-')}`}>
                                            {(usuario.nombre?.charAt(0) || '')}{(usuario.apellido?.charAt(0) || '')}
                                        </div>
                                        <div className="usuario-info">
                                            <h3>{getNombreCompleto(usuario)}</h3>
                                            <div className="usuario-meta">
                                                <span className="documento-badge">{usuario.tipo_documento}: {usuario.numeroid}</span>
                                                <span className={`rol-badge ${usuario.nombre_rol?.toLowerCase().replace(/[\s/]/g, '-')}`}>{usuario.nombre_rol}</span>
                                            </div>
                                        </div>
                                        <div className={`estado-badge ${usuario.estado === 1 ? 'activo' : 'inactivo'}`}>
                                            {usuario.estado === 1 ? <UserCheck size={16} /> : <XCircle size={16} />}
                                            {usuario.estado === 1 ? 'Activo' : 'Inactivo'}
                                        </div>
                                    </div>
                                    <div className="usuario-details">
                                        <div className="detail-item"><Mail size={16} /><span className="detail-text">{usuario.email}</span></div>
                                        <div className="detail-item"><MapPin size={16} /><span className="detail-text">{usuario.ciudad}</span></div>
                                        <div className="detail-item">
                                            <Calendar size={16} />
                                            <span className="detail-text">Nacimiento: {new Date(usuario.fecha_nacimiento).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="usuario-actions">
                                        <button className="btn-log" onClick={() => handleViewAudit(usuario)}>
                                            <FileText size={16} /> Historial
                                        </button>
                                        <button className="btn-edit" onClick={() => handleOpenForm(usuario)}>
                                            <Edit size={16} /> Editar
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(usuario.id_usuario, getNombreCompleto(usuario))}>
                                            <Trash2 size={16} /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p style={{textAlign: 'center', padding: '2rem', color: '#666'}}>No se encontraron usuarios.</p>
                            )}
                        </div>
                    </div>
                )}
                {activeTab === "registrar" && (
                    <div className="registrar-usuario">
                        <div className="form-header">
                            <div className="form-header-icon">{isEditing ? <Edit size={24} /> : <Plus size={24} />}</div>
                            <div className="form-header-text">
                                <h2>{isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</h2>
                                <p>{isEditing ? `Modificando datos para: ${formData.nombre} ${formData.apellido}` : 'Completa el formulario para crear un nuevo usuario'}</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="usuario-form" noValidate>
                            <div className="form-container">
                                <div className="form-section">
                                    <div className="section-header"><div className="section-icon"><Users size={20} /></div><h3>Información Personal</h3></div>
                                    <div className="form-grid">
                                        <div className="form-group"><label>Nombre</label><input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Ingrese nombre" className="form-input" />{formErrors.nombre && <p className="error-text"><AlertTriangle size={14}/> {formErrors.nombre}</p>}</div>
                                        <div className="form-group"><label>Apellido</label><input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} required placeholder="Ingrese apellido" className="form-input" />{formErrors.apellido && <p className="error-text"><AlertTriangle size={14}/> {formErrors.apellido}</p>}</div>
                                        <div className="form-group"><label>Tipo de Documento</label><select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleInputChange} className="form-select"><option value="CC">Cédula de Ciudadanía</option><option value="CE">Cédula de Extranjería</option><option value="PP">Pasaporte</option></select></div>
                                        <div className="form-group">
                                            <label>Número de Documento</label>
                                            <input
                                                type="text"
                                                name="numeroDocumento"
                                                value={formData.numeroDocumento}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, ''); 
                                                    handleInputChange({target: {name: 'numeroDocumento', value}});
                                                }}
                                                maxLength={11} 
                                                required
                                                placeholder="Ej: 1234567890 (7-11 dígitos)"
                                                className="form-input"
                                            />
                                            {formErrors.numeroDocumento && <p className="error-text"><AlertTriangle size={14}/> {formErrors.numeroDocumento}</p>}
                                        </div>
                                        <div className="form-group"><label>Género</label><select name="genero" value={formData.genero} onChange={handleInputChange} required className="form-select"><option value="">Seleccionar género</option><option value="Mujer">Mujer</option><option value="Hombre">Hombre</option><option value="No identificado">No identificado</option></select>{formErrors.genero && <p className="error-text"><AlertTriangle size={14}/> {formErrors.genero}</p>}</div>
                                        <div className="form-group"><label>Fecha de Nacimiento</label><input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} required className="form-input" />{formErrors.fechaNacimiento && <p className="error-text"><AlertTriangle size={14}/> {formErrors.fechaNacimiento}</p>}</div>
                                    </div>
                                </div>
                                <div className="form-section">
                                    <div className="section-header"><div className="section-icon"><Mail size={20} /></div><h3>Información de Contacto</h3></div>
                                    <div className="form-grid">
                                        <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="ejemplo@correo.com" className="form-input" />{formErrors.email && <p className="error-text"><AlertTriangle size={14}/> {formErrors.email}</p>}</div>
                                        <div className="form-group"><label>Teléfono</label><input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Número de teléfono" className="form-input" />{formErrors.telefono && <p className="error-text"><AlertTriangle size={14}/> {formErrors.telefono}</p>}</div>
                                        <div className="form-group"><label>Ciudad</label><input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} required placeholder="Ciudad de residencia" className="form-input" /> {formErrors.ciudad && <p className="error-text"><AlertTriangle size={14}/> {formErrors.ciudad}</p>}</div>
                                        <div className="form-group"><label>Barrio</label><input type="text" name="barrio" value={formData.barrio} onChange={handleInputChange} required placeholder="Barrio de residencia" className="form-input" />{formErrors.barrio && <p className="error-text"><AlertTriangle size={14}/> {formErrors.barrio}</p>}</div>
                                        <div className="form-group">
                                            <label>Dirección</label>
                                            <input
                                                type="text"
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Ej: Calle 123 # 45-67, Cra 12 #34-56"
                                                className="form-input"
                                            />
                                            {formErrors.direccion && (
                                                <p className="error-text">
                                                    <AlertTriangle size={14}/> {formErrors.direccion}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-section">
                                    <div className="section-header"><div className="section-icon"><Shield size={20} /></div><h3>Información del Sistema</h3></div>
                                    <div className="form-grid">
                                        <div className="form-group"><label>Rol</label><select name="rol" value={formData.rol} onChange={handleInputChange} required className="form-select"><option value="">Seleccionar rol</option>{roles.map(rol => (<option key={rol.id_rol} value={rol.id_rol}>{rol.nombre_rol}</option>))}</select>{formErrors.rol && <p className="error-text"><AlertTriangle size={14}/> {formErrors.rol}</p>}</div>
                                        <div className="form-group"><label>Tipo de Persona</label><select name="tipoPersona" value={formData.tipoPersona} onChange={handleInputChange} required className="form-select"><option value="">Seleccionar tipo</option>{personTypes.map(pt => (<option key={pt.id_tipo} value={pt.id_tipo}>{pt.tipo}</option>))}</select>{formErrors.tipoPersona && <p className="error-text"><AlertTriangle size={14}/> {formErrors.tipoPersona}</p>}</div>
                                        {isEditing && (
                                            <div className="form-group"><label>Estado</label><select name="estado" value={formData.estado} onChange={handleInputChange} required className="form-select"><option value={1}>Activo</option><option value={0}>Inactivo</option></select></div>
                                        )}
                                        <div className="form-group"><label>Contraseña</label><input type="password" name="password" value={formData.password} onChange={handleInputChange} required={!isEditing} placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Contraseña"} className="form-input" />{formErrors.password && <p className="error-text"><AlertTriangle size={14}/> {formErrors.password}</p>}</div>
                                        <div className="form-group"><label>Confirmar Contraseña</label><input type="password" name="confirmarPassword" value={formData.confirmarPassword} onChange={handleInputChange} required={!isEditing && !!formData.password} placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Repita la contraseña"} className="form-input" />{formErrors.confirmarPassword && <p className="error-text"><AlertTriangle size={14}/> {formErrors.confirmarPassword}</p>}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => { setActiveTab('lista'); setFormErrors({}); setIsEditing(false); }}>Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={isSubmitting}><CheckCircle size={18} />{isSubmitting ? (isEditing ? 'Actualizando...' : 'Registrando...') : (isEditing ? 'Actualizar Usuario' : 'Registrar Usuario')}</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionUsuarios;