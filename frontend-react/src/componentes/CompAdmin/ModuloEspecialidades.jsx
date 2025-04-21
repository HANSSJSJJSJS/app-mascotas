import React, { useState } from 'react';
import '../../stylos/cssAdmin/ModEspecialidades.css';

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
  const [nuevoEspecialidad, setNuevoEspecialidad] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);

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

  // Eliminar especialidad
  const eliminarEspecialidad = (id) => {
    const nuevasEspecialidades = especialidades.filter(esp => esp.id !== id);
    setEspecialidades(nuevasEspecialidades);
  };

  // Agregar nueva especialidad
  const agregarEspecialidad = () => {
    const nuevaEspecialidad = {
      id: especialidades.length + 1,
      nombre: 'Nueva Especialidad'
    };
    setEspecialidades([...especialidades, nuevaEspecialidad]);
  };
  
  // Función para abrir el modal de edición
  const abrirModalEdicion = (especialidad) => {
    setEspecialidadEditando(especialidad);
    setNuevoEspecialidad({...especialidad});
    setMostrarModal(true);
  };

  return (
    <div className="app">
      <header>
        <h1>MÓDULO DE REGISTROS DE ESPECIALIDADES</h1>
      </header>
      
      <main>
        {/* Sección de controles */}
        <section className="controls">
          <button type="button" onClick={agregarEspecialidad}>Nuevo</button>
          <button type="button">Excel</button>
          <button type="button">PDF</button>
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
            />
          </div>
        </section>

        {/* Tabla de especialidades */}
        <section>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ESPECIALIDAD</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {especialidadesActuales.map((especialidad) => (
                <tr key={especialidad.id}>
                  <td>{especialidad.id}</td>
                  <td>{especialidad.nombre}</td>
                  <td>
                    <div className="action-icons">
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        abrirModalEdicion(especialidad);
                      }} aria-label="Editar">✏️</a>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        eliminarEspecialidad(especialidad.id);
                      }} aria-label="Eliminar">🗑️</a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Paginación */}
        <section className="pagination">
          <p className="page-info">
            {especialidadesFiltradas.length === 0 
              ? 'No hay registros para mostrar' 
              : `Mostrando del ${indexPrimero + 1} al ${Math.min(indexUltimo, especialidadesFiltradas.length)} de total ${especialidadesFiltradas.length} registros`
            }
          </p>
          <div className="page-controls">
            <button 
              className="page-button" 
              onClick={paginaAnterior} 
              disabled={paginaActual === 1}
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
      </main>
    </div>
  );
}

export default ModuloEspecialidades;