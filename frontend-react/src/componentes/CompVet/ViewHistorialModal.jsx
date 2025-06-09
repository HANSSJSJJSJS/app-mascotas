import '../../stylos/cssVet/ViewHistorial.css';

const ViewHistorialModal = ({ historial, onClose }) => {
    return (
      <div className="historial-modal-overlay">
        <div className="historial-modal-container">
          <div className="historial-modal-content">
            <div className="historial-modal-header">
              <h2 className="historial-modal-title">
                Historial Clínico de {historial.mascota.nombre}
              </h2>
              <button
                onClick={onClose}
                className="historial-close-button"
              >
                <svg className="historial-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <div className="historial-info-grid">
              <div className="historial-info-section">
                <h3 className="historial-info-title">Información de la Mascota</h3>
                <div className="historial-info-list">
                  <div className="historial-info-item">
                    <span className="historial-info-label">Nombre:</span>
                    <span className="historial-info-value">{historial.mascota.nombre}</span>
                  </div>
                  <div className="historial-info-item">
                    <span className="historial-info-label">Especie:</span>
                    <span className="historial-info-value">{historial.mascota.especie}</span>
                  </div>
                  <div className="historial-info-item">
                    <span className="historial-info-label">Raza:</span>
                    <span className="historial-info-value">{historial.mascota.raza}</span>
                  </div>
                  <div className="historial-info-item">
                    <span className="historial-info-label">Edad:</span>
                    <span className="historial-info-value">{historial.mascota.edad} años</span>
                  </div>
                  <div className="historial-info-item">
                    <span className="historial-info-label">Peso:</span>
                    <span className="historial-info-value">{historial.mascota.peso} kg</span>
                  </div>
                </div>
              </div>
  
              <div className="historial-info-section">
                <h3 className="historial-info-title">Información del Propietario</h3>
                <div className="historial-info-list">
                  <div className="historial-info-item">
                    <span className="historial-info-label">Nombre:</span>
                    <span className="historial-info-value">{historial.mascota.propietario}</span>
                  </div>
                  <div className="historial-info-item">
                    <span className="historial-info-label">Teléfono:</span>
                    <span className="historial-info-value">{historial.mascota.telefono}</span>
                  </div>
                  <div className="historial-info-item">
                    <span className="historial-info-label">Estado del historial:</span>
                    <span className={`historial-status-badge ${
                      historial.activo ? "historial-status-active" : "historial-status-inactive"
                    }`}>
                      {historial.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="historial-info-item">
                    <span className="historial-info-label">Fecha de creación:</span>
                    <span className="historial-info-value">{new Date(historial.fechaCreacion).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="historial-consultas-header">
              <h3 className="historial-consultas-title">Consultas</h3>
              <span className="historial-consultas-count">{historial.consultas.length}</span>
            </div>
            
            <div className="historial-consultas-list">
              {historial.consultas.length > 0 ? (
                historial.consultas.map((consulta) => (
                  <div key={consulta.id} className="historial-consulta-card">
                    <h4 className="historial-consulta-header">
                      {new Date(consulta.fecha).toLocaleDateString()} - {consulta.motivo}
                    </h4>
                    <div className="historial-consulta-info">
                      <div className="historial-consulta-field">
                        <span className="historial-consulta-label">Veterinario:</span>
                        <span className="historial-consulta-value">{consulta.veterinario}</span>
                      </div>
                      <div className="historial-consulta-field">
                        <span className="historial-consulta-label">Diagnóstico:</span>
                        <span className="historial-consulta-value">{consulta.diagnostico}</span>
                      </div>
                      <div className="historial-consulta-field">
                        <span className="historial-consulta-label">Tratamiento:</span>
                        <span className="historial-consulta-value">{consulta.tratamiento}</span>
                      </div>
                      {consulta.observaciones && (
                        <div className="historial-consulta-field">
                          <span className="historial-consulta-label">Observaciones:</span>
                          <span className="historial-consulta-value">{consulta.observaciones}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="historial-no-consultas">No hay consultas registradas</div>
              )}
            </div>
  
            <div className="historial-modal-footer">
              <button
                onClick={onClose}
                className="historial-btn-cerrar"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};
  
export default ViewHistorialModal;