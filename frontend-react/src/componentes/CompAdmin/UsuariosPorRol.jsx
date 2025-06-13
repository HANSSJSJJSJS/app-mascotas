"use client"

import React, { useState, useEffect } from "react";
import axios from 'axios';
import {ArrowLeft, Users, Search, Mail, MapPin, Calendar,UserCheck, UserX, Crown, Stethoscope, Heart,
} from "lucide-react";
import "../../stylos/cssAdmin/UsuariosPorRol.css";
import Loading from '../index/Loading';

const UsuariosPorRol = ({ rol, onVolver }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            if (!rol || !rol.id) {
                setLoading(false);
                setError("No se ha especificado un rol válido.");
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:3001/api/admin/users');
                if (Array.isArray(response.data)) {
                    const usuariosFiltrados = response.data.filter(user => user.id_rol === rol.id);
                    setUsuarios(usuariosFiltrados);
                } else {
                    setUsuarios([]);
                }
            } catch (err) {
                console.error(`Error al cargar los usuarios para el rol ${rol.nombre}:`, err);
                const errorMessage = err.response?.data?.message || "No se pudieron cargar los usuarios.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, [rol]);

    const filteredUsuarios = usuarios.filter(
        (usuario) =>
            (usuario.nombre && usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (usuario.apellido && usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (usuario.email && usuario.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (usuario.numeroid && usuario.numeroid.includes(searchTerm))
    );

    const getRolIcon = (tipo) => {
        switch (tipo) {
            case "administrador": return <Crown size={24} />;
            case "veterinario": return <Stethoscope size={24} />;
            case "propietario": return <Heart size={24} />;
            default: return <Users size={24} />;
        }
    };

    const getNombreCompleto = (usuario) => `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();


    if (loading) {
        return (
            <div className="usuarios-por-rol loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Cargando usuarios para el rol: {rol.nombre}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="usuarios-por-rol">
            <div className="page-header">
                <div className="header-content">
                    <button className="btn-volver" onClick={onVolver}>
                        <ArrowLeft size={20} />
                        Volver a Roles
                    </button>
                    <div className="header-info">
                        <div className={`header-icon ${rol.tipo}`}>{getRolIcon(rol.tipo)}</div>
                        <div>
                            <h1>Usuarios con rol: {rol.nombre}</h1>
                            <p>{filteredUsuarios.length} usuarios encontrados</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="usuarios-container">
                <div className="usuarios-header">
                    <div className="search-section">
                        <div className="search-container">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, email o documento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                </div>

                <div className="usuarios-content">
                    {error && <p className="error-message" style={{textAlign: 'center', color: 'red'}}>{error}</p>}
                    {filteredUsuarios.length === 0 ? (
                        <div className="no-usuarios">
                            <Users size={48} />
                            <h3>No se encontraron usuarios</h3>
                            <p>
                                {usuarios.length > 0
                                    ? `Ningún usuario coincide con tu búsqueda.`
                                    : `No hay usuarios con el rol "${rol.nombre}".`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="usuarios-grid">
                            {filteredUsuarios.map((usuario) => (
                                <div key={usuario.id_usuario} className="usuario-card">
                                    <div className="usuario-header">
                                        <div className={`usuario-avatar ${rol.tipo}`}>
                                            {(usuario.nombre?.charAt(0) || '')}
                                            {(usuario.apellido?.charAt(0) || '')}
                                        </div>
                                        <div className="usuario-info">
                                            <h3>{getNombreCompleto(usuario)}</h3>
                                            <div className="usuario-meta">
                                                <span className="documento-badge">
                                                    {usuario.tipo_documento} {usuario.numeroid}
                                                </span>
                                                <span className={`estado-badge ${usuario.estado === 1 ? 'activo' : 'inactivo'}`}>
                                                    {usuario.estado === 1 ? <UserCheck size={14} /> : <UserX size={14} />}
                                                    {usuario.estado === 1 ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="usuario-details">
                                        <div className="detail-item">
                                            <Mail size={16} className="detail-icon" />
                                            <span className="detail-text">{usuario.email}</span>
                                        </div>
                                        <div className="detail-item">
                                            <MapPin size={16} className="detail-icon" />
                                            <span className="detail-text">{usuario.ciudad || 'No especificada'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <Calendar size={16} className="detail-icon" />
                                            <span className="detail-text">Nacimiento: {new Date(usuario.fecha_nacimiento).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="usuario-extra-info">
                                        <div className="info-row">
                                            <span className="info-label">Teléfono:</span>
                                            <span className="info-value">{usuario.telefono || 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Dirección:</span>
                                            <span className="info-value">{usuario.direccion || 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Género:</span>
                                            <span className="info-value">{usuario.genero || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsuariosPorRol;