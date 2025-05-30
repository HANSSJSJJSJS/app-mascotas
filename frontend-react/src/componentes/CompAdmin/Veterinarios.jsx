import React, { useState } from 'react';

const VeterinariosRegistrados = () => {
  // Estado para los veterinarios
  const [veterinarios, setVeterinarios] = useState([
    {
      id: 1,
      foto: "👩‍⚕️",
      nombre: "Dra. Martinez",
      especialidad: "Cirugía",
      correo: "martinez@vetclinic.com",
      telefono: "555-123-4567",
      licencia: "VET001",
      experiencia: "8 años",
      estado: "activo"
    },
    {
      id: 2,
      foto: "👨‍⚕️",
      nombre: "Dr. Gómez",
      especialidad: "Dermatología",
      correo: "gomez@vetclinic.com",
      telefono: "555-234-5678",
      licencia: "VET002",
      experiencia: "5 años",
      estado: "activo"
    },
    {
      id: 3,
      foto: "👩‍⚕️",
      nombre: "Dra. Fernández",
      especialidad: "Odontología",
      correo: "fernandez@vetclinic.com",
      telefono: "555-345-6789",
      licencia: "VET003",
      experiencia: "12 años",
      estado: "inactivo"
    },
    {
      id: 4,
      foto: "👨‍⚕️",
      nombre: "Dr. Ramírez",
      especialidad: "Medicina interna",
      correo: "ramirez@vetclinic.com",
      telefono: "555-456-7890",
      licencia: "VET004",
      experiencia: "15 años",
      estado: "activo"
    }
  ]);

  // Estado para la búsqueda
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para el modal de agregar/editar
  const [mostrarModal, setMostrarModal] = useState(false);
  const [veterinarioEditando, setVeterinarioEditando] = useState(null);
  
  // Estado para el formulario
  const [formulario, setFormulario] = useState({
    foto: "👨‍⚕️",
    nombre: '',
    especialidad: '',
    correo: '',
    telefono: '',
    licencia: '',
    experiencia: '',
    estado: 'activo'
  });

  // Especialidades disponibles
  const especialidades = [
    'Cirugía',
    'Dermatología',
    'Odontología',
    'Medicina interna',
    'Cardiología',
    'Oftalmología',
    'Neurología',
    'Oncología',
    'Medicina de emergencia',
    'Anestesiología'
  ];

  // Filtrar veterinarios según la búsqueda
  const veterinariosFiltrados = veterinarios.filter(veterinario =>
    veterinario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    veterinario.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
    veterinario.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
    veterinario.licencia.toLowerCase().includes(busqueda.toLowerCase())
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
    setVeterinarioEditando(null);
    setFormulario({
      foto: "👨‍⚕️",
      nombre: '',
      especialidad: '',
      correo: '',
      telefono: '',
      licencia: '',
      experiencia: '',
      estado: 'activo'
    });
    setMostrarModal(true);
  };

  // Función para abrir modal de editar
  const abrirModalEditar = (veterinario) => {
    setVeterinarioEditando(veterinario.id);
    setFormulario(veterinario);
    setMostrarModal(true);
  };

  // Función para guardar veterinario
  const guardarVeterinario = () => {
    // Validar campos requeridos
    if (!formulario.nombre || !formulario.especialidad || !formulario.correo || !formulario.licencia) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formulario.correo)) {
      alert('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Validar que la licencia no esté duplicada
    const licenciaExiste = veterinarios.some(vet => 
      vet.licencia === formulario.licencia && vet.id !== veterinarioEditando
    );
    if (licenciaExiste) {
      alert('Ya existe un veterinario con esa licencia');
      return;
    }
    
    if (veterinarioEditando) {
      // Editar veterinario existente
      setVeterinarios(veterinarios.map(veterinario =>
        veterinario.id === veterinarioEditando ? { ...formulario, id: veterinarioEditando } : veterinario
      ));
    } else {
      // Agregar nuevo veterinario
      const nuevoId = Math.max(...veterinarios.map(v => v.id)) + 1;
      setVeterinarios([...veterinarios, { ...formulario, id: nuevoId }]);
    }
    
    setMostrarModal(false);
  };

  // Función para eliminar veterinario
  const eliminarVeterinario = (id) => {
    const veterinario = veterinarios.find(v => v.id === id);
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${veterinario.nombre}?`)) {
      setVeterinarios(veterinarios.filter(veterinario => veterinario.id !== id));
    }
  };

  // Función para cambiar estado
  const cambiarEstado = (id) => {
    setVeterinarios(veterinarios.map(veterinario =>
      veterinario.id === id 
        ? { ...veterinario, estado: veterinario.estado === 'activo' ? 'inactivo' : 'activo' }
        : veterinario
    ));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#c2d8ff', minHeight: '100vh' }}>
      <style>
        {`
          .content-header {
            background: linear-gradient(135deg, #1a2540 0%, #495a90 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 25px;
            box-shadow: 0 4px 12px rgba(26, 37, 64, 0.3);
          }
          
          .page-title {
            margin: 0 0 20px 0;
            font-size: 2rem;
            font-weight: 600;
            color: #c2d8ff;
          }
          
          .header-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
          }
          
          .search-container {
            position: relative;
            flex: 1;
            min-width: 250px;
          }
          
          .search-input {
            width: 100%;
            padding: 12px 45px 12px 15px;
            border: 2px solid #8196eb;
            border-radius: 8px;
            font-size: 16px;
            background: white;
            color: #1a2540;
            transition: all 0.3s ease;
          }
          
          .search-input:focus {
            outline: none;
            border-color: #495a90;
            box-shadow: 0 0 0 3px rgba(129, 150, 235, 0.2);
          }
          
          .search-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 18px;
            color: #8196eb;
          }
          
          .add-btn {
            background: #8196eb;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
          }
          
          .add-btn:hover {
            background: #495a90;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(129, 150, 235, 0.4);
          }
          
          .table-container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          thead {
            background: #1a2540;
            color: #c2d8ff;
          }
          
          th {
            padding: 18px 15px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          tbody tr {
            border-bottom: 1px solid #e1e8ff;
            transition: background-color 0.2s ease;
          }
          
          tbody tr:hover {
            background-color: #f8faff;
          }
          
          td {
            padding: 15px;
            color: #1a2540;
            vertical-align: middle;
          }
          
          .vet-photo {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #8196eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
            margin: 0 auto;
          }
          
          .vet-name {
            font-weight: 600;
            color: #1a2540;
          }
          
          .specialty {
            background: #e1e8ff;
            color: #495a90;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
          }
          
          .contact-info {
            color: #495a90;
          }
          
          .license-badge {
            background: #8196eb;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
          }
          
          .experience-info {
            color: #1a2540;
            font-weight: 500;
          }
          
          .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .status-activo {
            background: #d4edda;
            color: #155724;
          }
          
          .status-activo:hover {
            background: #c3e6cb;
          }
          
          .status-inactivo {
            background: #f8d7da;
            color: #721c24;
          }
          
          .status-inactivo:hover {
            background: #f1b0b7;
          }
          
          .action-buttons {
            display: flex;
            gap: 8px;
          }
          
          .action-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          
          .edit-btn {
            background: #8196eb;
            color: white;
          }
          
          .edit-btn:hover {
            background: #495a90;
            transform: scale(1.1);
          }
          
          .delete-btn {
            background: #dc3545;
            color: white;
          }
          
          .delete-btn:hover {
            background: #c82333;
            transform: scale(1.1);
          }
          
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          
          .modal {
            background: white;
            padding: 30px;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }
          
          .modal h2 {
            color: #1a2540;
            margin-bottom: 25px;
            font-size: 1.5rem;
          }
          
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #1a2540;
            font-weight: 600;
          }
          
          .form-group input,
          .form-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e8ff;
            border-radius: 6px;
            font-size: 16px;
            color: #1a2540;
            transition: border-color 0.3s ease;
          }
          
          .form-group input:focus,
          .form-group select:focus {
            outline: none;
            border-color: #8196eb;
          }
          
          .emoji-selector {
            display: flex;
            gap: 10px;
            margin-top: 8px;
            flex-wrap: wrap;
          }
          
          .emoji-option {
            padding: 8px 12px;
            border: 2px solid #e1e8ff;
            border-radius: 6px;
            cursor: pointer;
            font-size: 18px;
            transition: all 0.3s ease;
          }
          
          .emoji-option:hover {
            border-color: #8196eb;
          }
          
          .emoji-option.selected {
            border-color: #8196eb;
            background: #f0f4ff;
          }
          
          .form-buttons {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
            margin-top: 30px;
          }
          
          .btn-secondary {
            background: #6c757d;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
          }
          
          .btn-secondary:hover {
            background: #5a6268;
          }
          
          .btn-primary {
            background: #8196eb;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
          }
          
          .btn-primary:hover {
            background: #495a90;
          }
          
          .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
          }
          
          .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          
          .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #1a2540;
            margin-bottom: 5px;
          }
          
          .stat-label {
            color: #8196eb;
            font-weight: 600;
          }
          
          @media (max-width: 768px) {
            .header-controls {
              flex-direction: column;
              align-items: stretch;
            }
            
            .search-container {
              min-width: auto;
            }
            
            .form-row {
              grid-template-columns: 1fr;
            }
            
            table {
              font-size: 14px;
            }
            
            th, td {
              padding: 10px 8px;
            }
            
            .modal {
              width: 95%;
              padding: 20px;
            }
          }
        `}
      </style>

      <header className="content-header">
        <h1 className="page-title">Veterinarios Registrados</h1>
        <div className="header-controls">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, especialidad, correo o licencia..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="add-btn" onClick={abrirModalAgregar}>
            ➕ Agregar Veterinario
          </button>
        </div>
      </header>

      {/* Estadísticas */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{veterinarios.length}</div>
          <div className="stat-label">Total Veterinarios</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{veterinarios.filter(v => v.estado === 'activo').length}</div>
          <div className="stat-label">Activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{especialidades.length}</div>
          <div className="stat-label">Especialidades</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Math.round(veterinarios.reduce((acc, v) => acc + parseInt(v.experiencia), 0) / veterinarios.length) || 0}</div>
          <div className="stat-label">Años Promedio</div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Licencia</th>
              <th>Experiencia</th>
              <th>Correo electrónico</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {veterinariosFiltrados.map(veterinario => (
              <tr key={veterinario.id}>
                <td>
                  <div className="vet-photo">
                    {veterinario.foto}
                  </div>
                </td>
                <td className="vet-name">{veterinario.nombre}</td>
                <td>
                  <span className="specialty">{veterinario.especialidad}</span>
                </td>
                <td>
                  <span className="license-badge">{veterinario.licencia}</span>
                </td>
                <td className="experience-info">{veterinario.experiencia}</td>
                <td className="contact-info">{veterinario.correo}</td>
                <td className="contact-info">{veterinario.telefono}</td>
                <td>
                  <span 
                    className={`status-badge status-${veterinario.estado}`}
                    onClick={() => cambiarEstado(veterinario.id)}
                    title="Clic para cambiar estado"
                  >
                    {veterinario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => abrirModalEditar(veterinario)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => eliminarVeterinario(veterinario.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {veterinariosFiltrados.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#8196eb' }}>
                  No se encontraron veterinarios que coincidan con la búsqueda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar/editar veterinario */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{veterinarioEditando ? 'Editar Veterinario' : 'Agregar Nuevo Veterinario'}</h2>
            
            <div className="form-group">
              <label>Foto (Emoji)</label>
              <div className="emoji-selector">
                {['👨‍⚕️', '👩‍⚕️', '🧑‍⚕️', '👨‍🔬', '👩‍🔬'].map(emoji => (
                  <div
                    key={emoji}
                    className={`emoji-option ${formulario.foto === emoji ? 'selected' : ''}`}
                    onClick={() => setFormulario({...formulario, foto: emoji})}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  placeholder="Dr/Dra. Nombre Apellido"
                  required
                />
              </div>

              <div className="form-group">
                <label>Especialidad *</label>
                <select
                  name="especialidad"
                  value={formulario.especialidad}
                  onChange={manejarCambio}
                  required
                >
                  <option value="">Seleccionar especialidad</option>
                  {especialidades.map(esp => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Número de Licencia *</label>
                <input
                  type="text"
                  name="licencia"
                  value={formulario.licencia}
                  onChange={manejarCambio}
                  placeholder="VET001"
                  required
                />
              </div>

              <div className="form-group">
                <label>Años de Experiencia</label>
                <input
                  type="text"
                  name="experiencia"
                  value={formulario.experiencia}
                  onChange={manejarCambio}
                  placeholder="5 años"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Correo Electrónico *</label>
              <input
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={manejarCambio}
                placeholder="veterinario@vetclinic.com"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formulario.telefono}
                  onChange={manejarCambio}
                  placeholder="555-123-4567"
                />
              </div>

              <div className="form-group">
                <label>Estado</label>
                <select
                  name="estado"
                  value={formulario.estado}
                  onChange={manejarCambio}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
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
                onClick={guardarVeterinario}
              >
                {veterinarioEditando ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VeterinariosRegistrados;