import React, { useState, useEffect } from 'react';
import TablaCitas from './TablaCitas';
import '../../stylos/cssAdmin/ModuloCitas.css';
import { exportarExcel } from '../../funcionalidades/expExcel';
import { exportarPDF } from '../../funcionalidades/expPDF';

const ModuloCitas = () => {
  const citasData = [
    {
      id: 1,
      paciente: 'edgar lucas',
      descripcion: 'sdfdsf',
      especialista: 'Dr. Carlos Sánchez',
      especialidad: 'Oftalmología',
      fecha: '18, Septiembre 2023',
      horaInicio: '13:45',
      estado: 'pendiente'
    },
    {
      id: 2,
      paciente: 'edgar lucas',
      descripcion: 'asdasdasd',
      especialista: 'Dr. Carlos Sánchez',
      especialidad: 'Oftalmología',
      fecha: '25, Septiembre 2023',
      horaInicio: '13:45',
      estado: 'pendiente'
    },
  ]

  const [citas, setCitas] = useState(citasData);
  const [filteredCitas, setFilteredCitas] = useState(citasData);
  const [search, setSearch] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newCita, setNewCita] = useState({
    id: null,
    paciente: '',
    descripcion: '',
    especialista: '',
    especialidad: '',
    fecha: '',
    horaInicio: '',
    estado: 'pendiente'
  });

  //Filtros de paginas citas
  useEffect(() => {
    let result = citas;
    
    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      result = result.filter(cita => 
        cita.paciente.toLowerCase().includes(searchTerm) ||
        cita.especialista.toLowerCase().includes(searchTerm) ||
        cita.especialidad.toLowerCase().includes(searchTerm) ||
        cita.descripcion.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredCitas(result);
    setCurrentPage(1); // Reset to first page when filtering
  }, [search, citas]);

  // Get current page records
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCitas.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCitas.length / recordsPerPage);

  // Handlers
  const handleExportExcel = () => {
    exportarExcel(filteredCitas, 'Citas_Medicas');
  };

  const handleExportPDF = () => {
    exportarPDF(filteredCitas, 'Citas_Medicas');
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing records per page
  };

  const handleNewCitaClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setNewCita({
      id: null,
      paciente: '',
      descripcion: '',
      especialista: '',
      especialidad: '',
      fecha: '',
      horaInicio: '',
      estado: 'pendiente'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCita({
      ...newCita,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextId = Math.max(...citas.map(cita => cita.id)) + 1;
    const citaToAdd = {
      ...newCita,
      id: nextId
    };
    
    setCitas([...citas, citaToAdd]);
    handleFormClose();
  };

  const handleAcceptCita = (id) => {
    setCitas(citas.map(cita => 
      cita.id === id ? { ...cita, estado: 'confirmada' } : cita
    ));
  };

  const handleCancelCita = (id) => {
    setCitas(citas.map(cita => 
      cita.id === id ? { ...cita, estado: 'cancelada' } : cita
    ));
  };

  const handleDeleteCita = (id) => {
    if (window.confirm('¿Está seguro que desea eliminar esta cita?')) {
      setCitas(citas.filter(cita => cita.id !== id));
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <header>
        <h1>MODULO DE REGISTROS DE CITAS</h1>
      </header>
      
      {/* Modal Form for New Appointment */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nueva Cita</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="paciente">Paciente:</label>
                <input 
                  type="text" 
                  id="paciente" 
                  name="paciente" 
                  value={newCita.paciente} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="especialista">Especialista:</label>
                <input 
                  type="text" 
                  id="especialista" 
                  name="especialista" 
                  value={newCita.especialista} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="especialidad">Especialidad:</label>
                <input 
                  type="text" 
                  id="especialidad" 
                  name="especialidad" 
                  value={newCita.especialidad} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fecha">Fecha:</label>
                <input 
                  type="date" 
                  id="fecha" 
                  name="fecha" 
                  value={newCita.fecha} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="horaInicio">Hora:</label>
                <input 
                  type="time" 
                  id="horaInicio" 
                  name="horaInicio" 
                  value={newCita.horaInicio} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción:</label>
                <textarea 
                  id="descripcion" 
                  name="descripcion" 
                  value={newCita.descripcion} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-buttons">
                <button type="button" className="btn btn-cancel" onClick={handleFormClose}>Cancelar</button>
                <button type="submit" className="btn btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="content-card">
        <div className="button-group">
          <button className="btn btn-primary" onClick={handleNewCitaClick}>
            Nuevo
          </button>
          <button className="btn btn-primary" onClick={handleExportExcel}>
            Excel
          </button>
          <button className="btn btn-primary" onClick={handleExportPDF}>
            PDF
          </button>
        </div>
        
        <div className="controls-row">
          <div className="show-entries">
            <span>Mostrar</span>
            <select 
              id="show-records" 
              value={recordsPerPage} 
              onChange={handleRecordsPerPageChange}
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
              id="search" 
              value={search} 
              onChange={handleSearchChange} 
              placeholder="Buscar..."
            />
          </div>
        </div>
        
        {/* Tabla de citas */}
        <TablaCitas 
          citas={currentRecords} 
          onAccept={handleAcceptCita}
          onCancel={handleCancelCita}
          onDelete={handleDeleteCita}
        />
        
        {/* Pagination */}
        {filteredCitas.length > 0 && (
          <div className="pagination">
            <div className="page-info">
              Mostrando del {filteredCitas.length ? indexOfFirstRecord + 1 : 0} al {Math.min(indexOfLastRecord, filteredCitas.length)} de total {filteredCitas.length} registros
            </div>
            <div className="page-controls">
              <button 
                className="page-btn" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3 
                  ? i + 1 
                  : currentPage >= totalPages - 2 
                    ? totalPages - 4 + i 
                    : currentPage - 2 + i;
                
                return pageNum > 0 && pageNum <= totalPages ? (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ) : null;
              })}
              
              <button 
                className="page-btn" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuloCitas;