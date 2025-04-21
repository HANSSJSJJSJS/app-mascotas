import React from 'react';

const TablaCitas = ({ citas, onAccept, onCancel, onDelete }) => {
const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmada':
        return 'status-confirmed';
      case 'cancelada':
        return 'status-cancelled';
      case 'pendiente':
        return 'status-pending';
      default:
        return '';
    }
  };

  // Helper function to determine status icon
  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmada':
        return '✅ ';
      case 'cancelada':
        return '❌ ';
      case 'pendiente':
        return '⚠️ ';
      default:
        return '';
    }
  };

  return (
    <section className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>PACIENTE</th>
            <th>DESCRIPCIÓN</th>
            <th>ESPECIALISTA</th>
            <th>ESPECIALIDAD</th>
            <th>FECHA</th>
            <th>HORA</th>
            <th>ESTADO</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {citas.length > 0 ? (
            citas.map(cita => (
              <tr key={cita.id}>
                <td>{cita.id}</td>
                <td>{cita.paciente}</td>
                <td>{cita.descripcion}</td>
                <td>{cita.especialista}</td>
                <td>{cita.especialidad}</td>
                <td>{cita.fecha}</td>
                <td>{cita.horaInicio}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(cita.estado)}`}>
                    {getStatusIcon(cita.estado)}{cita.estado}
                  </span>
                </td>
                <td className="action-buttons">
                  {cita.estado.toLowerCase() === 'pendiente' && (
                    <>
                      <button 
                        className="action-btn accept-btn"
                        onClick={() => onAccept(cita.id)}
                        title="Aceptar cita"
                      >
                        ✓
                      </button>
                      <button 
                        className="action-btn cancel-btn"
                        onClick={() => onCancel(cita.id)}
                        title="Cancelar cita"
                      >
                        ✗
                      </button>
                    </>
                  )}
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => onDelete(cita.id)}
                    title="Eliminar cita"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-data-message">
                No hay citas disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default TablaCitas;