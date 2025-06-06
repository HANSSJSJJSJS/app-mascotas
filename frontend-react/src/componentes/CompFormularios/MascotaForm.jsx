import { useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import Swal from "sweetalert2"
import "../../stylos/cssFormularios/MascotaForm.css"

function MascotaForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  const [imagePreview, setImagePreview] = useState(null)
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
  })

  const onSubmit = async (data) => {
    try {
      // Verificar que todos los campos requeridos estén presentes
      const camposRequeridos = ["nombre", "especie", "raza", "fechaNacimiento", "genero", "peso", "numeroIdPropietario"]

      const camposFaltantes = camposRequeridos.filter((campo) => !data[campo])
      if (camposFaltantes.length > 0) {
        throw new Error(`Faltan campos requeridos: ${camposFaltantes.join(", ")}`)
      }

      // Verificar la conexión al servidor antes de enviar los datos
      try {
        const healthCheck = await axios.get("http://localhost:3001/health", {
          timeout: 5000,
        })

        if (!healthCheck.data.database) {
          throw new Error("La base de datos no está conectada")
        }
      } catch (healthError) {
        throw new Error("No se pudo conectar con el servidor. Verifica que esté en ejecución.")
      }

      const response = await axios.post("http://localhost:3001/registro-mascota", data, {
        timeout: 10000,
      })

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: response.data.message,
          confirmButtonColor: "#495a90",
        }).then(() => {
          reset()
          setImagePreview(null)
          setCurrentStep(1)
        })
      } else {
        throw new Error(response.data.message || "Error en el registro")
      }
    } catch (error) {
      let errorMessage = "Error al registrar la mascota"

      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || error.response.statusText
        console.error("Error en la respuesta del servidor:", errorMessage)
      } else if (error.request) {
        errorMessage = "El servidor no respondió. Verifica que esté corriendo."
        console.error("No hubo respuesta del servidor")
      } else {
        errorMessage = error.message
        console.error("Error en la petición:", errorMessage)
      }

      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: errorMessage,
        confirmButtonColor: "#d33",
      })
    }
  }

  // Función para ir al siguiente paso con validación
  const nextStep = async () => {
    let fieldsToValidate = []

    // Determinar qué campos validar según el paso actual
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["nombre", "especie", "raza", "fechaNacimiento"]
        break
      case 2:
        fieldsToValidate = ["genero", "peso", "color", "caracteristicas"]
        break
      case 3:
        fieldsToValidate = ["numeroIdPropietario"]
        break
    }

    // Validar los campos del paso actual
    const isStepValid = await trigger(fieldsToValidate)

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
      window.scrollTo(0, 0)
    } else {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, complete todos los campos requeridos correctamente.",
        confirmButtonColor: "#495a90",
      })
    }
  }

  // Función para volver al paso anterior
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo(0, 0)
  }

  // Calcular el progreso para la barra
  const progress = (currentStep / totalSteps) * 100

  // Función para determinar la clase de validación del campo
  const getFieldClass = (fieldName) => {
    if (!dirtyFields[fieldName]) return ""
    return errors[fieldName] ? "field-error" : "field-success"
  }

  // Función para manejar el cambio de imagen
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Archivo muy grande",
          text: "La imagen debe ser menor a 5MB",
          confirmButtonColor: "#d33",
        })
        return
      }

      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Tipo de archivo inválido",
          text: "Solo se permiten archivos de imagen",
          confirmButtonColor: "#d33",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setValue("imagen", file)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Registro de Mascota</h2>

        {/* Barra de progreso */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <div className="progress-steps">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`progress-step ${currentStep > index ? "completed" : ""} ${
                  currentStep === index + 1 ? "active" : ""
                }`}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-label">
                  {index === 0 && "Información Básica"}
                  {index === 1 && "Características"}
                  {index === 2 && "Propietario"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Paso 1: Información Básica */}
          {currentStep === 1 && (
            <div className="form-section">
              <h3 className="section-title">Información Básica</h3>

              {/* Subida de imagen */}
              <div className="image-upload-container">
                <label htmlFor="imagen" className="image-upload-label">
                  {imagePreview ? (
                    <img src={imagePreview || "/placeholder.svg"} alt="Vista previa" className="image-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <span className="upload-icon">📷</span>
                      <span>Subir Imagen de la Mascota</span>
                      <span className="upload-hint">Máximo 5MB - JPG, PNG, GIF</span>
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre de la mascota</label>
                  <div className={`input-container ${getFieldClass("nombre")}`}>
                    <input
                      type="text"
                      id="nombre"
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
                  <label htmlFor="especie">Especie</label>
                  <div className={`input-container ${getFieldClass("especie")}`}>
                    <select id="especie" {...register("especie", { required: "La especie es obligatoria" })}>
                      <option value="">Seleccione una especie</option>
                      <option value="Perro">Perro</option>
                      <option value="Gato">Gato</option>
                      <option value="Ave">Ave</option>
                      <option value="Conejo">Conejo</option>
                      <option value="Hamster">Hamster</option>
                      <option value="Otro">Otro</option>
                    </select>
                    <span className="input-icon">
                      {dirtyFields.especie && !errors.especie && "✓"}
                      {errors.especie && "!"}
                    </span>
                  </div>
                  {errors.especie && <p className="error-message">{errors.especie.message}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="raza">Raza</label>
                  <div className={`input-container ${getFieldClass("raza")}`}>
                    <input
                      type="text"
                      id="raza"
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
                  <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                  <div className={`input-container ${getFieldClass("fechaNacimiento")}`}>
                    <input
                      type="date"
                      id="fechaNacimiento"
                      {...register("fechaNacimiento", {
                        required: "La fecha de nacimiento es obligatoria",
                        validate: (value) => {
                          const fechaNacimiento = new Date(value)
                          const hoy = new Date()
                          return fechaNacimiento <= hoy || "La fecha no puede ser futura"
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
            </div>
          )}

          {/* Paso 2: Características */}
          {currentStep === 2 && (
            <div className="form-section">
              <h3 className="section-title">Características Físicas</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Género</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        value="Hembra"
                        type="radio"
                        id="hembra"
                        {...register("genero", { required: "El género es obligatorio" })}
                      />
                      <label htmlFor="hembra">Hembra</label>
                    </div>
                    <div className="radio-option">
                      <input
                        value="Macho"
                        type="radio"
                        id="macho"
                        {...register("genero", { required: "El género es obligatorio" })}
                      />
                      <label htmlFor="macho">Macho</label>
                    </div>
                  </div>
                  {errors.genero && <p className="error-message">{errors.genero.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="peso">Peso (kg)</label>
                  <div className={`input-container ${getFieldClass("peso")}`}>
                    <input
                      type="number"
                      id="peso"
                      step="0.1"
                      min="0.1"
                      max="200"
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <div className={`input-container ${getFieldClass("color")}`}>
                    <input
                      type="text"
                      id="color"
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

              <div className="form-group">
                <label htmlFor="caracteristicas">Características especiales</label>
                <div className={`input-container ${getFieldClass("caracteristicas")}`}>
                  <textarea
                    id="caracteristicas"
                    rows="4"
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
          )}

          {/* Paso 3: Información del Propietario */}
          {currentStep === 3 && (
            <div className="form-section">
              <h3 className="section-title">Información del Propietario</h3>

              <div className="form-group">
                <label htmlFor="numeroIdPropietario">Número de documento del propietario</label>
                <div className={`input-container ${getFieldClass("numeroIdPropietario")}`}>
                  <input
                    type="text"
                    id="numeroIdPropietario"
                    {...register("numeroIdPropietario", {
                      required: "El número de documento del propietario es obligatorio",
                      pattern: { value: /^[0-9]+$/, message: "Solo números" },
                      maxLength: { value: 10, message: "Máximo 10 dígitos" },
                      minLength: { value: 6, message: "Mínimo 6 dígitos" },
                    })}
                  />
                  <span className="input-icon">
                    {dirtyFields.numeroIdPropietario && !errors.numeroIdPropietario && "✓"}
                    {errors.numeroIdPropietario && "!"}
                  </span>
                </div>
                {errors.numeroIdPropietario && <p className="error-message">{errors.numeroIdPropietario.message}</p>}
                <p className="field-hint">Este documento debe estar registrado previamente en el sistema</p>
              </div>

              <div className="form-group">
                <label htmlFor="observaciones">Observaciones médicas</label>
                <div className={`input-container ${getFieldClass("observaciones")}`}>
                  <textarea
                    id="observaciones"
                    rows="4"
                    placeholder="Alergias, medicamentos, condiciones médicas especiales, etc."
                    {...register("observaciones", {
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
          )}

          {/* Botones de navegación */}
          <div className="navigation-buttons">
            {currentStep > 1 && (
              <button type="button" className="nav-button back-button" onClick={prevStep}>
                Volver
              </button>
            )}

            {currentStep < totalSteps ? (
              <button type="button" className="nav-button next-button" onClick={nextStep}>
                Siguiente
              </button>
            ) : (
              <button type="submit" className="submit-button">
                Registrar Mascota
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default MascotaForm
