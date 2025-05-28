import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Loader2, Upload, Calendar, Weight, Clipboard } from 'lucide-react';
import logo from '../../imagenes/logo.png';
import '../../stylos/cssPropietario/Mascota.css';


const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  especie: z.string().min(2, { message: "La especie es requerida" }),
  raza: z.string().min(2, { message: "La raza es requerida" }),
  edad: z.coerce.number().min(0, { message: "La edad debe ser un número válido" }),
  peso: z.coerce.number().min(0, { message: "El peso debe ser un número válido" }),
  genero: z.string().min(1, { message: "El género es requerido" }),
  fechaNacimiento: z.string().optional(),
  color: z.string().optional(),
  microchip: z.string().optional(),
  esterilizado: z.boolean().optional(),
  alergias: z.string().optional(),
  condicionesEspeciales: z.string().optional(),
  notas: z.string().optional(),
});

export default function Mascota() {
  const [activeTab, setActiveTab] = useState("informacion");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);

  const mascotaEjemplo = {
    nombre: "Max",
    especie: "Perro",
    raza: "Labrador",
    edad: 3,
    peso: 25.5,
    genero: "Macho",
    fechaNacimiento: "2020-05-15",
    color: "Dorado",
    microchip: "123456789012345",
    esterilizado: true,
    alergias: "Ninguna",
    condicionesEspeciales: "Ninguna",
    notas: "Muy juguetón y sociable",
    propietario: {
      id: "1",
      nombre: "Juan Pérez",
      telefono: "555-123-4567",
      email: "juan.perez@ejemplo.com"
    },
    historialMedico: [
      { fecha: "2023-01-15", descripcion: "Vacunación anual", veterinario: "Dr. García" },
      { fecha: "2022-08-10", descripcion: "Desparasitación", veterinario: "Dra. Rodríguez" },
    ]
  };

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: mascotaEjemplo
  });

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Aquí se incluiría la lógica para enviar los datos y la imagen al servidor
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Datos de la mascota actualizados correctamente");
    } catch (error) {
      alert("Error al actualizar los datos de la mascota");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contenedor-principal">
      <div className="header-mascota">
        <div className="logo-container">
          <img src={logo || "/placeholder.svg"} alt="PET MOY - CLINICA VETERINARIA" className="logo" />
        </div>
        <h1 className="clinica-title">Clínica Veterinaria</h1>
        <h2 className="form-title">Actualizar Datos de la Mascota</h2>
        <p className="form-description">Actualice la información de la mascota</p>
      </div>

      <div className="tabs-mascota">
        <button
          onClick={() => setActiveTab("informacion")}
          className={`tab ${activeTab === "informacion" ? "active" : ""}`}
        >
          Información Básica
        </button>
        <button
          onClick={() => setActiveTab("historial")}
          className={`tab ${activeTab === "historial" ? "active" : ""}`}
        >
          Historial Médico
        </button>
      </div>

      <div className="content-mascota">
        {activeTab === "informacion" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="form-mascota">

            <div className="form-grid-mascota">
              <div className="form-group">
                <label>Nombre</label>
                <input {...register("nombre")} className="input-mascota" />
                {errors.nombre && <span className="error">{errors.nombre.message}</span>}
              </div>

              <div className="form-group">
                <label>Especie</label>
                <select {...register("especie")} className="select-mascota">
                  <option value="">Seleccionar</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Reptil">Reptil</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.especie && <span className="error">{errors.especie.message}</span>}
              </div>

              <div className="form-group">
                <label>Raza</label>
                <input {...register("raza")} className="input-mascota" />
                {errors.raza && <span className="error">{errors.raza.message}</span>}
              </div>

              <div className="form-group">
                <label>Edad (años)</label>
                <input type="number" {...register("edad")} className="input-mascota" />
                {errors.edad && <span className="error">{errors.edad.message}</span>}
              </div>

              <div className="form-group">
                <label>Peso (kg)</label>
                <div className="input-icon-container">
                  <Weight className="input-icon" size={16} />
                  <input type="number" step="0.1" {...register("peso")} className="input-mascota with-icon" />
                </div>
                {errors.peso && <span className="error">{errors.peso.message}</span>}
              </div>

              <div className="form-group">
                <label>Género</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" value="Macho" {...register("genero")} />
                    Macho
                  </label>
                  <label className="radio-label">
                    <input type="radio" value="Hembra" {...register("genero")} />
                    Hembra
                  </label>
                </div>
                {errors.genero && <span className="error">{errors.genero.message}</span>}
              </div>

              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <div className="input-icon-container">
                  <Calendar className="input-icon" size={16} />
                  <input type="date" {...register("fechaNacimiento")} className="input-mascota with-icon" />
                </div>
              </div>

              <div className="form-group">
                <label>Color</label>
                <input {...register("color")} className="input-mascota" />
              </div>

              <div className="form-group">
                <label>Microchip</label>
                <input {...register("microchip")} className="input-mascota" />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" {...register("esterilizado")} />
                  Esterilizado/a
                </label>
              </div>

              <div className="form-group full-width">
                <label>Alergias</label>
                <input {...register("alergias")} className="input-mascota" />
              </div>

              <div className="form-group full-width">
                <label>Condiciones Especiales</label>
                <textarea {...register("condicionesEspeciales")} rows="2" className="textarea-mascota" />
              </div>

              <div className="form-group full-width">
                <label>Notas adicionales</label>
                <div className="input-icon-container textarea-container">
                  <Clipboard className="input-icon textarea-icon" size={16} />
                  <textarea {...register("notas")} rows="3" className="textarea-mascota with-icon" />
                </div>
                <p className="notes-description">Información adicional relevante sobre la mascota.</p>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-button-mascota">
              {isSubmitting ? (
                <>
                  <Loader2 className="icon-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="icon" />
                  Guardar Cambios
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="historial-medico">
            <h3 className="historial-title">Historial Médico</h3>
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Veterinario</th>
                </tr>
              </thead>
              <tbody>
                {mascotaEjemplo.historialMedico.map((registro, index) => (
                  <tr key={index}>
                    <td>{registro.fecha}</td>
                    <td>{registro.descripcion}</td>
                    <td>{registro.veterinario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
