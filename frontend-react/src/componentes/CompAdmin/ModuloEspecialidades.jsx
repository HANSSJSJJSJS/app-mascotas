import React, { useState, useEffect, useRef } from 'react';
import '../../stylos/cssAdmin/ModEspecialidades.css';
import { exportarExcel } from '../../funcionalidades/expExcel';
import { exportarPDF } from '../../funcionalidades/expPDF';

function ModuloEspecialidades() {
  // Datos iniciales de especialidades
  const especialidadesIniciales = [
    { id: 1, nombre: 'Oftalmología' },
    { id: 2, nombre: 'Ginecología y Obstetricia' },
    { id: 3, nombre: 'Ortopedia' },
  ];

  // Estados
  const [especialidades, setEspecialidades] = useState(especialidadesIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);
  const [especialidadEditando, setEspecialidadEditando] = useState(null);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState({ nombre: '' });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [idParaEliminar, setIdParaEliminar] = useState(null);
  const [error, setError] = useState('');
  
  const modalRef = useRef(null);
  const nombreInputRef = useRef(null);

  // Efecto para manejar el foco en el modal
  useEffect(() => {
    if (mostrarModal && nombreInputRef.current) {
      nombreInputRef.current.focus();
    }
  }, [mostrarModal]);

  // Efecto para cerrar el modal al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        cerrarModal();
      }
    }
    
    if (mostrarModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarModal]);

  // Filtrar especialidades según la búsqueda
  const especialidadesFiltradas = especialidades.filter(esp => 
    esp.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Calcular índices para paginación
  const indexUltimo = paginaActual * registrosPorPagina;
  const indexPrimero = indexUltimo - registrosPorPagina;
  const especialidadesActuales = especialidadesFiltradas.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(especialidadesFiltradas.length / registrosPorPagina);

  // Crear array de números de página
  const numeroPaginas = [];
  for (let i = 1; i <= totalPaginas; i++) {
    numeroPaginas.push(i);
  }

  // Cambiar página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  // Ir a página anterior
  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  // Ir a página siguiente
  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  // Manejar cambio en registros por página
  const cambiarRegistrosPorPagina = (e) => {
    setRegistrosPorPagina(parseInt(e.target.value));
    setPaginaActual(1);
  };

  // Manejar búsqueda
  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  // Eliminar especialidad con confirmación
  const iniciarEliminarEspecialidad = (id) => {
    setIdParaEliminar(id);
    setMostrarConfirmacion(true);
  };

  const confirmarEliminarEspecialidad = () => {
    const nuevasEspecialidades = especialidades.filter(esp => esp.id !== idParaEliminar);
    setEspecialidades(nuevasEspecialidades);
    setMostrarConfirmacion(false);
    // Si estamos en una página que ya no existe después de eliminar, volvemos a la anterior
    if (especialidadesActuales.length === 1 && paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const cancelarEliminarEspecialidad = () => {
    setMostrarConfirmacion(false);
    setIdParaEliminar(null);
  };

  // Preparar para agregar nueva especialidad
  const prepararNuevaEspecialidad = () => {
    setModoEdicion(false);
    setNuevaEspecialidad({ nombre: '' });
    setError('');
    setMostrarModal(true);
  };
  
  // Función para abrir el modal de edición
  const abrirModalEdicion = (especialidad) => {
    setModoEdicion(true);
    setEspecialidadEditando(especialidad);
    setNuevaEspecialidad({...especialidad});
    setError('');
    setMostrarModal(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setEspecialidadEditando(null);
    setNuevaEspecialidad({ nombre: '' });
    setError('');
  };

  // Manejar cambio en el formulario
  const handleInputChange = (e) => {
    setNuevaEspecialidad({
      ...nuevaEspecialidad,
      [e.target.name]: e.target.value
    });
  };

  // Validar el formulario
  const validarFormulario = () => {
    if (!nuevaEspecialidad.nombre || nuevaEspecialidad.nombre.trim() === '') {
      setError('El nombre de la especialidad es obligatorio');
      return false;
    }

    // Verificar si ya existe la especialidad (ignorando la que estamos editando)
    const nombreExiste = especialidades.some(
      esp => esp.nombre.toLowerCase() === nuevaEspecialidad.nombre.toLowerCase() && 
      (!modoEdicion || (modoEdicion && esp.id !== especialidadEditando.id))
    );

    if (nombreExiste) {
      setError('Esta especialidad ya existe');
      return false;
    }

    return true;
  };

  // Guardar especialidad (nueva o editada)
  const guardarEspecialidad = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    if (modoEdicion) {
      // Actualizar especialidad existente
      const especialidadesActualizadas = especialidades.map(esp => 
        esp.id === especialidadEditando.id ? { ...esp, ...nuevaEspecialidad } : esp
      );
      setEspecialidades(especialidadesActualizadas);
    } else {
      // Agregar nueva especialidad
      const especialidadConId = {
        ...nuevaEspecialidad,
        id: especialidades.length > 0 ? Math.max(...especialidades.map(e => e.id)) + 1 : 1
      };
      setEspecialidades([...especialidades, especialidadConId]);
    }

    cerrarModal();
  };
  
  return (
    <div className="modulo-especialidades">
      <header className="modulo-header">
        <h1>MÓDULO DE REGISTROS DE ESPECIALIDADES</h1>
      </header>
      
      <main className="modulo-main">
        <div className="tabla-especialidades-container">
          {/* Sección de controles */}
          <section className="controls">
            <button type="button" className="btn btn-nuevo" onClick={prepararNuevaEspecialidad}>
              Nuevo
            </button>
            <button type="button" className="btn btn-excel" onClick={exportarExcel}>
              Excel
            </button>
            <button type="button" className="btn btn-pdf" onClick={exportarPDF}>
              PDF
            </button>
          </section>

          {/* Sección de filtros */}
          <section className="filters">
            <div className="show-entries">
              <label htmlFor="show-entries">Mostrar</label>
              <select 
                id="show-entries" 
                value={registrosPorPagina} 
                onChange={cambiarRegistrosPorPagina}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>registros</span>
            </div>

            <div className="search-box">
              <label htmlFor="search">Buscar:</label>
              <input 
                type="search" 
                id="search" 
                value={busqueda} 
                onChange={manejarBusqueda} 
                placeholder="Buscar especialidad..."
              />
            </div>
          </section>

          {/* Tabla de especialidades */}
          <section className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="column-id">#</th>
                  <th className="column-nombre">ESPECIALIDAD</th>
                  <th className="column-acciones">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {especialidadesActuales.length > 0 ? (
                  especialidadesActuales.map((especialidad) => (
                    <tr key={especialidad.id}>
                      <td>{especialidad.id}</td>
                      <td>{especialidad.nombre}</td>
                      <td>
                      <div className="actions">
                        <button 
                          className="action-btn edit" 
                          onClick={() => abrirModalEdicion(especialidad)}
                          aria-label="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => iniciarEliminarEspecialidad(especialidad.id)}
                          aria-label="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-records">
                      {busqueda ? 'No se encontraron especialidades con ese término' : 'No hay especialidades registradas'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
          
          {/* Paginación */}
          <section className="pagination">
            <p className="page-info">
              {especialidadesFiltradas.length === 0 
                ? 'No hay registros para mostrar' 
                : `Mostrando del ${indexPrimero + 1} al ${Math.min(indexUltimo, especialidadesFiltradas.length)} de un total de ${especialidadesFiltradas.length} registros`
              }
            </p>
            <div className="page-controls">
              <button 
                className="page-button" 
                onClick={paginaAnterior} 
                disabled={paginaActual === 1 || totalPaginas === 0}
              >
                Anterior
              </button>
              
              {numeroPaginas.map(numero => (
                <button 
                  key={numero}
                  className={`page-button ${paginaActual === numero ? 'active' : ''}`}
                  onClick={() => cambiarPagina(numero)}
                >
                  {numero}
                </button>
              ))}
              
              <button 
                className="page-button" 
                onClick={paginaSiguiente} 
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
              >
                Siguiente
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Modal para agregar/editar especialidad */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-container" ref={modalRef}>
            <div className="modal-header">
              <h2>{modoEdicion ? 'Editar Especialidad' : 'Nueva Especialidad'}</h2>
              <button className="modal-close" onClick={cerrarModal} aria-label="Cerrar">
              </button>
            </div>
            
            <form onSubmit={guardarEspecialidad} className="modal-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre de la especialidad:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={nuevaEspecialidad.nombre || ''}
                  onChange={handleInputChange}
                  ref={nombreInputRef}
                  placeholder="Ingrese el nombre de la especialidad"
                  className={error ? 'input-error' : ''}
                  autoComplete="off"
                />
                {error && <p className="error-message">{error}</p>}
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-guardar">
                  {modoEdicion ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {mostrarConfirmacion && (
        <div className="modal-overlay">
          <div className="modal-container modal-confirmacion" ref={modalRef}>
            <div className="modal-header">
              <h2>Confirmar eliminación</h2>
              <button className="modal-close" onClick={cancelarEliminarEspecialidad} aria-label="Cerrar">
              </button>
            </div>
            
            <div className="modal-body">
              <p>¿Está seguro de que desea eliminar esta especialidad?</p>
              <p>Esta acción no se puede deshacer.</p>
            </div>
            
              <button type="button" className="btn btn-eliminar" onClick={confirmarEliminarEspecialidad}>
                Eliminar
              </button>
            </div>
          </div>
      )}
    </div>
  );
}

export default ModuloEspecialidades;