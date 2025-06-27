import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { PawPrint, Upload, User, Heart, Calendar, Weight, Palette, FileText, ArrowLeft, ArrowRight, Check, X, UserCheck } from "lucide-react";
import "../../stylos/cssFormularios/MascotaForm.css";

function MascotaForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const usuarioActual = JSON.parse(localStorage.getItem("pet-app-user"));
      if (!usuarioActual?.id_usuario) throw new Error("No se encontró información del usuario.");

      const formData = new FormData();
      formData.append("nom_mas", data.nombre);
      formData.append("especie", data.especie);
      formData.append("raza", data.raza);

      // Calcular la edad basada en la fecha de nacimiento
      const fechaNacimiento = new Date(data.fechaNacimiento);
      const hoy = new Date();
      const edad = (hoy - fechaNacimiento) / (365.25 * 24 * 60 * 60 * 1000);
      formData.append("edad", Number.parseFloat(edad.toFixed(2)));
      formData.append("genero", data.genero);
      formData.append("peso", Number.parseFloat(data.peso));
      formData.append("color", data.color);
      formData.append("notas", data.caracteristicas || data.observaciones || "");
      formData.append("vacunado", data.vacunado || false);
      formData.append("esterilizado", data.esterilizado || false);
      formData.append("id_pro", data.id_pro || usuarioActual.id_usuario);

      if (data.imagen) {
        formData.append("foto", data.imagen);
      }

      const response = await axios.post("http://localhost:3001/api/mascotas", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (response.data.success) {
        alert("¡Mascota registrada exitosamente!");
        reset();
        setImagePreview(null);
        setCurrentStep(1);
      } else {
        throw new Error(response.data.message || "Error en el registro");
      }
    } catch (error) {
      let errorMessage = "Error al registrar la mascota";

      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || error.response.statusText;
        console.error("Error en la respuesta del servidor:", error.response.data);
      } else if (error.request) {
        errorMessage = "El servidor no respondió. Verifica tu conexión a internet.";
        console.error("No hubo respuesta del servidor:", error.request);
      } else {
        errorMessage = error.message;
        console.error("Error en la configuración de la petición:", error.message);
      }

      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para ir al siguiente paso con validación
  const nextStep = async () => {
    let fieldsToValidate = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["nombre", "especie", "raza", "fechaNacimiento"];
        break;
      case 2:
        fieldsToValidate = ["genero", "peso", "color"];
        break;
      case 3:
        fieldsToValidate = ["observaciones"];
        break;
    }

    const isStepValid = fieldsToValidate.length === 0 || (await trigger(fieldsToValidate));

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    } else {
      alert("Por favor, complete todos los campos requeridos correctamente.");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const progress = (currentStep / totalSteps) * 100;

  const getFieldClass = (fieldName) => {
    if (!dirtyFields[fieldName]) return "";
    return errors[fieldName] ? "field-error" : "field-success";
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Solo se permiten archivos de imagen");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setValue("imagen", file);
      };
      reader.readAsDataURL(file);
    }
  };

  function getImageUrl(foto) {
    return foto ? `http://localhost:3000/uploads/mascotas/${foto}` : "/placeholder.svg";
  }

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <PawPrint className="form-icon" size={32} />
          <h2 className="form-title">Registro de Mascota</h2>
          <p className="form-subtitle">Completa la información de tu mascota en 3 sencillos pasos</p>
        </div>

        {/* Barra de progreso horizontal */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <div className="progress-steps">
            {[
              { number: 1, label: "Información Básica", icon: <PawPrint size={16} /> },
              { number: 2, label: "Características", icon: <Heart size={16} /> },
              { number: 3, label: "Información Adicional", icon: <FileText size={16} /> },
            ].map((step, index) => (
              <div
                key={index}
                className={`progress-step ${currentStep > index ? "completed" : ""} ${
                  currentStep === index + 1 ? "active" : ""
                }`}
              >
                <div className="step-circle">{currentStep > index + 1 ? <Check size={16} /> : step.icon}</div>
                <div className="step-info">
                  <div className="step-number">Paso {step.number}</div>
                  <div className="step-label">{step.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Paso 1: Información Básica */}
          {currentStep === 1 && (
            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">
                  <PawPrint size={24} />
                  Información Básica
                </h3>
                <p className="section-description">Datos principales de tu mascota</p>
              </div>

              <div className="form-content">
                {/* Subida de imagen */}
                <div className="image-section">
                  <label htmlFor="imagen" className="image-upload-label">
                    {imagePreview ? (
                      <img src={imagePreview || "/placeholder.svg"} alt="Vista previa" className="image-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <Upload size={32} />
                        <span className="upload-text">Subir Foto</span>
                        <span className="upload-hint">JPG, PNG (máx. 5MB)</span>
                      </div>
                    )}
                  </label>
                  <input
                    type="file"
                    id="imagen"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-upload-input"
                  />
                </div>

                <div className="fields-section">
                  {/* Primera fila - Nombre y Especie */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nombre">
                        <PawPrint size={16} />
                        Nombre de la mascota *
                      </label>
                      <div className={`input-container ${getFieldClass("nombre")}`}>
                        <input
                          type="text"
                          id="nombre"
                          placeholder="Ej: Max, Luna, Coco..."
                          {...register("nombre", {
                            required: "El nombre es obligatorio",
                            minLength: { value: 2, message: "Mínimo 2 caracteres" },
                            maxLength: { value: 30, message: "Máximo 30 caracteres" },
                            pattern: {
                              value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
                              message: "Solo letras y espacios",
                            },
                          })}
                        />
                        <span className="input-icon">
                          {dirtyFields.nombre && !errors.nombre && "✓"}
                          {errors.nombre && "!"}
                        </span>
                      </div>
                      {errors.nombre && <p className="error-message">{errors.nombre.message}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="especie">
                        <Heart size={16} />
                        Especie *
                      </label>
                      <div className={`input-container ${getFieldClass("especie")}`}>
                        <select id="especie" {...register("especie", { required: "La especie es obligatoria" })}>
                          <option value="">Seleccione una especie</option>
                          <option value="Perro">🐕 Perro</option>
                          <option value="Gato">🐱 Gato</option>
                        </select>
                        <span className="input-icon">
                          {dirtyFields.especie && !errors.especie && "✓"}
                          {errors.especie && "!"}
                        </span>
                      </div>
                      {errors.especie && <p className="error-message">{errors.especie.message}</p>}
                    </div>
                  </div>

                  {/* Segunda fila - Raza y Fecha de nacimiento */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="raza">
                        <FileText size={16} />
                        Raza *
                      </label>
                      <div className={`input-container ${getFieldClass("raza")}`}>
                        <input
                          type="text"
                          id="raza"
                          placeholder="Ej: Labrador, Persa, Canario..."
                          {...register("raza", {
                            required: "La raza es obligatoria",
                            minLength: { value: 2, message: "Mínimo 2 caracteres" },
                            maxLength: { value: 50, message: "Máximo 50 caracteres" },
                          })}
                        />
                        <span className="input-icon">
                          {dirtyFields.raza && !errors.raza && "✓"}
                          {errors.raza && "!"}
                        </span>
                      </div>
                      {errors.raza && <p className="error-message">{errors.raza.message}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="fechaNacimiento">
                        <Calendar size={16} />
                        Fecha de nacimiento *
                      </label>
                      <div className={`input-container ${getFieldClass("fechaNacimiento")}`}>
                        <input
                          type="date"
                          id="fechaNacimiento"
                          {...register("fechaNacimiento", {
                            required: "La fecha de nacimiento es obligatoria",
                            validate: (value) => {
                              const fechaNacimiento = new Date(value);
                              const hoy = new Date();
                              return fechaNacimiento <= hoy || "La fecha no puede ser futura";
                            },
                          })}
                        />
                        <span className="input-icon">
                          {dirtyFields.fechaNacimiento && !errors.fechaNacimiento && "✓"}
                          {errors.fechaNacimiento && "!"}
                        </span>
                      </div>
                      {errors.fechaNacimiento && <p className="error-message">{errors.fechaNacimiento.message}</p>}
                    </div>
                  </div>

                  {/* Tercera fila - ID Propietario */}
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label htmlFor="idpropietario">
                        <UserCheck size={16} />
                        ID del Propietario *
                      </label>
                      <div className={`input-container ${getFieldClass("id_pro")}`}>
                        <input
                          type="text"
                          id="id_pro"
                          placeholder="Ingrese el ID del propietario"
                          {...register("id_pro", {
                            required: "El ID del propietario es obligatorio",
                            pattern: {
                              value: /^[a-zA-Z0-9]+$/,
                              message: "Solo letras y números permitidos",
                            },
                            minLength: { value: 1, message: "Mínimo 1 caracteres" },
                            maxLength: { value: 10, message: "Máximo 10 caracteres" },
                          })}
                        />
                        <span className="input-icon">
                          {dirtyFields.id_pro && !errors.id_pro && "✓"}
                          {errors.id_pro && "!"}
                        </span>
                      </div>
                      {errors.id_pro && <p className="error-message">{errors.id_pro.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Características */}
          {currentStep === 2 && (
            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">
                  <Heart size={24} />
                  Características Físicas
                </h3>
                <p className="section-description">Detalles físicos de tu mascota</p>
              </div>

              <div className="form-content">
                {/* Primera fila - Género y Peso */}
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <User size={16} />
                      Género *
                    </label>
                    <div className="radio-group-horizontal">
                      <div className="radio-option">
                        <input
                          value="Hembra"
                          type="radio"
                          id="hembra"
                          {...register("genero", { required: "El género es obligatorio" })}
                        />
                        <label htmlFor="hembra">
                          <span className="radio-icon">♀</span>
                          Hembra
                        </label>
                      </div>
                      <div className="radio-option">
                        <input
                          value="Macho"
                          type="radio"
                          id="macho"
                          {...register("genero", { required: "El género es obligatorio" })}
                        />
                        <label htmlFor="macho">
                          <span className="radio-icon">♂</span>
                          Macho
                        </label>
                      </div>
                    </div>
                    {errors.genero && <p className="error-message">{errors.genero.message}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="peso">
                      <Weight size={16} />
                      Peso (kg) *
                    </label>
                    <div className={`input-container ${getFieldClass("peso")}`}>
                      <input
                        type="number"
                        id="peso"
                        step="0.1"
                        min="0.1"
                        max="200"
                        placeholder="Ej: 5.5"
                        {...register("peso", {
                          required: "El peso es obligatorio",
                          min: { value: 0.1, message: "El peso debe ser mayor a 0" },
                          max: { value: 200, message: "El peso debe ser menor a 200kg" },
                        })}
                      />
                      <span className="input-icon">
                        {dirtyFields.peso && !errors.peso && "✓"}
                        {errors.peso && "!"}
                      </span>
                    </div>
                    {errors.peso && <p className="error-message">{errors.peso.message}</p>}
                  </div>
                </div>

                {/* Segunda fila - Color */}
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="color">
                      <Palette size={16} />
                      Color *
                    </label>
                    <div className={`input-container ${getFieldClass("color")}`}>
                      <input
                        type="text"
                        id="color"
                        placeholder="Ej: Marrón, Negro, Blanco con manchas..."
                        {...register("color", {
                          required: "El color es obligatorio",
                          minLength: { value: 3, message: "Mínimo 3 caracteres" },
                          maxLength: { value: 30, message: "Máximo 30 caracteres" },
                        })}
                      />
                      <span className="input-icon">
                        {dirtyFields.color && !errors.color && "✓"}
                        {errors.color && "!"}
                      </span>
                    </div>
                    {errors.color && <p className="error-message">{errors.color.message}</p>}
                  </div>
                </div>

                {/* Tercera fila - Características especiales */}
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="caracteristicas">
                      <FileText size={16} />
                      Características especiales
                    </label>
                    <div className={`input-container ${getFieldClass("caracteristicas")}`}>
                      <textarea
                        id="caracteristicas"
                        rows="3"
                        placeholder="Describe características especiales, marcas distintivas, comportamiento, etc."
                        {...register("caracteristicas", {
                          maxLength: { value: 500, message: "Máximo 500 caracteres" },
                        })}
                      />
                      <span className="input-icon">
                        {dirtyFields.caracteristicas && !errors.caracteristicas && "✓"}
                        {errors.caracteristicas && "!"}
                      </span>
                    </div>
                    {errors.caracteristicas && <p className="error-message">{errors.caracteristicas.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Información Adicional */}
          {currentStep === 3 && (
            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">
                  <FileText size={24} />
                  Información Adicional
                </h3>
                <p className="section-description">Información médica y observaciones</p>
              </div>

              <div className="form-content">
                {/* Primera fila - Estado de salud */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Estado de vacunación</label>
                    <div className="checkbox-group">
                      <div className="checkbox-option">
                        <input type="checkbox" id="vacunado" {...register("vacunado")} />
                        <label htmlFor="vacunado">
                          <span className="checkbox-icon">💉</span>
                          Vacunado
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Estado reproductivo</label>
                    <div className="checkbox-group">
                      <div className="checkbox-option">
                        <input type="checkbox" id="esterilizado" {...register("esterilizado")} />
                        <label htmlFor="esterilizado">
                          <span className="checkbox-icon">✂️</span>
                          Esterilizado
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Segunda fila - Observaciones médicas */}
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="observaciones">
                      <FileText size={16} />
                      Observaciones médicas *
                    </label>
                    <div className={`input-container ${getFieldClass("observaciones")}`}>
                      <textarea
                        id="observaciones"
                        rows="4"
                        placeholder="Alergias, medicamentos, condiciones médicas especiales, etc."
                        {...register("observaciones", {
                          required: "Las observaciones son obligatorias",
                          maxLength: { value: 1000, message: "Máximo 1000 caracteres" },
                        })}
                      />
                      <span className="input-icon">
                        {dirtyFields.observaciones && !errors.observaciones && "✓"}
                        {errors.observaciones && "!"}
                      </span>
                    </div>
                    {errors.observaciones && <p className="error-message">{errors.observaciones.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="navigation-buttons">
            {currentStep > 1 && (
              <button type="button" className="nav-button back-button" onClick={prevStep}>
                <ArrowLeft size={16} />
                Anterior
              </button>
            )}

            <div className="nav-spacer"></div>

            {currentStep < totalSteps ? (
              <button type="button" className="nav-button next-button" onClick={nextStep}>
                Siguiente
                <ArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Registrando...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Registrar Mascota
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default MascotaForm;