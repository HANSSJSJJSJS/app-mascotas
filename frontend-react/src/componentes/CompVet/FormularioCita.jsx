// src/components/CompVet/FormularioCita.jsx
import { useState, useEffect } from "react";

const FormularioCita = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    cod_mas: "",
    propietario: "",
    cod_ser: "",
    id_vet: "",
    fecha: "",
    hora: "",
    notas: ""
  });

  const [mascotas, setMascotas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);

  const HORARIOS_DISPONIBLES = ["09:00", "11:00", "13:00", "15:00", "17:00"];

  useEffect(() => {
    fetch("http://localhost:3001/api/mascotas")
      .then(res => res.json())
      .then(data => setMascotas(data));

    fetch("http://localhost:3001/api/servicios")
      .then(res => res.json())
      .then(data => setServicios(data));

    fetch("http://localhost:3001/api/veterinarios")
      .then(res => res.json())
      .then(data => setVeterinarios(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <div className="form-group">
        <label>Mascota</label>
        <select name="cod_mas" value={formData.cod_mas} onChange={handleChange} required>
          <option value="">Seleccione una mascota</option>
          {mascotas.map((mascota) => (
            <option key={mascota.cod_mas} value={mascota.cod_mas}>
              {mascota.nom_mas} - {mascota.raza}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Propietario</label>
        <input
          type="text"
          name="propietario"
          value={formData.propietario}
          onChange={handleChange}
          placeholder="Escriba el nombre del propietario"
          required
        />
      </div>

      <div className="form-group">
        <label>Veterinario</label>
        <select name="id_vet" value={formData.id_vet} onChange={handleChange} required>
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
        <select name="cod_ser" value={formData.cod_ser} onChange={handleChange} required>
          <option value="">Seleccione un servicio</option>
          {servicios.map((servicio) => (
            <option key={servicio.cod_ser} value={servicio.cod_ser}>
              {servicio.nom_ser}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Fecha</label>
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Hora</label>
        <select name="hora" value={formData.hora} onChange={handleChange} required>
          <option value="">Seleccione una hora</option>
          {HORARIOS_DISPONIBLES.map((hora) => (
            <option key={hora} value={hora}>{hora}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Notas</label>
        <textarea name="notas" value={formData.notas} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <button type="submit">Guardar Cita</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default FormularioCita;
