import '../../stylos/cssVet/ViewHistorial.css';
import { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PDFDownloadLink } from '@react-pdf/renderer';
import HistorialPDF from './HistorialPDF';

const ViewHistorialModal = ({ historial, onClose }) => {
  const componentRef = useRef();
  const [detalleHistorial, setDetalleHistorial] = useState(null);

  useEffect(() => {
    // Verificamos que exista un historial con al menos una consulta válida
    if (Array.isArray(historial?.consultas) && historial.consultas.length > 0) {
      fetch(`http://localhost:3001/api/historiales/${historial.consultas[0].id}`)
        .then(res => res.json())
        .then(data => {
          setDetalleHistorial(prev => ({
            ...historial,
            consultas: data.consultas || [],
            mascota: {
              ...historial.mascota,
              ...data.mascota
            }
          }));
        })
        .catch(err => {
          console.error("Error al obtener detalle del historial:", err);
          setDetalleHistorial(historial); // al menos cargamos lo básico
        });
    } else {
      // Si no hay consultas, igual mostramos lo que hay
      setDetalleHistorial(historial);
    }
  }, [historial]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `@page { size: A4; margin: 15mm; } @media print { body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; background: white !important; } .historial-modal-container { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; } .historial-actions, .historial-modal-footer, .historial-close-button { display: none !important; } }`,
    documentTitle: `Historial_${detalleHistorial?.mascota?.nombre}_${new Date().toISOString().slice(0, 10)}`,
    removeAfterPrint: true
  });

  if (!detalleHistorial) {
    return (
      <div className="historial-modal-overlay">
        <div className="historial-modal-container">
          <p className="historial-loading">Cargando historial clínico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="historial-modal-overlay">
      <div className="historial-modal-container">
        <div className="historial-modal-content" ref={componentRef}>
          <div className="historial-modal-header">
            <h2 className="historial-modal-title">
              Historial Clínico de {detalleHistorial.mascota?.nombre || "N/A"}
            </h2>
            <div className="historial-actions">
              <PDFDownloadLink 
                document={<HistorialPDF historial={detalleHistorial} />} 
                fileName={`Historial_${detalleHistorial.mascota?.nombre?.replace(/\s+/g, '_') || 'mascota'}.pdf`}>
                {({ loading }) => (loading ? 'Preparando PDF...' : 'Descargar PDF')}
              </PDFDownloadLink>
              <button onClick={onClose} className="historial-close-button">
                <svg className="historial-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="historial-info-grid">
            <div className="historial-info-section">
              <h3 className="historial-info-title">Información de la Mascota</h3>
              <div className="historial-info-list">
                <div className="historial-info-item">
                  <span className="historial-info-label">Nombre:</span>
                  <span className="historial-info-value">{detalleHistorial.mascota?.nombre || "N/A"}</span>
                </div>
                <div className="historial-info-item">
                  <span className="historial-info-label">Especie:</span>
                  <span className="historial-info-value">{detalleHistorial.mascota?.especie || "N/A"}</span>
                </div>
                <div className="historial-info-item">
                  <span className="historial-info-label">Raza:</span>
                  <span className="historial-info-value">{detalleHistorial.mascota?.raza || "N/A"}</span>
                </div>
                <div className="historial-info-item">
                  <span className="historial-info-label">Edad:</span>
                  <span className="historial-info-value">{detalleHistorial.mascota?.edad ?? "N/A"} años</span>
                </div>
                <div className="historial-info-item">
                  <span className="historial-info-label">Peso:</span>
                  <span className="historial-info-value">{detalleHistorial.mascota?.peso ?? "N/A"} kg</span>
                </div>
              </div>
            </div>

            <div className="historial-info-section">
              <h3 className="historial-info-title">Información del Propietario</h3>
              <div className="historial-info-list">
                <div className="historial-info-item">
                  <span className="historial-info-label">Nombre:</span>
                  <span className="historial-info-value">{detalleHistorial.mascota?.propietario || "N/A"}</span>
                </div>
                <div className="historial-info-item">
                  <span className="historial-info-label">Teléfono:</span>
                  <span className="historial-info-value">{detalleHistorial.mascota?.telefono || "N/A"}</span>
                </div>
                <div className="historial-info-item">
                  <span className="historial-info-label">Estado del historial:</span>
                  <span className={`historial-status-badge ${detalleHistorial.activo ? "historial-status-active" : "historial-status-inactive"}`}>
                    {detalleHistorial.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="historial-info-item">
                  <span className="historial-info-label">Fecha de creación:</span>
                  <span className="historial-info-value">
                    {detalleHistorial.fechaCreacion ? new Date(detalleHistorial.fechaCreacion).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="historial-consultas-header">
            <h3 className="historial-consultas-title">Consultas</h3>
            <span className="historial-consultas-count">{detalleHistorial.consultas?.length || 0}</span>
          </div>

          <div className="historial-consultas-list">
            {detalleHistorial.consultas?.length > 0 ? (
              detalleHistorial.consultas.map((consulta) => (
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
            <button onClick={onClose} className="historial-btn-cerrar">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHistorialModal;
