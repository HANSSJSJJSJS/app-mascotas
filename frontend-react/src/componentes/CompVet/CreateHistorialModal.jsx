import { useState, useEffect } from 'react';
import '../../stylos/cssVet/ModalHistorial.css';

const CreateHistorialModal = ({ onClose, onCreate }) => {
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [cod_mas, setCodMas] = useState('');
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/mascotas")
      .then(res => res.json())
      .then(data => setMascotas(data))
      .catch(err => console.error("Error al cargar mascotas:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fecha || !motivo || !tratamiento || !cod_mas) {
      alert("Por favor completa todos los campos.");
      return;
    }
    onCreate({ fecha, motivo, tratamiento, cod_mas });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>📝 Nuevo Historial Clínico</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>Fecha:</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

          <label>Motivo:</label>
          <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} required></textarea>

          <label>Tratamiento:</label>
          <textarea value={tratamiento} onChange={(e) => setTratamiento(e.target.value)} required></textarea>

          <label>Mascota:</label>
          <select value={cod_mas} onChange={(e) => setCodMas(e.target.value)} required>
            <option value="">Seleccione una mascota</option>
              {Array.isArray(mascotas) &&
                mascotas.map((mascota) => (
                  <option key={mascota.cod_mas} value={mascota.cod_mas}>
                    {mascota.nom_mas} - {mascota.propietario}
            </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="submit" className="btn-save">Guardar</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHistorialModal; 
