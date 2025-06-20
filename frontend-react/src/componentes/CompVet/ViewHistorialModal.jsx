import '../../stylos/cssVet/ViewHistorial.css';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF con tu paleta de colores
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#1a2540',
    borderBottomStyle: 'solid'
  },
  clinicHeader: {
    backgroundColor: '#1a2540',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    marginBottom: 20,
    borderRadius: 5
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1a2540'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#495a90',
    borderBottomWidth: 1,
    borderBottomColor: '#495a90',
    borderBottomStyle: 'solid',
    paddingBottom: 5
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#495a90',
    borderLeftStyle: 'solid'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start'
  },
  label: {
    width: 150,
    fontWeight: 'bold',
    color: '#1a2540'
  },
  value: {
    flex: 1,
    color: '#000000'
  },
  consulta: {
    marginTop: 15,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'solid',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  consultaHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495a90'
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderTopStyle: 'solid',
    textAlign: 'center',
    fontSize: 10,
    color: '#7f8c8d'
  },
  statusBadge: {
    padding: 3,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 5,
    whiteSpace: 'nowrap' // Esto evita que el texto se divida
  },
  activeStatus: {
    backgroundColor: '#495a90',
    color: 'white'
  },
  inactiveStatus: {
    backgroundColor: '#d32f2f',
    color: 'white'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#95a5a6'
  }
});

// Componente para el documento PDF
const HistorialPDF = ({ historial }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Encabezado de la clínica */}
      <View style={pdfStyles.clinicHeader}>
        <Text>PET MOYBE</Text>
        <Text style={{ fontSize: 10, marginTop: 5 }}>Carrera 73B Bis # 6 – 22 Sur</Text>
      </View>
      
      {/* Encabezado del documento */}
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>HISTORIAL CLÍNICO</Text>
        <Text style={{ textAlign: 'center', color: '#7f8c8d' }}>
          Generado el {new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      {/* Información de la mascota */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subtitle}>Información de la Mascota</Text>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Nombre:</Text>
          <Text style={pdfStyles.value}>{historial.mascota.nombre}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Especie:</Text>
          <Text style={pdfStyles.value}>{historial.mascota.especie}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Raza:</Text>
          <Text style={pdfStyles.value}>{historial.mascota.raza}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Edad:</Text>
          <Text style={pdfStyles.value}>{historial.mascota.edad} años</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Peso:</Text>
          <Text style={pdfStyles.value}>{historial.mascota.peso} kg</Text>
        </View>
      </View>

      {/* Información del propietario */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subtitle}>Información del Propietario</Text>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Nombre:</Text>
          <Text style={pdfStyles.value}>{historial.mascota.propietario}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Teléfono:</Text>
          <Text style={pdfStyles.value}>{historial.mascota.telefono}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Estado:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={pdfStyles.value}>{historial.activo ? "Activo" : "Inactivo"}</Text>
            <Text style={[
              pdfStyles.statusBadge,
              historial.activo ? pdfStyles.activeStatus : pdfStyles.inactiveStatus
            ]}>
              {historial.activo ? "ACTIVO" : "INACTIVO"}
            </Text>
          </View>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Fecha creación:</Text>
          <Text style={pdfStyles.value}>
            {new Date(historial.fechaCreacion).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
      </View>

      {/* Listado de consultas */}
      <Text style={pdfStyles.subtitle}>
        Consultas ({historial.consultas.length})
      </Text>
      
      {historial.consultas.length > 0 ? (
        historial.consultas.map((consulta, index) => (
          <View key={index} style={pdfStyles.consulta} wrap={false}>
            <Text style={pdfStyles.consultaHeader}>
              {new Date(consulta.fecha).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} - {consulta.motivo}
            </Text>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Veterinario:</Text>
              <Text style={pdfStyles.value}>{consulta.veterinario}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Diagnóstico:</Text>
              <Text style={pdfStyles.value}>{consulta.diagnostico}</Text>
            </View>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Tratamiento:</Text>
              <Text style={pdfStyles.value}>{consulta.tratamiento}</Text>
            </View>
            {consulta.observaciones && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Observaciones:</Text>
                <Text style={pdfStyles.value}>{consulta.observaciones}</Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <Text style={{ 
          fontStyle: 'italic', 
          color: '#95a5a6',
          textAlign: 'center',
          marginTop: 20
        }}>
          No hay consultas registradas
        </Text>
      )}

      {/* Pie de página */}
      <View style={pdfStyles.footer}>
        <Text>Documento generado automáticamente por el sistema de la clínica veterinaria</Text>
        <Text style={{ marginTop: 5 }}>Este documento tiene validez oficial</Text>
      </View>

      {/* Número de página */}
      <Text style={pdfStyles.pageNumber} render={({ pageNumber, totalPages }) => (
        `Página ${pageNumber} de ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

const ViewHistorialModal = ({ historial, onClose }) => {
  const componentRef = useRef();
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          background: white !important;
        }
        .historial-modal-container {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .historial-actions, 
        .historial-modal-footer,
        .historial-close-button {
          display: none !important;
        }
      }
    `,
    documentTitle: `Historial_${historial.mascota.nombre}_${new Date().toISOString().slice(0, 10)}`,
    removeAfterPrint: true
  });

  return (
    <div className="historial-modal-overlay">
      <div className="historial-modal-container">
        <div className="historial-modal-content" ref={componentRef}>
          <div className="historial-modal-header">
            <h2 className="historial-modal-title">
              Historial Clínico de {historial.mascota.nombre}
            </h2>
            <div className="historial-actions">
              <PDFDownloadLink 
                document={<HistorialPDF historial={historial} />} 
                fileName={`Historial_${historial.mascota.nombre.replace(/\s+/g, '_')}.pdf`}
                className="historial-btn-pdf"
              >
                {({ loading }) => (loading ? 'Preparando PDF...' : 'Descargar PDF')}
              </PDFDownloadLink>
              <button 
                onClick={handlePrint} 
                className="historial-btn-print"
              >
                Imprimir
              </button>
              <button
                onClick={onClose}
                className="historial-close-button"
              >
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