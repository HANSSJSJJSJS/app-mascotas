import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../stylos/cssAdmin/ModuloEspecialistas.css';

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
  const [error, setError] = useState('');

  // Función para exportar a Excel
  const exportarExcel = () => {
    const excelData = especialistasFiltrados.map(esp => ({
      'ID': esp.id,
      'Nombre': esp.nombre,
      'Especialidad': esp.especialidad,
      'Teléfono': esp.telefono,
      'Nacionalidad': esp.nacionalidad,
      'Correo': esp.correo
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Especialistas');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(blob, 'Especialistas.xlsx');
  };

  // Función para exportar a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    
    doc.text('Lista de Especialistas', 14, 15);
    
    const tableData = especialistasFiltrados.map(esp => [
      esp.id,
      esp.nombre,
      esp.especialidad,
      esp.telefono,
      esp.nacionalidad,
      esp.correo
    ]);
    
    autoTable(doc, {
      head: [['ID', 'Nombre', 'Especialidad', 'Teléfono', 'Nacionalidad', 'Correo']],
      body: tableData,
      startY: 20,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        1: { cellWidth: 30 }, // Ancho para nombre
        2: { cellWidth: 25 }  // Ancho para especialidad
      }
    });
    
    doc.save('Especialistas.pdf');
  };

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
    setError('');
    setMostrarModal(true);
  };

  // Función para abrir el modal de nuevo especialista
  const abrirModalNuevo = () => {
    setEspecialistaEditando(null);
    setNuevoEspecialista({
      nombre: "",
      especialidad: "",
      telefono: "",
      nacionalidad: "Colombiana",
      correo: ""
    });
    setError('');
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

  // Validar formulario
  const validarFormulario = () => {
    if (!nuevoEspecialista.nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!nuevoEspecialista.especialidad.trim()) {
      setError('La especialidad es obligatoria');
      return false;
    }
    if (!nuevoEspecialista.telefono.trim()) {
      setError('El teléfono es obligatorio');
      return false;
    }
    if (!nuevoEspecialista.correo.trim()) {
      setError('El correo es obligatorio');
      return false;
    }
    if (!nuevoEspecialista.correo.includes('@')) {
      setError('Ingrese un correo válido');
      return false;
    }
    
    setError('');
    return true;
  };

  // Función para guardar un especialista (nuevo o editado)
  const guardarEspecialista = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

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

  // Generar números de página con límite de 5
  const getNumerosPagina = () => {
    const paginas = [];
    const paginasTotales = Math.ceil(especialistasFiltrados.length / registrosPorPagina);
    let inicio = 1;
    let fin = paginasTotales;

    if (paginasTotales > 5) {
      if (paginaActual <= 3) {
        fin = 5;
      } else if (paginaActual >= paginasTotales - 2) {
        inicio = paginasTotales - 4;
      } else {
        inicio = paginaActual - 2;
        fin = paginaActual + 2;
      }
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  };

  return (
    <div className="modulo-especialistas">
      <header className="modulo-header">
        <h1>MODULO DE REGISTROS DE ESPECIALISTAS</h1>
      </header>
      
      <main className="modulo-main">
        <div className="tabla-especialistas-container">
          {/* Sección de controles */}
          <section className="controls">
            <div className="controls-left">
              <button 
                type="button" 
                className="btn btn-nuevo" 
                onClick={abrirModalNuevo}
              >
                <i className="fa fa-plus"></i> Nuevo Especialista
              </button>
            </div>
            
            <div className="controls-right">
              <div className="show-entries">
                <label htmlFor="show-entries">Mostrar</label>
                <select 
                  id="show-entries" 
                  value={registrosPorPagina} 
                  onChange={(e) => {
                    setRegistrosPorPagina(Number(e.target.value));
                    setPaginaActual(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span>registros</span>
              </div>

              <div className="search-box">
                <input 
                  type="search" 
                  value={busqueda} 
                  onChange={manejarBusqueda}
                  placeholder="Buscar especialista..."
                />
                <i className="fa fa-search"></i>
              </div>
            </div>
          </section>

          {/* Sección de exportación */}
          <section className="export-buttons">
            <button className="btn btn-excel" onClick={exportarExcel}>
              <i className="fa fa-file-excel-o"></i> Excel
            </button>
            <button className="btn btn-pdf" onClick={exportarPDF}>
              <i className="fa fa-file-pdf-o"></i> PDF
            </button>
          </section>

          {/* Tabla de especialistas */}
          <section className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="column-id">#</th>
                  <th className="column-nombre">ESPECIALISTA</th>
                  <th className="column-especialidad">ESPECIALIDAD</th>
                  <th className="column-telefono">TELÉFONO</th>
                  <th className="column-nacionalidad">NACIONALIDAD</th>
                  <th className="column-correo">CORREO</th>
                  <th className="column-acciones">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {especialistasActuales.length > 0 ? (
                  especialistasActuales.map((especialista) => (
                    <tr key={especialista.id}>
                      <td>{especialista.id}</td>
                      <td>{especialista.nombre}</td>
                      <td>{especialista.especialidad}</td>
                      <td>{especialista.telefono}</td>
                      <td>{especialista.nacionalidad}</td>
                      <td>{especialista.correo}</td>
                      <td>
                        <div className="actions">
                          <button 
                            className="action-btn edit" 
                            onClick={() => abrirModalEdicion(especialista)}
                            aria-label="Editar"
                            title="Editar"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button 
                            className="action-btn delete" 
                            onClick={() => eliminarEspecialista(especialista.id)}
                            aria-label="Eliminar"
                            title="Eliminar"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-records">
                      {busqueda ? 'No se encontraron especialistas con ese término' : 'No hay especialistas registrados'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
          
          {/* Paginación */}
          <section className="pagination">
            <p className="page-info">
              {especialistasFiltrados.length === 0 
                ? 'No hay registros para mostrar' 
                : `Mostrando del ${indexPrimerRegistro + 1} al ${Math.min(indexUltimoRegistro, especialistasFiltrados.length)} de un total de ${especialistasFiltrados.length} registros`
              }
            </p>
            <div className="page-controls">
              <button 
                className="page-button" 
                onClick={() => cambiarPagina(paginaActual - 1)} 
                disabled={paginaActual === 1 || totalPaginas === 0}
              >
                <i className="fa fa-chevron-left"></i> Anterior
              </button>
              
              {getNumerosPagina().map(numero => (
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
                onClick={() => cambiarPagina(paginaActual + 1)} 
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
              >
                Siguiente <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Modal para crear/editar especialistas */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{especialistaEditando ? 'Editar Especialista' : 'Nuevo Especialista'}</h2>
              <button className="modal-close" onClick={() => setMostrarModal(false)} aria-label="Cerrar">
                <i className="fa fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={guardarEspecialista} className="modal-form">
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
                <select
                  id="nacionalidad" 
                  name="nacionalidad" 
                  value={nuevoEspecialista.nacionalidad} 
                  onChange={manejarCambioInput}
                  required
                >
                  <option value="Colombiana">Colombiana</option>
                  <option value="Peruana">Peruana</option>
                  <option value="Mexicana">Mexicana</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chilena">Chilena</option>
                </select>
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
              
              {error && <p className="error-message">{error}</p>}
              
              <div className="modal-actions">
                <button type="button" className="btn btn-cancelar" onClick={() => setMostrarModal(false)}>
                  <i className="fa fa-times"></i> Cancelar
                </button>
                <button type="submit" className="btn btn-guardar">
                  <i className="fa fa-save"></i> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}