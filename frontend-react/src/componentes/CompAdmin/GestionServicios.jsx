"use client"

import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Briefcase, Plus, Edit, Trash2, Eye, DollarSign, FileText, CheckCircle, Search } from "lucide-react";
import "../../stylos/cssAdmin/GestionServicios.css";
import Loading from '../index/Loading';

const GestionServicios = () => {
    const [activeTab, setActiveTab] = useState("lista");
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");
    const [precioFilter, setPrecioFilter] = useState("");

    const initialFormData = {
        nom_ser: "",
        descrip_ser: "",
        precio: "",
    };
    const [formData, setFormData] = useState(initialFormData);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchServicios = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/api/admin/servicios');
            const serviciosAdaptados = response.data.map(s => ({
                ...s,
                codigo: s.cod_ser,
                nombre: s.nom_ser,
                descripcion: s.descrip_ser,
                estado: "Activo"
            }));
            setServicios(Array.isArray(serviciosAdaptados) ? serviciosAdaptados : []);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "No se pudieron cargar los servicios.";
            setError(errorMessage);
            Swal.fire('Error de Carga', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServicios();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nom_ser || !formData.precio) {
            Swal.fire({
                customClass: {
                    popup: 'swal-custom-warning',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-html',
                    confirmButton: 'swal-custom-confirm-button',
                },
                icon: 'warning',
                title: 'Campos Incompletos',
                html: 'Por favor, asegúrate de que el <strong>nombre</strong> y el <strong>precio</strong> del servicio no estén vacíos.',
                confirmButtonText: 'Aceptar',
                buttonsStyling: false,
                didRender: () => {
                    const icon = document.querySelector('.swal2-icon.swal2-warning');
                    if (icon) {
                        icon.style.color = '#495a90';
                        icon.style.borderColor = '#495a90';
                    }
                }
            });
            return;
        }

        const dataToSend = {
            nom_ser: formData.nom_ser,
            descrip_ser: formData.descrip_ser,
            precio: parseFloat(formData.precio)
        };

        const url = isEditing
            ? `http://localhost:5000/api/admin/servicios/${editingId}`
            : 'http://localhost:5000/api/admin/servicios';
        const method = isEditing ? 'put' : 'post';
        const actionText = isEditing ? 'actualizado' : 'creado';

        try {
            await axios[method](url, dataToSend);
            Swal.fire({
                customClass: {
                    popup: 'swal-custom-success',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-html',
                    confirmButton: 'swal-custom-confirm-button',
                },
                icon: 'success',
                title: `¡Operación Exitosa!`,
                html: `El servicio <strong>${dataToSend.nom_ser}</strong> ha sido ${actionText} correctamente.`,
                confirmButtonText: 'Continuar',
                buttonsStyling: false
            });
            resetForm();
            setActiveTab('lista');
            fetchServicios();
        } catch (err) {
            const errorMessage = err.response?.data?.message || `Ocurrió un error al ${actionText} el servicio.`;
            Swal.fire('Error', errorMessage, 'error');
        }
    };

    const handleEditClick = (servicio) => {
        setFormData({
            nom_ser: servicio.nombre,
            descrip_ser: servicio.descripcion || '',
            precio: servicio.precio,
        });
        setIsEditing(true);
        setEditingId(servicio.codigo);
        setActiveTab("registrar");
    };

    const handleDeleteClick = (servicio) => {
        Swal.fire({
            customClass: {
                popup: 'swal-custom-warning',
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-html',
                confirmButton: 'swal-custom-delete-button',
                cancelButton: 'swal-custom-cancel-button',
                actions: 'swal-custom-actions'
            },
            icon: 'warning',
            title: `¿Eliminar "${servicio.nombre}"?`,
            html: 'Esta acción no se puede deshacer y es permanente.',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar',
            buttonsStyling: false,
            didRender: () => {
                const icon = document.querySelector('.swal2-icon.swal2-warning');
                if (icon) {
                    icon.style.color = '#495a90';
                    icon.style.borderColor = '#495a90';
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/admin/servicios/${servicio.codigo}`);
                    Swal.fire({
                        customClass: {
                            popup: 'swal-custom-success',
                            title: 'swal-custom-title',
                            htmlContainer: 'swal-custom-html',
                            confirmButton: 'swal-custom-confirm-button',
                        },
                        icon: 'success',
                        title: '¡Eliminado!',
                        html: `El servicio <strong>${servicio.nombre}</strong> ha sido eliminado correctamente.`,
                        confirmButtonText: 'Continuar',
                        buttonsStyling: false
                    });
                    fetchServicios();
                } catch (err) {
                    const errorMessage = err.response?.data?.message || 'No se pudo eliminar el servicio.';
                    Swal.fire({
                        customClass: {
                            popup: 'swal-custom-error',
                            title: 'swal-custom-title',
                            htmlContainer: 'swal-custom-html',
                            confirmButton: 'swal-custom-confirm-button',
                        },
                        icon: 'error',
                        title: 'Error al Eliminar',
                        html: errorMessage,
                        confirmButtonText: 'Aceptar',
                        buttonsStyling: false
                    });
                }
            }
        });
    };

    const filteredServicios = servicios.filter((servicio) => {
        const busqueda = searchTerm.toLowerCase();
        if (busqueda && !servicio.nombre.toLowerCase().includes(busqueda)) {
            return false;
        }
        if (estadoFilter && servicio.estado !== estadoFilter) return false;
        if (precioFilter) {
            if (precioFilter === "bajo" && servicio.precio > 50000) return false;
            if (precioFilter === "medio" && (servicio.precio <= 50000 || servicio.precio > 100000)) return false;
            if (precioFilter === "alto" && servicio.precio <= 100000) return false;
        }
        return true;
    });

    const formatPrice = (price) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);
    
    if (loading) return <Loading />;
    
    return (
        <div className="gestion-servicios">
            <div className="page-header-compact">
                <div className="header-content-centered">
                    <div className="title-container">
                        <div className="header-icon"><Briefcase size={32} /></div>
                        <div className="header-text">
                            <h1>Gestión de Servicios</h1>
                            <p>Administra todos los servicios veterinarios del sistema</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tabs-container">
                <div className="tabs">
                    <button className={`tab ${activeTab === "lista" ? "active" : ""}`} onClick={() => setActiveTab("lista")}>
                        <Eye size={18} /> Lista de Servicios
                    </button>
                    <button className={`tab ${activeTab === "registrar" ? "active" : ""}`} onClick={() => { setActiveTab("registrar"); setIsEditing(false); resetForm(); }}>
                        {isEditing ? <Edit size={18} /> : <Plus size={18} />}
                        {isEditing ? 'Editando Servicio' : 'Registrar Servicio'}
                    </button>
                </div>
            </div>

            <div className="tab-content">
                {activeTab === "lista" && (
                    <div className="lista-servicios">
                        <div className="filters-section">
                            <div className="filters-label">Filtros:</div>
                            <div className="search-container">
                                <Search size={20} className="search-icon" />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Buscar por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="filters-container">
                                <select className="filter-select" value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
                                    <option value="">Todos los estados</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                                <select className="filter-select" value={precioFilter} onChange={(e) => setPrecioFilter(e.target.value)}>
                                    <option value="">Todos los precios</option>
                                    <option value="bajo">Bajo (hasta $50.000)</option>
                                    <option value="medio">Medio ($50.001 - $100.000)</option>
                                    <option value="alto">Alto (más de $100.000)</option>
                                </select>
                            </div>
                        </div>

                        {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
                        <div className="servicios-grid">
                            {filteredServicios.map((servicio) => (
                                <div key={servicio.codigo} className="servicio-card">
                                    <div className="servicio-header">
                                        <div className="servicio-icon consulta">
                                            <Briefcase size={24} />
                                        </div>
                                        <div className="servicio-info">
                                            <h3>{servicio.nombre}</h3>
                                            <div className="servicio-meta">
                                                <span className={`estado-badge ${servicio.estado.toLowerCase()}`}>
                                                    <CheckCircle size={14} /> {servicio.estado}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="precio-badge"><DollarSign size={16} /> {formatPrice(servicio.precio)}</div>
                                    </div>
                                    <div className="servicio-description"><p>{servicio.descripcion || "Sin descripción."}</p></div>
                                    <div className="servicio-details">
                                        <div className="detail-item"><FileText size={16} className="detail-icon" /> <span className="detail-text">Código: #{servicio.codigo}</span></div>
                                    </div>
                                    <div className="servicio-actions">
                                        <button className="btn-edit" onClick={() => handleEditClick(servicio)}><Edit size={16} /> Editar</button>
                                        <button className="btn-delete" onClick={() => handleDeleteClick(servicio)}><Trash2 size={16} color="#495a90"/> Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "registrar" && (
                    <div className="registrar-servicio">
                        <div className="form-header">
                            <div className="form-header-icon">{isEditing ? <Edit size={24} /> : <Plus size={24} />}</div>
                            <div className="form-header-text">
                                <h2>{isEditing ? 'Editar Servicio' : 'Registrar Nuevo Servicio'}</h2>
                                <p>{isEditing ? `Modificando el servicio: "${formData.nom_ser}"` : 'Completa el formulario para crear un nuevo servicio'}</p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="servicio-form">
                            <div className="form-container">
                                <div className="form-section">
                                    <div className="section-header"><div className="section-icon"><Briefcase size={20} /></div><h3>Información del Servicio</h3></div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Nombre del Servicio</label>
                                            <input type="text" name="nom_ser" value={formData.nom_ser} onChange={handleInputChange} required placeholder="Ej: Consulta General" className="form-input" />
                                        </div>
                                        <div className="form-group">
                                            <label>Precio (COP)</label>
                                            <input type="number" name="precio" value={formData.precio} onChange={handleInputChange} required placeholder="45000" className="form-input" min="0" />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Descripción</label>
                                            <textarea name="descrip_ser" value={formData.descrip_ser} onChange={handleInputChange} placeholder="Describe detalladamente el servicio..." className="form-textarea" rows="4"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setActiveTab('lista')}>Cancelar</button>
                                <button type="submit" className="btn-primary"><CheckCircle size={18} /> {isEditing ? 'Actualizar Servicio' : 'Registrar Servicio'}</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionServicios;