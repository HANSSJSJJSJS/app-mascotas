import { useState, useEffect } from 'react';
import '../stylos/cssAdmin/ModuloEspecialistas.css';

const especialistasIniciales = [
  {
    id: 1,
    nombre: "Dr. Carlos Sánchez",
    especialidad: "Oftalmología",
    telefono: "934524223",
    nacionalidad: "Colombia",
    correo: "adsa@gmail.com"
  },
  {
    id: 2,
    nombre: "Dr. Juan Pérez",
    especialidad: "Cardiología",
    telefono: "934524275",
    nacionalidad: "Colombia",
    correo: "juan@gmail.com"
  },
  {
    id: 3,
    nombre: "Dra. María Rodríguez",
    especialidad: "Dermatología",
    telefono: "993473765",
    nacionalidad: "Colombia",
    correo: "maria@gmail.com"
  },
];

export default function App() {
  // Estados
  const [especialistas, setEspecialistas] = useState(especialistasIniciales);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [especialistaEditando, setEspecialistaEditando] = useState(null);
  const [nuevoEspecialista, setNuevoEspecialista] = useState({
    nombre: "",
    especialidad: "",
    telefono: "",
    nacionalidad: "Colombiana",
    correo: ""
  });

  // Filtrar especialistas según la búsqueda
  const especialistasFiltrados = especialistas.filter(especialista => 
    Object.values(especialista).some(valor => 
      valor.toString().toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  // Calcular índices para la paginación
  const indexUltimoRegistro = paginaActual * registrosPorPagina;
  const indexPrimerRegistro = indexUltimoRegistro - registrosPorPagina;
  const especialistasActuales = especialistasFiltrados.slice(indexPrimerRegistro, indexUltimoRegistro);
  const totalPaginas = Math.ceil(especialistasFiltrados.length / registrosPorPagina);

  // Función para cambiar de página
  const cambiarPagina = (numeroPagina) => {
    if (numeroPagina > 0 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  // Función para manejar la búsqueda
  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1); // Regresar a la primera página al buscar
  };

  // Función para eliminar un especialista
  const eliminarEspecialista = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este especialista?')) {
      setEspecialistas(especialistas.filter(esp => esp.id !== id));
    }
  };

  // Función para abrir el modal de edición
  const abrirModalEdicion = (especialista) => {
    setEspecialistaEditando(especialista);
    setNuevoEspecialista({...especialista});
    setMostrarModal(true);
  };

  // Función para abrir el modal de nuevo especialista
  const abrirModalNuevo = () => {
    setEspecialistaEditando(null);
    setNuevoEspecialista({
      nombre: "",
      especialidad: "",
      telefono: "",
      nacionalidad: "Peruana",
      correo: ""
    });
    setMostrarModal(true);
  };

  // Función para manejar cambios en el formulario
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoEspecialista(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para guardar un especialista (nuevo o editado)
  const guardarEspecialista = (e) => {
    e.preventDefault();
    
    if (especialistaEditando) {
      // Actualizar especialista existente
      setEspecialistas(especialistas.map(esp => 
        esp.id === especialistaEditando.id ? {...nuevoEspecialista, id: esp.id} : esp
      ));
    } else {
      // Añadir nuevo especialista
      const nuevoId = especialistas.length > 0 ? Math.max(...especialistas.map(esp => esp.id)) + 1 : 1;
      setEspecialistas([...especialistas, {...nuevoEspecialista, id: nuevoId}]);
    }
    setMostrarModal(false);
  };

  // Función para exportar a Excel
  const exportarExcel = () => {
    // En una aplicación real, aquí iría la lógica para crear y descargar un archivo Excel
    alert('Funcionalidad para exportar a Excel implementada');
  };

  // Función para exportar a PDF
  const exportarPDF = () => {
    // En una aplicación real, aquí iría la lógica para crear y descargar un archivo PDF
    alert('Funcionalidad para exportar a PDF implementada');
  };

  return (
    <div className="app">
      <header>
        <h1>MÓDULO DE REGISTROS DE ESPECIALISTA</h1>
      </header>
      
      <main>
        <section className="actions">
          <button onClick={abrirModalNuevo}>Nuevo</button>
          <button onClick={exportarExcel}>Excel</button>
          <button onClick={exportarPDF}>PDF</button>
        </section>
        
        <section className="table-controls">
          <div className="records-display">
            <label htmlFor="show-records">Mostrar</label>
            <select 
              id="show-records" 
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
            <label htmlFor="search">Buscar:</label>
            <input 
              type="text" 
              id="search" 
              value={busqueda} 
              onChange={manejarBusqueda}
            />
          </div>
        </section>
        
        <section className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ESPECIALISTA</th>
                <th>ESPECIALIDAD</th>
                <th>TELÉFONO</th>
                <th>NACIONALIDAD</th>
                <th>CORREO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {especialistasActuales.map((especialista) => (
                <tr key={especialista.id}>
                  <td>{especialista.id}</td>
                  <td>{especialista.nombre}</td>
                  <td>{especialista.especialidad}</td>
                  <td>{especialista.telefono}</td>
                  <td>{especialista.nacionalidad}</td>
                  <td>{especialista.correo}</td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        
        <footer className="pagination">
          <p>
            Mostrando del {indexPrimerRegistro + 1} al {
              Math.min(indexUltimoRegistro, especialistasFiltrados.length)
            } de total {especialistasFiltrados.length} registros
          </p>
          <nav className="page-buttons">
            <a 
              href="#" 
              className="page-button" 
              onClick={(e) => {
                e.preventDefault();
                cambiarPagina(paginaActual - 1);
              }}
            >
              Anterior
            </a>
            {Array.from({ length: totalPaginas }, (_, i) => (
              <a 
                key={i + 1}
                href="#" 
                className={`page-button ${paginaActual === i + 1 ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  cambiarPagina(i + 1);
                }}
              >
                {i + 1}
              </a>
            ))}
            <a 
              href="#" 
              className="page-button" 
              onClick={(e) => {
                e.preventDefault();
                cambiarPagina(paginaActual + 1);
              }}
            >
              Siguiente
            </a>
          </nav>
        </footer>
      </main>

      {/* Modal para crear/editar especialistas */}
      {mostrarModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{especialistaEditando ? 'Editar Especialista' : 'Nuevo Especialista'}</h2>
            <form onSubmit={guardarEspecialista}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  value={nuevoEspecialista.nombre} 
                  onChange={manejarCambioInput}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="especialidad">Especialidad:</label>
                <input 
                  type="text" 
                  id="especialidad" 
                  name="especialidad" 
                  value={nuevoEspecialista.especialidad} 
                  onChange={manejarCambioInput}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono:</label>
                <input 
                  type="text" 
                  id="telefono" 
                  name="telefono" 
                  value={nuevoEspecialista.telefono} 
                  onChange={manejarCambioInput}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="nacionalidad">Nacionalidad:</label>
                <input 
                  type="text" 
                  id="nacionalidad" 
                  name="nacionalidad" 
                  value={nuevoEspecialista.nacionalidad} 
                  onChange={manejarCambioInput}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="correo">Correo:</label>
                <input 
                  type="email" 
                  id="correo" 
                  name="correo" 
                  value={nuevoEspecialista.correo} 
                  onChange={manejarCambioInput}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setMostrarModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}