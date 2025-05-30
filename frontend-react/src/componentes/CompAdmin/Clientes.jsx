import React, { useState } from 'react';

const RegistroClientes = () => {
  // Estado para los clientes
  const [clientes, setClientes] = useState([
    {
      id: 1,
      tipoDocumento: 'CC',
      numeroDocumento: '123456789',
      nombreCompleto: 'Juan Pérez Gómez',
      fechaNacimiento: '14/5/1985',
      telefono: '3001234567',
      correo: 'juan.perez@example.com',
      direccion: 'Calle 123 #45-67, Bogotá',
      estado: 'activo'
    },
    {
      id: 2,
      tipoDocumento: 'CE',
      numeroDocumento: 'AB123456',
      nombreCompleto: 'María García López',
      fechaNacimiento: '21/8/1990',
      telefono: '3109876543',
      correo: 'maria.garcia@example.com',
      direccion: 'Carrera 8 #12-34, Medellín',
      estado: 'inactivo'
    }
  ]);

  // Estado para la búsqueda
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para el modal de agregar/editar
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  
  // Estado para el formulario
  const [formulario, setFormulario] = useState({
    tipoDocumento: 'CC',
    numeroDocumento: '',
    nombreCompleto: '',
    fechaNacimiento: '',
    telefono: '',
    correo: '',
    direccion: '',
    estado: 'activo'
  });

  // Filtrar clientes según la búsqueda
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.numeroDocumento.includes(busqueda) ||
    cliente.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función para manejar cambios en el formulario
  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  // Función para abrir modal de agregar
  const abrirModalAgregar = () => {
    setClienteEditando(null);
    setFormulario({
      tipoDocumento: 'CC',
      numeroDocumento: '',
      nombreCompleto: '',
      fechaNacimiento: '',
      telefono: '',
      correo: '',
      direccion: '',
      estado: 'activo'
    });
    setMostrarModal(true);
  };

  // Función para abrir modal de editar
  const abrirModalEditar = (cliente) => {
    setClienteEditando(cliente.id);
    setFormulario(cliente);
    setMostrarModal(true);
  };

  // Función para guardar cliente
  const guardarCliente = () => {
    // Validar campos requeridos
    if (!formulario.numeroDocumento || !formulario.nombreCompleto || !formulario.correo) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    if (clienteEditando) {
      // Editar cliente existente
      setClientes(clientes.map(cliente =>
        cliente.id === clienteEditando ? { ...formulario, id: clienteEditando } : cliente
      ));
    } else {
      // Agregar nuevo cliente
      const nuevoId = Math.max(...clientes.map(c => c.id)) + 1;
      setClientes([...clientes, { ...formulario, id: nuevoId }]);
    }
    
    setMostrarModal(false);
  };

  // Función para eliminar cliente
  const eliminarCliente = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setClientes(clientes.filter(cliente => cliente.id !== id));
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#c2d8ff', minHeight: '100vh' }}>
      <header className="content-header">
        <h1 className="page-title">Registro de Clientes</h1>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, documento o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="add-btn" onClick={abrirModalAgregar}>
            ➕ Agregar Cliente
          </button>
        </div>
      </header>

      {/* Estadísticas */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{clientes.length}</div>
          <div className="stat-label">Total Clientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{clientes.filter(c => c.estado === 'activo').length}</div>
          <div className="stat-label">Activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{clientes.filter(c => c.estado === 'inactivo').length}</div>
          <div className="stat-label">Inactivos</div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>DOCUMENTO</th>
              <th>NOMBRE COMPLETO</th>
              <th>FECHA NACIMIENTO</th>
              <th>TELÉFONO</th>
              <th>EMAIL</th>
              <th>DIRECCIÓN</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>
                  <span className="doc-type">{cliente.tipoDocumento}</span>
                  {cliente.numeroDocumento}
                </td>
                <td>{cliente.nombreCompleto}</td>
                <td>{cliente.fechaNacimiento}</td>
                <td>
                  <span className="contact-info">
                    <span className="icon">📞</span>
                    {cliente.telefono}
                  </span>
                </td>
                <td>
                  <span className="contact-info">
                    <span className="icon">✉️</span>
                    {cliente.correo}
                  </span>
                </td>
                <td>
                  <span className="contact-info">
                    <span className="icon">📍</span>
                    {cliente.direccion}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${cliente.estado}`}>
                    {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => abrirModalEditar(cliente)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => eliminarCliente(cliente.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {clientesFiltrados.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#8196eb' }}>
                  No se encontraron clientes que coincidan con la búsqueda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar/editar cliente */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{clienteEditando ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</h2>
            <div>
              <div className="form-group">
                <label>Tipo de Documento</label>
                <select
                  name="tipoDocumento"
                  value={formulario.tipoDocumento}
                  onChange={manejarCambio}
                  required
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PA">Pasaporte</option>
                  <option value="TI">Tarjeta de Identidad</option>
                </select>
              </div>

              <div className="form-group">
                <label>Número de Documento</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formulario.numeroDocumento}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  name="nombreCompleto"
                  value={formulario.nombreCompleto}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formulario.fechaNacimiento}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formulario.telefono}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formulario.correo}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formulario.direccion}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estado</label>
                <select
                  name="estado"
                  value={formulario.estado}
                  onChange={manejarCambio}
                  required
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="form-buttons">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn-primary"
                  onClick={guardarCliente}
                >
                  {clienteEditando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroClientes;