import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { PawPrint, Upload, User, Heart, Calendar, Weight, Palette, FileText, ArrowLeft, ArrowRight, Check, X, UserCheck, Search } from "lucide-react";
import "../../stylos/cssVet/FormMascota.css";

function MascotaForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);

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

  // Buscar dueños
  const searchOwners = async () => {
    if (searchTerm.length < 3) return;
    
    try {
      const response = await axios.get(`http://localhost:3001/api/usuarios/buscar?term=${searchTerm}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        }
      });
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error buscando dueños:", error);
      setSearchResults([]);
    }
  };

  // Seleccionar dueño
  const selectOwner = (owner) => {
    setSelectedOwner(owner);
    setValue("id_pro", owner.id_usuario);
    setSearchTerm(`${owner.nombre} ${owner.apellido} - ${owner.cedula}`);
    setShowSearchResults(false);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
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
      formData.append("id_pro", data.id_pro || selectedOwner?.id_usuario);

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
        setShowSuccessModal(true);
        reset();
        setImagePreview(null);
        setCurrentStep(1);
        setSelectedOwner(null);
        setSearchTerm("");
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

  const nextStep = async () => {
    let fieldsToValidate = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["nombre", "especie", "raza", "fechaNacimiento", "id_pro"];
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
    return errors[fieldName] ? "mascota-form__field--error" : "mascota-form__field--success";
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

  const closeSuccessModal = () => setShowSuccessModal(false);

  return (
    <div className="mascota-form__container">
      <div className="mascota-form__form-container">
        <div className="mascota-form__header">
          <PawPrint className="mascota-form__icon" size={32} />
          <h2 className="mascota-form__title">Registro de Mascota</h2>
          <p className="mascota-form__subtitle">Completa la información de tu mascota en 3 sencillos pasos</p>
        </div>

        {/* Barra de progreso horizontal */}
        <div className="mascota-form__progress-container">
          <div className="mascota-form__progress-bar" style={{ width: `${progress}%` }}></div>
          <div className="mascota-form__steps">
            {[
              { number: 1, label: "Información Básica", icon: <PawPrint size={16} /> },
              { number: 2, label: "Características", icon: <Heart size={16} /> },
              { number: 3, label: "Información Adicional", icon: <FileText size={16} /> },
            ].map((step, index) => (
              <div
                key={index}
                className={`mascota-form__step ${currentStep > index ? "mascota-form__step--completed" : ""} ${
                  currentStep === index + 1 ? "mascota-form__step--active" : ""
                }`}
              >
                <div className="mascota-form__step-circle">
                  {currentStep > index + 1 ? <Check size={16} /> : step.icon}
                </div>
                <div className="mascota-form__step-info">
                  <div className="mascota-form__step-number">Paso {step.number}</div>
                  <div className="mascota-form__step-label">{step.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mascota-form__form">
          {/* Paso 1: Información Básica */}
          {currentStep === 1 && (
            <div className="mascota-form__section">
              <div className="mascota-form__section-header">
                <h3 className="mascota-form__section-title">
                  <PawPrint size={24} />
                  Información Básica
                </h3>
                <p className="mascota-form__section-description">Datos principales de tu mascota</p>
              </div>

              <div className="mascota-form__content">
                {/* Subida de imagen */}
                <div className="mascota-form__image-section">
                  <label htmlFor="imagen" className="mascota-form__image-upload-label">
                    {imagePreview ? (
                      <img src={imagePreview || "/placeholder.svg"} alt="Vista previa" className="mascota-form__image-preview" />
                    ) : (
                      <div className="mascota-form__upload-placeholder">
                        <Upload size={32} />
                        <span className="mascota-form__upload-text">Subir Foto</span>
                        <span className="mascota-form__upload-hint">JPG, PNG (máx. 5MB)</span>
                      </div>
                    )}
                  </label>
                  <input
                    type="file"
                    id="imagen"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mascota-form__image-upload-input"
                  />
                </div>

                <div className="mascota-form__fields-section">
                  {/* Campo de búsqueda de dueño */}
                  <div className="mascota-form__row">
                    <div className="mascota-form__group mascota-form__group--full-width">
                      <label htmlFor="buscarDueño">
                        <UserCheck size={16} />
                        Buscar Dueño *
                      </label>
                      <div className={`mascota-form__input-container ${getFieldClass("id_pro")}`}>
                        <div className="mascota-form__search-container">
                          <input
                            type="text"
                            id="buscarDueño"
                            placeholder="Buscar por nombre, apellido o cédula..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyUp={(e) => e.key === "Enter" && searchOwners()}
                          />
                          <button 
                            type="button" 
                            className="mascota-form__search-button"
                            onClick={searchOwners}
                          >
                            <Search size={16} />
                          </button>
                        </div>
                        {showSearchResults && (
                          <div className="mascota-form__search-results">
                            {searchResults.length > 0 ? (
                              searchResults.map((owner) => (
                                <div 
                                  key={owner.id_usuario} 
                                  className="mascota-form__search-result-item"
                                  onClick={() => selectOwner(owner)}
                                >
                                  <div className="mascota-form__owner-info">
                                    <span className="mascota-form__owner-name">{owner.nombre} {owner.apellido}</span>
                                    <span className="mascota-form__owner-id">Cédula: {owner.cedula}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="mascota-form__no-results">No se encontraron resultados</div>
                            )}
                          </div>
                        )}
                        {selectedOwner && (
                          <div className="mascota-form__selected-owner">
                            <span>Dueño seleccionado: {selectedOwner.nombre} {selectedOwner.apellido} (Cédula: {selectedOwner.cedula})</span>
                          </div>
                        )}
                      </div>
                      {errors.id_pro && <p className="mascota-form__error-message">Debe seleccionar un dueño para la mascota</p>}
                    </div>
                  </div>

                  {/* Primera fila - Nombre y Especie */}
                  <div className="mascota-form__row">
                    <div className="mascota-form__group">
                      <label htmlFor="nombre">
                        <PawPrint size={16} />
                        Nombre de la mascota *
                      </label>
                      <div className={`mascota-form__input-container ${getFieldClass("nombre")}`}>
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
                        <span className="mascota-form__input-icon">
                          {dirtyFields.nombre && !errors.nombre && "✓"}
                          {errors.nombre && "!"}
                        </span>
                      </div>
                      {errors.nombre && <p className="mascota-form__error-message">{errors.nombre.message}</p>}
                    </div>

                    <div className="mascota-form__group">
                      <label htmlFor="especie">
                        <Heart size={16} />
                        Especie *
                      </label>
                      <div className={`mascota-form__input-container ${getFieldClass("especie")}`}>
                        <select id="especie" {...register("especie", { required: "La especie es obligatoria" })}>
                          <option value="">Seleccione una especie</option>
                          <option value="Perro">🐕 Perro</option>
                          <option value="Gato">🐱 Gato</option>
                        </select>
                        <span className="mascota-form__input-icon">
                          {dirtyFields.especie && !errors.especie && "✓"}
                          {errors.especie && "!"}
                        </span>
                      </div>
                      {errors.especie && <p className="mascota-form__error-message">{errors.especie.message}</p>}
                    </div>
                  </div>

                  {/* Segunda fila - Raza y Fecha de nacimiento */}
                  <div className="mascota-form__row">
                    <div className="mascota-form__group">
                      <label htmlFor="raza">
                        <FileText size={16} />
                        Raza *
                      </label>
                      <div className={`mascota-form__input-container ${getFieldClass("raza")}`}>
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
                        <span className="mascota-form__input-icon">
                          {dirtyFields.raza && !errors.raza && "✓"}
                          {errors.raza && "!"}
                        </span>
                      </div>
                      {errors.raza && <p className="mascota-form__error-message">{errors.raza.message}</p>}
                    </div>

                    <div className="mascota-form__group">
                      <label htmlFor="fechaNacimiento">
                        <Calendar size={16} />
                        Fecha de nacimiento *
                      </label>
                      <div className={`mascota-form__input-container ${getFieldClass("fechaNacimiento")}`}>
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
                        <span className="mascota-form__input-icon">
                          {dirtyFields.fechaNacimiento && !errors.fechaNacimiento && "✓"}
                          {errors.fechaNacimiento && "!"}
                        </span>
                      </div>
                      {errors.fechaNacimiento && <p className="mascota-form__error-message">{errors.fechaNacimiento.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Características */}
          {currentStep === 2 && (
            <div className="mascota-form__section">
              <div className="mascota-form__section-header">
                <h3 className="mascota-form__section-title">
                  <Heart size={24} />
                  Características Físicas
                </h3>
                <p className="mascota-form__section-description">Detalles físicos de tu mascota</p>
              </div>

              <div className="mascota-form__content">
                {/* Primera fila - Género y Peso */}
                <div className="mascota-form__row">
                  <div className="mascota-form__group">
                    <label>
                      <User size={16} />
                      Género *
                    </label>
                    <div className="mascota-form__radio-group">
                      <div className="mascota-form__radio-option">
                        <input
                          value="Hembra"
                          type="radio"
                          id="hembra"
                          {...register("genero", { required: "El género es obligatorio" })}
                        />
                        <label htmlFor="hembra">
                          <span className="mascota-form__radio-icon">♀</span>
                          Hembra
                        </label>
                      </div>
                      <div className="mascota-form__radio-option">
                        <input
                          value="Macho"
                          type="radio"
                          id="macho"
                          {...register("genero", { required: "El género es obligatorio" })}
                        />
                        <label htmlFor="macho">
                          <span className="mascota-form__radio-icon">♂</span>
                          Macho
                        </label>
                      </div>
                    </div>
                    {errors.genero && <p className="mascota-form__error-message">{errors.genero.message}</p>}
                  </div>

                  <div className="mascota-form__group">
                    <label htmlFor="peso">
                      <Weight size={16} />
                      Peso (kg) *
                    </label>
                    <div className={`mascota-form__input-container ${getFieldClass("peso")}`}>
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
                      <span className="mascota-form__input-icon">
                        {dirtyFields.peso && !errors.peso && "✓"}
                        {errors.peso && "!"}
                      </span>
                    </div>
                    {errors.peso && <p className="mascota-form__error-message">{errors.peso.message}</p>}
                  </div>
                </div>

                {/* Segunda fila - Color */}
                <div className="mascota-form__row">
                  <div className="mascota-form__group mascota-form__group--full-width">
                    <label htmlFor="color">
                      <Palette size={16} />
                      Color *
                    </label>
                    <div className={`mascota-form__input-container ${getFieldClass("color")}`}>
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
                      <span className="mascota-form__input-icon">
                        {dirtyFields.color && !errors.color && "✓"}
                        {errors.color && "!"}
                      </span>
                    </div>
                    {errors.color && <p className="mascota-form__error-message">{errors.color.message}</p>}
                  </div>
                </div>

                {/* Tercera fila - Características especiales */}
                <div className="mascota-form__row">
                  <div className="mascota-form__group mascota-form__group--full-width">
                    <label htmlFor="caracteristicas">
                      <FileText size={16} />
                      Características especiales
                    </label>
                    <div className={`mascota-form__input-container ${getFieldClass("caracteristicas")}`}>
                      <textarea
                        id="caracteristicas"
                        rows="3"
                        placeholder="Describe características especiales, marcas distintivas, comportamiento, etc."
                        {...register("caracteristicas", {
                          maxLength: { value: 500, message: "Máximo 500 caracteres" },
                        })}
                      />
                      <span className="mascota-form__input-icon">
                        {dirtyFields.caracteristicas && !errors.caracteristicas && "✓"}
                        {errors.caracteristicas && "!"}
                      </span>
                    </div>
                    {errors.caracteristicas && <p className="mascota-form__error-message">{errors.caracteristicas.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Información Adicional */}
          {currentStep === 3 && (
            <div className="mascota-form__section">
              <div className="mascota-form__section-header">
                <h3 className="mascota-form__section-title">
                  <FileText size={24} />
                  Información Adicional
                </h3>
                <p className="mascota-form__section-description">Información médica y observaciones</p>
              </div>

              <div className="mascota-form__content">
                {/* Primera fila - Estado de salud */}
                <div className="mascota-form__row">
                  <div className="mascota-form__group">
                    <label>Estado de vacunación</label>
                    <div className="mascota-form__checkbox-group">
                      <div className="mascota-form__checkbox-option">
                        <input type="checkbox" id="vacunado" {...register("vacunado")} />
                        <label htmlFor="vacunado">
                          <span className="mascota-form__checkbox-icon">💉</span>
                          Vacunado
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mascota-form__group">
                    <label>Estado reproductivo</label>
                    <div className="mascota-form__checkbox-group">
                      <div className="mascota-form__checkbox-option">
                        <input type="checkbox" id="esterilizado" {...register("esterilizado")} />
                        <label htmlFor="esterilizado">
                          <span className="mascota-form__checkbox-icon">✂️</span>
                          Esterilizado
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Segunda fila - Observaciones médicas */}
                <div className="mascota-form__row">
                  <div className="mascota-form__group mascota-form__group--full-width">
                    <label htmlFor="observaciones">
                      <FileText size={16} />
                      Observaciones médicas *
                    </label>
                    <div className={`mascota-form__input-container ${getFieldClass("observaciones")}`}>
                      <textarea
                        id="observaciones"
                        rows="4"
                        placeholder="Alergias, medicamentos, condiciones médicas especiales, etc."
                        {...register("observaciones", {
                          required: "Las observaciones son obligatorias",
                          maxLength: { value: 1000, message: "Máximo 1000 caracteres" },
                        })}
                      />
                      <span className="mascota-form__input-icon">
                        {dirtyFields.observaciones && !errors.observaciones && "✓"}
                        {errors.observaciones && "!"}
                      </span>
                    </div>
                    {errors.observaciones && <p className="mascota-form__error-message">{errors.observaciones.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="mascota-form__navigation">
            {currentStep > 1 && (
              <button type="button" className="mascota-form__nav-button mascota-form__nav-button--back" onClick={prevStep}>
                <ArrowLeft size={16} />
                Anterior
              </button>
            )}

            <div className="mascota-form__nav-spacer"></div>

            {currentStep < totalSteps ? (
              <button type="button" className="mascota-form__nav-button mascota-form__nav-button--next" onClick={nextStep}>
                Siguiente
                <ArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" className="mascota-form__submit-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mascota-form__spinner"></div>
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

        {/* Modal de éxito al registrar mascota */}
        {showSuccessModal && (
          <div className="mascota-form__modal-overlay" onClick={closeSuccessModal}>
            <div className="mascota-form__modal-success" onClick={e => e.stopPropagation()}>
              <div className="mascota-form__modal-content">
                <div className="mascota-form__modal-icon">
                  <CheckCircle size={48} />
                </div>
                <h3>¡Mascota registrada correctamente!</h3>
                <p>La información de la mascota ha sido guardada exitosamente.</p>
                <button className="mascota-form__modal-button" onClick={closeSuccessModal}>
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MascotaForm;