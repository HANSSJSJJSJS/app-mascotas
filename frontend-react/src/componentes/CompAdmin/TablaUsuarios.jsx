import React, { useState, useEffect, useCallback } from 'react';
import FormUsuarios from './FormUsuarios';
import '../../stylos/cssAdmin/TablaUsuarios.css';

const TablaUsuarios = () => {
  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('id');
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [filtros, setFiltros] = useState({
    rol: 'todos',
    estado: 'todos'
  });

  // Cargar datos iniciales (simulando API)
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        // Simular llamada a API
        const datosEjemplo = [
          { id: 1, nombres: 'Admin SC', email: 'admin@gmail.com', estado: 'Activo', rol: 'Administrador' },
          { id: 2, nombres: 'Juan Pérez', email: 'juan@example.com', estado: 'Activo', rol: 'Usuario' },
          { id: 3, nombres: 'María García', email: 'maria@example.com', estado: 'Inactivo', rol: 'Usuario' },
          { id: 4, nombres: 'Carlos López', email: 'carlos@example.com', estado: 'Activo', rol: 'Editor' },
        ];
        setUsuarios(datosEjemplo);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };
    cargarUsuarios();
  }, []);

  // Función para manejar el guardado (usando useCallback para memoización)
  const handleGuardar = useCallback((datosUsuario) => {
    try {
      setUsuarios(prevUsuarios => {
        if (datosUsuario.id) {
          // Editar usuario existente
          return prevUsuarios.map(usuario => 
            usuario.id === datosUsuario.id ? datosUsuario : usuario
          );
        } else {
          // Agregar nuevo usuario
          const nuevoId = Math.max(0, ...prevUsuarios.map(u => u.id)) + 1;
          return [...prevUsuarios, { ...datosUsuario, id: nuevoId }];
        }
      });
      setMostrarFormulario(false);
      setUsuarioEditando(null);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw error;
    }
  }, []);

  // Función para eliminar usuario con confirmación nativa
  const eliminarUsuario = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      setUsuarios(prevUsuarios => prevUsuarios.filter(u => u.id !== id));
    }
  };

  // Función para cambiar estado del usuario
  const cambiarEstadoUsuario = (id) => {
    setUsuarios(prevUsuarios => 
      prevUsuarios.map(usuario => 
        usuario.id === id 
          ? { ...usuario, estado: usuario.estado === 'Activo' ? 'Inactivo' : 'Activo' } 
          : usuario
      )
    );
  };

  // Lógica de ordenación optimizada
  const ordenarUsuarios = useCallback((campo) => {
    setOrdenarPor(campo);
    setOrdenAscendente(prev => ordenarPor === campo ? !prev : true);
  }, [ordenarPor]);

  // Preparar datos filtrados y ordenados
  const usuariosFiltrados = usuarios
  .filter(usuario => {
    if (!usuario || typeof usuario !== 'object') return false;
    
    const camposABuscar = ['nombres', 'email', 'rol', 'estado'];
    const strBusqueda = busqueda ? String(busqueda).toLowerCase() : '';
    
    const cumpleBusqueda = camposABuscar.some(campo => {
      const valor = usuario[campo];
      return valor && String(valor).toLowerCase().includes(strBusqueda);
    });
    
    const cumpleFiltroRol = filtros.rol === 'todos' || usuario.rol === filtros.rol;
    const cumpleFiltroEstado = filtros.estado === 'todos' || usuario.estado === filtros.estado;
    
    return cumpleBusqueda && cumpleFiltroRol && cumpleFiltroEstado;
  })
  .sort((a, b) => {
    // Función segura para obtener valores de ordenación
    const getSafeValue = (obj, key) => {
      const value = obj[key];
      return value === null || value === undefined 
        ? '' 
        : String(value).toLowerCase();
    };

    const valorA = getSafeValue(a, ordenarPor);
    const valorB = getSafeValue(b, ordenarPor);

    if (valorA < valorB) return ordenAscendente ? -1 : 1;
    if (valorA > valorB) return ordenAscendente ? 1 : -1;
    return 0;
  });

  // Paginación
  const totalRegistros = usuariosFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / registrosPorPagina));
  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = Math.min(indiceInicial + registrosPorPagina, totalRegistros);
  const usuariosPagina = usuariosFiltrados.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (pagina) => {
    setPaginaActual(Math.max(1, Math.min(pagina, totalPaginas)));
  };

  // Componente para los botones de acción
  const AccionesUsuario = ({ usuario }) => (
    <div className="action-buttons">
      <button 
        className="btn-icon edit-btn"
        onClick={() => {
          setUsuarioEditando(usuario);
          setMostrarFormulario(true);
        }}
        aria-label="Editar usuario"
      >
        <i className="fas fa-edit"></i>
      </button>
      <button 
        className="btn-icon delete-btn"
        onClick={() => eliminarUsuario(usuario.id)}
        aria-label="Eliminar usuario"
      >
        <i className="fas fa-trash"></i>
      </button>
      <button 
        className="btn-icon status-btn"
        onClick={() => cambiarEstadoUsuario(usuario.id)}
        aria-label={`Cambiar estado a ${usuario.estado === 'Activo' ? 'Inactivo' : 'Activo'}`}
      >
        <i className={`fas fa-toggle-${usuario.estado === 'Activo' ? 'on' : 'off'}`}></i>
      </button>
    </div>
  );

  return (
    <div className="container">
      {/* Formulario de usuario */}
      {mostrarFormulario && (
        <FormUsuarios
          usuario={usuarioEditando}
          onGuardar={handleGuardar}
          onCancelar={() => {
            setMostrarFormulario(false);
            setUsuarioEditando(null);
          }}
        />
      )}
      
      {/* Contenido principal */}
      <div className="content-card">
        <div className="header-actions">
          <h2>Administración de Usuarios</h2>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setUsuarioEditando(null);
              setMostrarFormulario(true);
            }}
          >
            <i className="fas fa-plus"></i> Nuevo Usuario
          </button>
        </div>
        
        {/* Controles de filtrado y búsqueda */}
        <div className="controls-row">
          <div className="filters-group">
            <div className="filter-control">
              <label>Rol:</label>
              <select 
                value={filtros.rol}
                onChange={(e) => {
                  setFiltros(prev => ({ ...prev, rol: e.target.value }));
                  setPaginaActual(1);
                }}
              >
                <option value="todos">Todos</option>
                <option value="Administrador">Administrador</option>
                <option value="Usuario">Usuario</option>
                <option value="Editor">Veterinario</option>
              </select>
            </div>
            
            <div className="filter-control">
              <label>Estado:</label>
              <select 
                value={filtros.estado}
                onChange={(e) => {
                  setFiltros(prev => ({ ...prev, estado: e.target.value }));
                  setPaginaActual(1);
                }}
              >
                <option value="todos">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          
          <div className="search-box">
            <div className="input-with-icon">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
                placeholder="Buscar usuarios..."
              />
            </div>
          </div>
        </div>
        
        {/* Tabla de usuarios */}
        <div className="table-responsive">
          <table className="usuarios-table">
            <thead>
              <tr>
                {['id', 'nombres', 'email', 'rol', 'estado'].map((campo) => (
                  <th 
                    key={campo} 
                    onClick={() => ordenarUsuarios(campo)}
                    className={ordenarPor === campo ? 'sorting-active' : ''}
                  >
                    {{
                      id: '#',
                      nombres: 'Nombres',
                      email: 'Email',
                      rol: 'Rol',
                      estado: 'Estado'
                    }[campo]}
                    {ordenarPor === campo && (
                      <i className={`fas fa-caret-${ordenAscendente ? 'up' : 'down'}`}></i>
                    )}
                  </th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPagina.length > 0 ? (
                usuariosPagina.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nombres}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <span className={`badge role-${usuario.rol.toLowerCase()}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td>
                      <span className={`badge status-${usuario.estado.toLowerCase()}`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td>
                      <AccionesUsuario usuario={usuario} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    <i className="fas fa-exclamation-circle"></i> No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando {indiceInicial + 1} a {indiceFinal} de {totalRegistros} registros
          </div>
          
          <div className="pagination-controls">
            <button 
              className={`pagination-btn ${paginaActual === 1 ? 'disabled' : ''}`}
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              <i className="fas fa-chevron-left"></i> Anterior
            </button>
            
            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
              let pagina;
              if (totalPaginas <= 5) {
                pagina = i + 1;
              } else if (paginaActual <= 3) {
                pagina = i + 1;
              } else if (paginaActual >= totalPaginas - 2) {
                pagina = totalPaginas - 4 + i;
              } else {
                pagina = paginaActual - 2 + i;
              }
              
              return (
                <button
                  key={pagina}
                  className={`pagination-btn ${paginaActual === pagina ? 'active' : ''}`}
                  onClick={() => cambiarPagina(pagina)}
                >
                  {pagina}
                </button>
              );
            })}
            
            <button 
              className={`pagination-btn ${paginaActual === totalPaginas ? 'disabled' : ''}`}
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <div className="page-size-selector">
            <span>Mostrar:</span>
            <select 
              value={registrosPorPagina} 
              onChange={(e) => {
                setRegistrosPorPagina(Number(e.target.value));
                setPaginaActual(1);
              }}
            >
              {[5, 10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>registros por página</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaUsuarios;