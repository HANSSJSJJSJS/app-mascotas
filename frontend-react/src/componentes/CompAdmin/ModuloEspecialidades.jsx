import React, { useState } from 'react';
import '../stylos/cssAdmin/ModEspecialidades.css';

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
                    <div className="action-icons">
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        abrirModalEdicion(especialista);
                      }} aria-label="Editar">✏️</a>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        eliminarEspecialista(especialista.id);
                      }} aria-label="Eliminar">🗑️</a>
                    </div>   
              </tr>
            </thead>
            <tbody>
              {especialidadesActuales.map((especialidad) => (
                <tr key={especialidad.id}>
                  <td>{especialidad.id}</td>
                  <td>{especialidad.nombre}</td>
                  <td>
                    <div className="actions">
                      <span className="edit-icon">
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </span>
                      <span 
                        className="delete-icon" 
                        onClick={() => eliminarEspecialidad(especialidad.id)}
                      >
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </span>
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