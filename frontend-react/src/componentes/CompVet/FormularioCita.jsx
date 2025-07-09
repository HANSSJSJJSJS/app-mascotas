import { useState, useEffect } from "react";

const FormularioCita = ({ onSubmit, onCancel }) => {
  const [servicios, setServicios] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);

  const HORARIOS_DISPONIBLES = ["09:00", "11:00", "13:00", "15:00", "17:00"];

  useEffect(() => {
    fetch("http://localhost:3001/api/servicios")
      .then(res => res.json())
      .then(data => setServicios(data))
      .catch(err => console.error("Error al cargar servicios:", err));

    fetch("http://localhost:3001/api/veterinarios")
      .then(res => res.json())
      .then(data => setVeterinarios(data))
      .catch(err => console.error("Error al cargar veterinarios:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const formData = {
      propietario: form.propietario.value,
      cod_mas: form.cod_mas.value,
      id_vet: form.id_vet.value,
      cod_ser: form.cod_ser.value,
      fecha: form.fecha.value,
      hora: form.hora.value,
      notas: form.notas.value
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <div className="form-group">
        <label>Propietario</label>
        <input
          type="text"
          name="propietario"
          placeholder="Escriba el nombre del propietario"
          required
        />
      </div>

      <div className="form-group">
        <label>Mascota</label>
        <input
          type="text"
          name="cod_mas"
          placeholder="Nombre de la mascota"
          required
        />
      </div>

      <div className="form-group">
        <label>Veterinario</label>
        <select name="id_vet" required>
          <option value="">Seleccione un veterinario</option>
          {veterinarios.map((vet) => (
            <option key={vet.id_vet} value={vet.id_vet}>
              {vet.nombre} {vet.apellido} - {vet.especialidad}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Servicio</label>
        <select name="cod_ser" required>
          <option value="">Seleccione un servicio</option>
          {servicios.map((servicio) => (
            <option key={servicio.id} value={servicio.id}>
              {servicio.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Fecha</label>
        <input type="date" name="fecha" required />
      </div>

      <div className="form-group">
        <label>Hora</label>
        <select name="hora" required>
          <option value="">Seleccione una hora</option>
          {HORARIOS_DISPONIBLES.map((hora) => (
            <option key={hora} value={hora}>{hora}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Notas</label>
        <textarea name="notas" />
      </div>

      <div className="form-actions">
        <button type="submit">Guardar Cita</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default FormularioCita;
