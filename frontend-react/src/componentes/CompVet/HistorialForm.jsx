import { useState } from 'react';
import '../../stylos/cssVet/HistorialForm.css';

const HistorialForm = ({ historial, onSave, onCancel, isEditMode = false }) => {
  const [formData, setFormData] = useState(
    historial || {
      mascota: {
        nombre: '',
        especie: '',
        raza: '',
        edad: 0,
        peso: 0,
        propietario: '',
        telefono: '',
      },
      consultas: [],
      activo: true,
    }
  );

  const [nuevaConsulta, setNuevaConsulta] = useState({
    fecha: '',
    motivo: '',
    diagnostico: '',
    tratamiento: '',
    veterinario: '',
    observaciones: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleConsultaChange = (e) => {
    const { name, value } = e.target;
    setNuevaConsulta({
      ...nuevaConsulta,
      [name]: value,
    });
  };

  const agregarConsulta = () => {
    if (
      nuevaConsulta.fecha &&
      nuevaConsulta.motivo &&
      nuevaConsulta.diagnostico &&
      nuevaConsulta.tratamiento
    ) {
      setFormData({
        ...formData,
        consultas: [
          ...formData.consultas,
          {
            ...nuevaConsulta,
            id: Date.now().toString(),
          },
        ],
      });
      setNuevaConsulta({
        fecha: '',
        motivo: '',
        diagnostico: '',
        tratamiento: '',
        veterinario: '',
        observaciones: '',
      });
    }
  };

  const eliminarConsulta = (id) => {
    setFormData({
      ...formData,
      consultas: formData.consultas.filter((consulta) => consulta.id !== id),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const historialCompleto = {
      ...formData,
      id: isEditMode ? formData.id : Date.now().toString(),
      fechaCreacion: isEditMode ? formData.fechaCreacion : new Date().toISOString(),
    };
    onSave(historialCompleto);
  };

  return (
    <div className="historial-container">
      <h2 className="historial-title">
        {isEditMode ? 'Editar Historial Clínico' : 'Crear Nuevo Historial Clínico'}
      </h2>
      
      <form onSubmit={handleSubmit} className="historial-form">
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Nombre de la mascota</label>
            <input
              type="text"
              name="mascota.nombre"
              value={formData.mascota.nombre}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-field">
            <label className="form-label">Especie</label>
            <input
              type="text"
              name="mascota.especie"
              value={formData.mascota.especie}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-field">
            <label className="form-label">Raza</label>
            <input
              type="text"
              name="mascota.raza"
              value={formData.mascota.raza}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-field">
            <label className="form-label">Edad (años)</label>
            <input
              type="number"
              name="mascota.edad"
              value={formData.mascota.edad}
              onChange={handleChange}
              className="form-input"
              required
              min="0"
            />
          </div>
          
          <div className="form-field">
            <label className="form-label">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              name="mascota.peso"
              value={formData.mascota.peso}
              onChange={handleChange}
              className="form-input"
              required
              min="0"
            />
          </div>
          
          <div className="form-field">
            <label className="form-label">Propietario</label>
            <input
              type="text"
              name="mascota.propietario"
              value={formData.mascota.propietario}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-field">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              name="mascota.telefono"
              value={formData.mascota.telefono}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="checkbox-input"
            />
            <label htmlFor="activo" className="checkbox-label">
              Historial activo
            </label>
          </div>
        </div>

        <h3 className="section-title">Consultas</h3>
        
        {formData.consultas.map((consulta) => (
          <div key={consulta.id} className="consulta-item">
            <div className="consulta-header">
              <div>
                <span className="consulta-fecha">{consulta.fecha}</span>
                <span className="consulta-motivo">{consulta.motivo}</span>
              </div>
              <button
                type="button"
                onClick={() => eliminarConsulta(consulta.id)}
                className="consulta-delete"
              >
                Eliminar
              </button>
            </div>
            <p className="consulta-detail">
              <strong>Diagnóstico:</strong> {consulta.diagnostico}
            </p>
            <p className="consulta-detail">
              <strong>Tratamiento:</strong> {consulta.tratamiento}
            </p>
            {consulta.observaciones && (
              <p className="consulta-detail">
                <strong>Observaciones:</strong> {consulta.observaciones}
              </p>
            )}
          </div>
        ))}

        <div className="nueva-consulta">
          <h4 className="nueva-consulta-title">Agregar Nueva Consulta</h4>
          
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={nuevaConsulta.fecha}
                onChange={handleConsultaChange}
                className="form-input"
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">Motivo</label>
              <input
                type="text"
                name="motivo"
                value={nuevaConsulta.motivo}
                onChange={handleConsultaChange}
                className="form-input"
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">Diagnóstico</label>
              <textarea
                name="diagnostico"
                value={nuevaConsulta.diagnostico}
                onChange={handleConsultaChange}
                className="form-textarea"
                rows="2"
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">Tratamiento</label>
              <textarea
                name="tratamiento"
                value={nuevaConsulta.tratamiento}
                onChange={handleConsultaChange}
                className="form-textarea"
                rows="2"
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">Veterinario</label>
              <input
                type="text"
                name="veterinario"
                value={nuevaConsulta.veterinario}
                onChange={handleConsultaChange}
                className="form-input"
              />
            </div>
            
            <div className="form-field">
              <label className="form-label">Observaciones</label>
              <textarea
                name="observaciones"
                value={nuevaConsulta.observaciones}
                onChange={handleConsultaChange}
                className="form-textarea"
                rows="2"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={agregarConsulta}
            className="btn btn-add"
            disabled={!nuevaConsulta.fecha || !nuevaConsulta.motivo || !nuevaConsulta.diagnostico || !nuevaConsulta.tratamiento}
          >
            Agregar Consulta
          </button>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            {isEditMode ? 'Actualizar Historial' : 'Guardar Historial'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HistorialForm;