import React, { useState, useEffect } from 'react';
import FormUsuarios from './FormUsuarios';
import { exportarExcel } from '../../funcionalidades/expExcel';
import { exportarPDF } from '../../funcionalidades/expPDF';
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

  // Cargar datos iniciales
  useEffect(() => {
    console.log('Cargando datos iniciales');
    const datosEjemplo = [
      { id: 1, nombres: 'Admin SC', email: 'admin@gmail.com', rol: 'Administrador' },
      { id: 2, nombres: 'Juan Pérez', email: 'juan@example.com', rol: 'Usuario' },
    ];
    setUsuarios(datosEjemplo);
  }, []);

  // Función para manejar el guardado (unificada)
  const handleGuardar = (datosUsuario) => {
    console.log('TablaUsuarios recibió datos para guardar:', datosUsuario);
    
    try {
      if (datosUsuario.id) {
        // Editar usuario existente
        console.log('Editando usuario existente ID:', datosUsuario.id);
        setUsuarios(prevUsuarios => 
          prevUsuarios.map(usuario => 
            usuario.id === datosUsuario.id ? datosUsuario : usuario
          )
        );
      } else {
        // Agregar nuevo usuario
        console.log('Agregando nuevo usuario');
        const nuevoId = Math.max(0, ...usuarios.map(u => u.id)) + 1;
        setUsuarios(prevUsuarios => [
          ...prevUsuarios, 
          { ...datosUsuario, id: nuevoId }
        ]);
      }
      
      // Cerrar formulario y limpiar estado de edición
      setMostrarFormulario(false);
      setUsuarioEditando(null);
      
      console.log('Guardado exitoso');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert(`Error al guardar: ${error.message || 'Error desconocido'}`);
    }
  };

  // Función para cancelar
  const handleCancelar = () => {
    console.log('Cancelando formulario');
    setMostrarFormulario(false);
    setUsuarioEditando(null);
  };

  // Función para eliminar usuario
  const eliminarUsuario = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      console.log('Eliminando usuario ID:', id);
      setUsuarios(prevUsuarios => prevUsuarios.filter(u => u.id !== id));
    }
  };

  // Lógica de ordenación
  const ordenarUsuarios = (campo) => {
    const esAscendente = ordenarPor === campo ? !ordenAscendente : true;
    setOrdenarPor(campo);
    setOrdenAscendente(esAscendente);
  };

  // Preparar datos filtrados y ordenados
  const usuariosFiltrados = [...usuarios]
    .sort((a, b) => {
      if (a[ordenarPor] < b[ordenarPor]) return ordenAscendente ? -1 : 1;
      if (a[ordenarPor] > b[ordenarPor]) return ordenAscendente ? 1 : -1;
      return 0;
    })
    .filter(usuario =>
      Object.values(usuario).some(
        valor => valor !== null && 
                valor !== undefined && 
                valor.toString().toLowerCase().includes(busqueda.toLowerCase())
      )
    );

  // Paginación
  const totalRegistros = usuariosFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / registrosPorPagina));
  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = Math.min(indiceInicial + registrosPorPagina, totalRegistros);
  const usuariosPagina = usuariosFiltrados.slice(indiceInicial, indiceFinal);

  const cambiarPagina = (pagina) => {
    setPaginaActual(Math.max(1, Math.min(pagina, totalPaginas)));
  };

  // Exportación
  const handleExportarExcel = () => {
    exportarExcel(usuariosFiltrados, 'usuarios');
  };

  const handleExportarPDF = () => {
    exportarPDF(usuariosFiltrados, 'usuarios');
  };

  return (
    <div className="container">
      {mostrarFormulario && (
        <FormUsuarios
          usuario={usuarioEditando}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        />
      )}

      <div className="content-card">
        <div className="button-group">
          <button 
            className="btn btn-primary"
            onClick={() => {
              console.log('Abriendo formulario para nuevo usuario');
              setUsuarioEditando(null);
              setMostrarFormulario(true);
            }}
          >
            Nuevo
          </button>
          <button className="btn btn-primary" onClick={handleExportarExcel}>
            Excel
          </button>
          <button className="btn btn-primary" onClick={handleExportarPDF}>
            PDF
          </button>
        </div>
        
        <div className="controls-row">
          <div className="show-entries">
            <span>Mostrar</span>
            <select 
              value={registrosPorPagina} 
              onChange={(e) => {
                setRegistrosPorPagina(Number(e.target.value));
                setPaginaActual(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>registros</span>
          </div>
          
          <div className="search-box">
            <span>Buscar:</span>
            <input 
              type="text" 
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th onClick={() => ordenarUsuarios('id')}>
                # {ordenarPor === 'id' && (ordenAscendente ? '↑' : '↓')}
              </th>
              <th onClick={() => ordenarUsuarios('nombres')}>
                Nombres {ordenarPor === 'nombres' && (ordenAscendente ? '↑' : '↓')}
              </th>
              <th onClick={() => ordenarUsuarios('email')}>
                Email {ordenarPor === 'email' && (ordenAscendente ? '↑' : '↓')}
              </th>
              <th onClick={() => ordenarUsuarios('rol')}>
                Rol {ordenarPor === 'rol' && (ordenAscendente ? '↑' : '↓')}
              </th>
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
                  <td><span className={`role-badge ${usuario.rol.toLowerCase()}`}>{usuario.rol}</span></td>
                  <td>
                    <div className="action-buttons">
                      <span 
                        className="edit-btn"
                        onClick={() => {
                          console.log('Editando usuario:', usuario);
                          setUsuarioEditando(usuario);
                          setMostrarFormulario(true);
                        }}
                      >
                        ✏️
                      </span>
                      <span 
                        className="delete-btn"
                        onClick={() => eliminarUsuario(usuario.id)}
                      >
                        🗑️
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{textAlign: 'center'}}>No hay usuarios para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="pagination">
          <div className="page-info">
            Mostrando del {totalRegistros ? indiceInicial + 1 : 0} al {indiceFinal} de {totalRegistros} registros
          </div>
          <div className="page-controls">
            <button 
              className="page-btn" 
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                className={`page-btn ${paginaActual === num ? 'active' : ''}`}
                onClick={() => cambiarPagina(num)}
              >
                {num}
              </button>
            ))}
            
            <button 
              className="page-btn" 
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaUsuarios;