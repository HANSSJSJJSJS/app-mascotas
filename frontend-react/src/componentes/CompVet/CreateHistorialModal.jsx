import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import '../../stylos/cssVet/ModalHistorial.css';

const CreateHistorialModal = ({ onClose, onCreate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const mascotaSeleccionada = location.state?.mascota;
  const fechaCita = location.state?.fechaCita;

  function formatFecha(fecha) {
    if (!fecha) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
    const d = new Date(fecha);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  }

  // Inicializa los estados con los datos recibidos
  const [fecha, setFecha] = useState(formatFecha(fechaCita) || '');
  const [motivo, setMotivo] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [cod_mas, setCodMas] = useState(mascotaSeleccionada ? mascotaSeleccionada.id : '');
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/mascotas")
      .then(res => res.json())
      .then(data => setMascotas(data))
      .catch(err => console.error("Error al cargar mascotas:", err));
  }, []);

  // Si los datos pueden cambiar después de montar el componente, usa useEffect:
  useEffect(() => {
    if (mascotaSeleccionada) setCodMas(mascotaSeleccionada.id);
    if (fechaCita) setFecha(formatFecha(fechaCita));
  }, [mascotaSeleccionada, fechaCita]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fecha || !motivo || !tratamiento || !cod_mas) {
      alert("Por favor completa todos los campos.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/historiales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha,
          motivo,
          tratamiento,
          cod_mas,
          id_cita: location.state?.id_cita // <-- agrega esto
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Error al guardar el historial: " + errorText);
        return;
      }

      alert("✅ Historial registrado exitosamente");
      navigate("/PanelVet/historial-clinico");
    } catch (err) {
      alert("Error al guardar el historial: " + err.message);
    }
  };

  // Nueva función para cerrar y volver atrás
  const handleClose = () => {
    if (onClose) onClose();
    // Si hay un flag en location.state, decide a dónde volver
    if (location.state?.fromHistorialClinico) {
      navigate("/PanelVet/historial-clinico");
    } else {
      navigate("/PanelVet", { state: { recargarCitas: true } });
    }
  };

  console.log({ fecha, motivo, tratamiento, cod_mas });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Botón X para cerrar */}
        <button
          type="button"
          className="modal-close-x"
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer"
          }}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2>📝 Nuevo Historial Clínico</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>Fecha:</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

          <label>Motivo:</label>
          <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} required></textarea>

          <label>Tratamiento:</label>
          <textarea value={tratamiento} onChange={(e) => setTratamiento(e.target.value)} required></textarea>

          {mascotaSeleccionada && (
            <div style={{ marginBottom: "10px" }}>
              <strong>Mascota:</strong> {mascotaSeleccionada.nombre}
              <br />
              <strong>Propietario:</strong> {mascotaSeleccionada.propietario}
            </div>
          )}

          {/* Solo muestra el select si NO hay mascota seleccionada */}
          {!mascotaSeleccionada && (
            <>
              <label>Mascota:</label>
              <select
                value={cod_mas}
                onChange={(e) => setCodMas(e.target.value)}
                required
              >
                <option value="">Seleccione una mascota</option>
                {Array.isArray(mascotas) &&
                  mascotas.map((mascota) => (
                    <option key={mascota.id} value={mascota.id}>
                      {mascota.nombre} {mascota.nombre_propietario ? `- ${mascota.nombre_propietario}` : ""}
                    </option>
                  ))}
              </select>
            </>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn-save">Guardar</button>
            <button type="button" className="btn-cancel" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHistorialModal;
