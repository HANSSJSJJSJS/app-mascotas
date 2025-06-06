"use client"

import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  Users, Plus, Search, Edit, Trash2, Eye,
  UserCheck, CheckCircle, Calendar, MapPin, Mail, Shield,
} from "lucide-react";
import "../../stylos/cssAdmin/GestionUsuarios.css";
import Loading from '../index/Loading';

const GestionUsuarios = () => {
  const [activeTab, setActiveTab] = useState("lista");
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [personTypes, setPersonTypes] = useState([]); // NUEVO ESTADO
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData = {
    nombre: "", apellido: "", email: "", tipoDocumento: "CC",
    numeroDocumento: "", genero: "", fechaNacimiento: "", telefono: "",
    ciudad: "", direccion: "", rol: "", tipoPersona: "",
    password: "", confirmarPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchData = async () => {
    if (!loading) setLoading(true);
    setError(null);
    try {
      // Hacemos las tres peticiones al mismo tiempo para más eficiencia
      const [usersResponse, rolesResponse, personTypesResponse] = await Promise.all([
        axios.get('http://localhost:3001/api/admin/users'),
        axios.get('http://localhost:3001/api/admin/roles'),
        axios.get('http://localhost:3001/api/admin/person-types') // Nueva petición
      ]);

      setUsuarios(Array.isArray(usersResponse.data[0]) ? usersResponse.data[0] : []);
      setRoles(Array.isArray(rolesResponse.data[0]) ? rolesResponse.data[0] : []);
      // La nueva ruta no devuelve un array anidado
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
    fetchData();
  }, []);

  const filteredUsuarios = usuarios.filter((usuario) =>
    (usuario.id_usuario?.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    (usuario.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        tipo_documento: formData.tipoDocumento,
        numeroid: formData.numeroDocumento,
        genero: formData.genero,
        fecha_nacimiento: formData.fechaNacimiento,
        telefono: formData.telefono || null, // Enviar NULL si está vacío
        ciudad: formData.ciudad,
        direccion: formData.direccion,
        id_rol: parseInt(formData.rol, 10),
        id_tipo: parseInt(formData.tipoPersona, 10),
        contrasena: formData.password
      };
      
      await axios.post('http://localhost:3001/api/admin/users', payload);
      
      alert('¡Usuario registrado exitosamente!');
      setFormData(initialFormData);
      setActiveTab('lista');
      await fetchData();

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al registrar el usuario.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}" (ID: ${userId})?`)) {
      try {
        await axios.delete(`http://localhost:3001/api/admin/users/${userId}`);
        alert('Usuario eliminado exitosamente');
        await fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'No se pudo eliminar el usuario.');
      }
    }
  };

  const handleEdit = (usuario) => {
    alert('La funcionalidad de editar se implementará a continuación.');
  };

  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="gestion-usuarios">
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
          <button className={`tab ${activeTab === "lista" ? "active" : ""}`} onClick={() => setActiveTab("lista")}>
            <Eye size={18} /> Lista de Usuarios
          </button>
          <button className={`tab ${activeTab === "registrar" ? "active" : ""}`} onClick={() => setActiveTab("registrar")}>
            <Plus size={18} /> Registrar Usuario
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
                      {usuario.nombre_completo?.split(' ')[0]?.charAt(0) || ''}
                      {usuario.nombre_completo?.split(' ')[1]?.charAt(0) || ''}
                    </div>
                    <div className="usuario-info">
                      <h3>{usuario.nombre_completo}</h3>
                      <div className="usuario-meta">
                        <span className="documento-badge">
                          {usuario.tipo_documento || 'ID'}: {usuario.numeroid || usuario.id_usuario}
                        </span>
                        <span className={`rol-badge ${usuario.nombre_rol?.toLowerCase().replace(/[\s/]/g, '-')}`}>{usuario.nombre_rol}</span>
                      </div>
                    </div>
                    <div className={`estado-badge activo`}>
                      <UserCheck size={16} /> Activo
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
                       <span className="detail-text">
                         Registrado: {new Date(usuario.fecha_registro).toLocaleDateString()}
                       </span>
                     </div>
                  </div>
                  <div className="usuario-actions">
                    <button className="btn-edit" onClick={() => handleEdit(usuario)}>
                      <Edit size={16} /> Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(usuario.id_usuario, usuario.nombre_completo)}>
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
              <div className="form-header-icon"><Plus size={24} /></div>
              <div className="form-header-text">
                <h2>Registrar Nuevo Usuario</h2>
                <p>Completa el formulario para crear un nuevo usuario en el sistema</p>
              </div>
            </div>

            {error && <p className="error-message" style={{color: 'red', textAlign: 'center', padding: '1rem'}}>{error}</p>}
            
            <form onSubmit={handleSubmit} className="usuario-form">
              <div className="form-container">
                <div className="form-section">
                  <div className="section-header"><div className="section-icon"><Users size={20} /></div><h3>Información Personal</h3></div>
                  <div className="form-grid">
                    <div className="form-group"><label>Nombre</label><input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Ingrese nombre" className="form-input" /></div>
                    <div className="form-group"><label>Apellido</label><input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} required placeholder="Ingrese apellido" className="form-input" /></div>
                    <div className="form-group"><label>Tipo de Documento</label><select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleInputChange} className="form-select"><option value="CC">Cédula de Ciudadanía</option><option value="CE">Cédula de Extranjería</option><option value="PP">Pasaporte</option></select></div>
                    <div className="form-group"><label>Número de Documento</label><input type="text" name="numeroDocumento" value={formData.numeroDocumento} onChange={handleInputChange} required placeholder="Ingrese número de documento" className="form-input" /></div>
                    <div className="form-group"><label>Género</label><select name="genero" value={formData.genero} onChange={handleInputChange} required className="form-select"><option value="">Seleccionar</option><option value="Femenino">Femenino</option><option value="Masculino">Masculino</option><option value="Otro">Otro</option></select></div>
                    <div className="form-group"><label>Fecha de Nacimiento</label><input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} required className="form-input" /></div>
                  </div>
                </div>
                <div className="form-section">
                  <div className="section-header"><div className="section-icon"><Mail size={20} /></div><h3>Información de Contacto</h3></div>
                  <div className="form-grid">
                    <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="ejemplo@correo.com" className="form-input" /></div>
                    <div className="form-group"><label>Teléfono</label><input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Número de teléfono" className="form-input" /></div>
                    <div className="form-group"><label>Ciudad</label><input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} required placeholder="Ciudad de residencia" className="form-input" /></div>
                    <div className="form-group full-width"><label>Dirección</label><input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} required placeholder="Dirección completa" className="form-input" /></div>
                  </div>
                </div>
                <div className="form-section">
                  <div className="section-header"><div className="section-icon"><Shield size={20} /></div><h3>Información del Sistema</h3></div>
                  <div className="form-grid">
                    <div className="form-group"><label>Rol</label><select name="rol" value={formData.rol} onChange={handleInputChange} required className="form-select"><option value="">Seleccionar rol</option>{roles.map(rol => (<option key={rol.id_rol} value={rol.id_rol}>{rol.nombre_rol}</option>))}</select></div>
                    <div className="form-group">
                        <label>Tipo de Persona</label>
                        <select name="tipoPersona" value={formData.tipoPersona} onChange={handleInputChange} required className="form-select">
                            <option value="">Seleccionar tipo</option>
                            {personTypes.map(pt => (<option key={pt.id_tipo} value={pt.id_tipo}>{pt.tipo}</option>))}
                        </select>
                    </div>
                    <div className="form-group"><label>Contraseña</label><input type="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder="Contraseña segura" className="form-input" /></div>
                    <div className="form-group"><label>Confirmar Contraseña</label><input type="password" name="confirmarPassword" value={formData.confirmarPassword} onChange={handleInputChange} required placeholder="Repita la contraseña" className="form-input" /></div>
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => { setActiveTab('lista'); setError(null); }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}><CheckCircle size={18} />{isSubmitting ? 'Registrando...' : 'Registrar Usuario'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionUsuarios;
