import { useState } from 'react';
import '../../stylos/cssAdmin/ModuloAdministradores.css';

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

export default function ModuloEspecialistas() {
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
    nacionalidad: "Colombia",
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
    setPaginaActual(1);
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
      nacionalidad: "Colombia",
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

  // Función para guardar un especialista
  const guardarEspecialista = () => {
    if (!nuevoEspecialista.nombre || !nuevoEspecialista.especialidad || 
        !nuevoEspecialista.telefono || !nuevoEspecialista.nacionalidad || 
        !nuevoEspecialista.correo) {
      alert('Por favor complete todos los campos');
      return;
    }

    if (especialistaEditando) {
      setEspecialistas(especialistas.map(esp => 
        esp.id === especialistaEditando.id ? {...nuevoEspecialista, id: esp.id} : esp
      ));
    } else {
      const nuevoId = especialistas.length > 0 ? Math.max(...especialistas.map(esp => esp.id)) + 1 : 1;
      setEspecialistas([...especialistas, {...nuevoEspecialista, id: nuevoId}]);
    }
    setMostrarModal(false);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const exportarExcel = () => {
    alert('Funcionalidad para exportar a Excel implementada');
  };

  const exportarPDF = () => {
    alert('Funcionalidad para exportar a PDF implementada');
  };

  return (
    <div className="contenedor-especialistas">
      {/* Header */}
      <div className="header-section">
        <h1>Administración de Especialistas</h1>
        <button className="btn-nuevo" onClick={abrirModalNuevo}>
          Nuevo Especialista
        </button>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="controls-left">
          <div className="registros-selector">
            <span>Mostrar</span>
            <select
              value={registrosPorPagina}
              onChange={(e) => {
                setRegistrosPorPagina(Number(e.target.value));
                setPaginaActual(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>registros</span>
          </div>

          <div className="export-buttons">
            <button className="btn-excel" onClick={exportarExcel}>
              Excel
            </button>
            <button className="btn-pdf" onClick={exportarPDF}>
              PDF
            </button>
          </div>
        </div>

        <div className="controls-right">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar especialistas..."
            value={busqueda}
            onChange={manejarBusqueda}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="especialistas-table">
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
            {especialistasActuales.map((especialista, index) => (
              <tr key={especialista.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td>{especialista.id}</td>
                <td>{especialista.nombre}</td>
                <td>{especialista.especialidad}</td>
                <td>{especialista.telefono}</td>
                <td>{especialista.nacionalidad}</td>
                <td>{especialista.correo}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => abrirModalEdicion(especialista)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => eliminarEspecialista(especialista.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-section">
        <p className="pagination-info">
          Mostrando del {indexPrimerRegistro + 1} al {Math.min(indexUltimoRegistro, especialistasFiltrados.length)} de un total de {especialistasFiltrados.length} registros
        </p>

        <div className="pagination-controls">
          <button
            className={`pagination-btn ${paginaActual === 1 ? 'disabled' : ''}`}
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn ${paginaActual === i + 1 ? 'active' : ''}`}
              onClick={() => cambiarPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className={`pagination-btn ${paginaActual === totalPaginas ? 'disabled' : ''}`}
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>{especialistaEditando ? 'Editar Especialista' : 'Nuevo Especialista'}</h2>

            <div className="form-container">
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={nuevoEspecialista.nombre}
                  onChange={manejarCambioInput}
                />
              </div>

              <div className="form-group">
                <label>Especialidad:</label>
                <input
                  type="text"
                  name="especialidad"
                  value={nuevoEspecialista.especialidad}
                  onChange={manejarCambioInput}
                />
              </div>

              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="text"
                  name="telefono"
                  value={nuevoEspecialista.telefono}
                  onChange={manejarCambioInput}
                />
              </div>

              <div className="form-group">
                <label>Nacionalidad:</label>
                <input
                  type="text"
                  name="nacionalidad"
                  value={nuevoEspecialista.nacionalidad}
                  onChange={manejarCambioInput}
                />
              </div>

              <div className="form-group">
                <label>Correo:</label>
                <input
                  type="email"
                  name="correo"
                  value={nuevoEspecialista.correo}
                  onChange={manejarCambioInput}
                />
              </div>

              <div className="modal-buttons">
                <button className="btn-cancel" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button className="btn-save" onClick={guardarEspecialista}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}