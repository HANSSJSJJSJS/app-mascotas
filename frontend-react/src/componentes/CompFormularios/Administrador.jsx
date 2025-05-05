"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import "react-datepicker/dist/react-datepicker.css"
import { registerLocale, setDefaultLocale } from "react-datepicker"
import es from "date-fns/locale/es"
import axios from "axios"
import Swal from "sweetalert2"

// Registrar el idioma español para el calendario
registerLocale("es", es)
setDefaultLocale("es")

export default function AdministradorForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [showPassword, setShowPassword] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)

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

  const email = watch("email")
  const password = watch("password")

  const onSubmit = async (data) => {
    try {
      // No logueamos los datos del formulario para evitar exponer información sensible
      const { confirmarEmail, confirmarPassword, ...userData } = data

      // Verificar que todos los campos requeridos estén presentes
      const camposRequeridos = [
        "tipoRol",
        "tipoDocumento",
        "numeroId",
        "genero",
        "fechaNacimiento",
        "nombre",
        "apellido",
        "telefono",
        "email",
        "password",
      ]

      const camposFaltantes = camposRequeridos.filter((campo) => !userData[campo])
      if (camposFaltantes.length > 0) {
        throw new Error(`Faltan campos requeridos: ${camposFaltantes.join(", ")}`)
      }

      // Verificar el formato de la fecha
      if (userData.fechaNacimiento) {
        const fecha = new Date(userData.fechaNacimiento)
        if (isNaN(fecha.getTime())) {
          throw new Error("El formato de la fecha de nacimiento es inválido")
        }
        // Asegurarse de que la fecha esté en formato YYYY-MM-DD
        userData.fechaNacimiento = fecha.toISOString().split("T")[0]
      }

      // Verificar la conexión al servidor antes de enviar los datos
      try {
        const healthCheck = await axios.get("http://localhost:5000/health", {
          timeout: 5000,
        })

        if (!healthCheck.data.database) {
          throw new Error("La base de datos no está conectada")
        }
      } catch (healthError) {
        throw new Error("No se pudo conectar con el servidor. Verifica que esté en ejecución.")
      }

      const response = await axios.post("http://localhost:5000/registro", userData, {
        timeout: 10000, // 10 segundos de timeout
      })

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: response.data.message,
          confirmButtonColor: "#495a90",
        }).then(() => {
          window.location.href = "/login"
        })

        reset()
      } else {
        throw new Error(response.data.message || "Error en el registro")
      }
    } catch (error) {
      let errorMessage = "Error al registrar el administrador"

      if (error.response) {
        // El servidor respondió con un error
        errorMessage = error.response.data?.message || error.response.data?.error || error.response.statusText

        // Solo en caso de error mostramos información en la consola (sin datos sensibles)
        console.error("Error en la respuesta del servidor:", errorMessage)
      } else if (error.request) {
        // La petición fue hecha pero no hubo respuesta
        errorMessage = "El servidor no respondió. Verifica que esté corriendo."
        console.error("No hubo respuesta del servidor")
      } else {
        // Error al configurar la petición
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
        fieldsToValidate = ["tipoRol", "tipoDocumento", "numeroId", "genero", "fechaNacimiento"]
        break
      case 2:
        fieldsToValidate = ["nombre", "apellido", "telefono"]
        break
      case 3:
        fieldsToValidate = ["imagen"]
        break
      case 4:
        fieldsToValidate = ["email", "confirmarEmail", "password", "confirmarPassword"]
        break
    }

    // Validar los campos del paso actual
    const isStepValid = await trigger(fieldsToValidate)

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
      window.scrollTo(0, 0)
    } else {
      // Mostrar mensaje de error si hay campos inválidos
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

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        // Importante: actualizar el valor en el formulario
        setValue("imagen", file)
      }
      reader.readAsDataURL(file)
    }
  }

  const openImageOptions = () => {
    if (showCamera) {
      stopCamera()
    } else {
      setShowOptions(!showOptions)
    }
  }

  const selectFromFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
    setShowOptions(false)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => console.error("Error al reproducir video:", err))
        }
        streamRef.current = stream
        setShowCamera(true)
        setShowOptions(false)
      }
    } catch (err) {
      console.error("Error al acceder a la cámara: ", err)
      alert("No se pudo acceder a la cámara. Verifica los permisos.")
      setShowOptions(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Configurar el canvas con las dimensiones del video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Dibujar el frame actual del video en el canvas
      const context = canvas.getContext("2d")
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convertir el canvas a una URL de datos
      const dataUrl = canvas.toDataURL("image/jpeg")
      setImagePreview(dataUrl)

      // Convertir la URL de datos a un archivo Blob
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" })
        setValue("imagen", file)
      }, "image/jpeg")

      // Detener la cámara
      stopCamera()
    }
  }

  // Cerrar el menú de opciones si se hace clic fuera de él
  const handleClickOutside = (e) => {
    if (showOptions && !e.target.closest(".image-options-menu") && !e.target.closest(".image-upload-label")) {
      setShowOptions(false)
    }
  }

  // Agregar event listener para cerrar el menú al hacer clic fuera
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showOptions])

  // Registrar el input de imagen después de que el componente se monte
  useEffect(() => {
    // Registrar la imagen en el formulario
    register("imagen")
  }, [register])

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Registro de Administrador</h2>

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
                  {index === 0 && "Información Personal"}
                  {index === 1 && "Datos Personales"}
                  {index === 2 && "Imagen de Perfil"}
                  {index === 3 && "Cuenta"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Paso 1: Información Personal */}
          {currentStep === 1 && (
            <div className="form-section">
              <h3 className="section-title">Información Personal</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tipoRol">Tipo de rol</label>
                  <div className={`input-container ${getFieldClass("tipoRol")}`}>
                    <select id="tipoRol" {...register("tipoRol", { required: "El tipo de rol es obligatorio" })}>
                      <option value="">Seleccione un rol</option>
                      <option value="A">Administrador</option>
                      <option value="V">Veterinario</option>
                      <option value="P">Propietario</option>
                    </select>
                  </div>
                  {errors.tipoRol && <p className="error-message">{errors.tipoRol.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="tipoDocumento">Tipo de documento</label>
                  <div className={`input-container ${getFieldClass("tipoDocumento")}`}>
                    <select
                      id="tipoDocumento"
                      {...register("tipoDocumento", { required: "El tipo de documento es obligatorio" })}
                    >
                      <option value="">Seleccione un tipo</option>
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="PP">Pasaporte</option>
                    </select>
                  </div>
                  {errors.tipoDocumento && <p className="error-message">{errors.tipoDocumento.message}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="numeroId">Número de documento</label>
                  <div className={`input-container ${getFieldClass("numeroId")}`}>
                    <input
                      type="number"
                      id="numeroId"
                      inputMode="numeric"
                      style={{ appearance: "textfield", MozAppearance: "textfield" }}
                      onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                      {...register("numeroId", {
                        required: "El número de documento es obligatorio",
                        min: { value: 1, message: "Solo números positivos" },
                        maxLength: { value: 10, message: "Máximo 10 dígitos" },
                        minLength: { value: 6, message: "Mínimo 6 dígitos" },
                      })}
                    />
                    <span className="input-icon">
                      {dirtyFields.numeroId && !errors.numeroId && "✓"}
                      {errors.numeroId && "!"}
                    </span>
                  </div>
                  {errors.numeroId && <p className="error-message">{errors.numeroId.message}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Género</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        value="Mujer"
                        type="radio"
                        id="01"
                        {...register("genero", { required: "El género es obligatorio" })}
                      />
                      <label htmlFor="01">Mujer</label>
                    </div>
                    <div className="radio-option">
                      <input
                        value="Hombre"
                        type="radio"
                        id="02"
                        {...register("genero", { required: "El género es obligatorio" })}
                      />
                      <label htmlFor="02">Hombre</label>
                    </div>
                    <div className="radio-option">
                      <input
                        value="No identificado"
                        type="radio"
                        id="03"
                        {...register("genero", { required: "El género es obligatorio" })}
                      />
                      <label htmlFor="03">No identificado</label>
                    </div>
                  </div>
                  {errors.genero && <p className="error-message">{errors.genero.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                  <div className={`input-container ${getFieldClass("fechaNacimiento")}`}>
                    <input
                      type="date"
                      id="fechaNacimiento"
                      {...register("fechaNacimiento", {
                        required: "La fecha de nacimiento es obligatoria.",
                        validate: (value) => {
                          const fechaNacimiento = new Date(value)
                          const hoy = new Date()
                          let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
                          const mes = hoy.getMonth() - fechaNacimiento.getMonth()
                          if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                            edad--
                          }
                          return edad >= 18 || "Debes ser mayor de 18 años."
                        },
                      })}
                    />
                  </div>
                  {errors.fechaNacimiento && <p className="error-message">{errors.fechaNacimiento.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Datos Personales */}
          {currentStep === 2 && (
            <div className="form-section">
              <h3 className="section-title">Datos Personales</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <div className={`input-container ${getFieldClass("nombre")}`}>
                    <input
                      type="text"
                      id="nombre"
                      {...register("nombre", {
                        required: { value: true, message: "El nombre es obligatorio" },
                        minLength: { value: 3, message: "Mínimo 3 caracteres" },
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
                  <label htmlFor="apellido">Apellido</label>
                  <div className={`input-container ${getFieldClass("apellido")}`}>
                    <input
                      type="text"
                      id="apellido"
                      {...register("apellido", {
                        required: { value: true, message: "El apellido es obligatorio" },
                        minLength: { value: 3, message: "Mínimo 3 caracteres" },
                        maxLength: { value: 30, message: "Máximo 30 caracteres" },
                        pattern: {
                          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
                          message: "Solo letras y espacios",
                        },
                      })}
                    />
                    <span className="input-icon">
                      {dirtyFields.apellido && !errors.apellido && "✓"}
                      {errors.apellido && "!"}
                    </span>
                  </div>
                  {errors.apellido && <p className="error-message">{errors.apellido.message}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <div className={`input-container ${getFieldClass("telefono")}`}>
                    <input
                      type="text"
                      id="telefono"
                      {...register("telefono", {
                        required: "El teléfono es obligatorio",
                        pattern: { value: /^[0-9]+$/, message: "Solo números" },
                        minLength: { value: 10, message: "Minimo 10 digitos" },
                        maxLength: { value: 10, message: "Maximo 10 digitos" },
                      })}
                    />
                    <span className="input-icon">
                      {dirtyFields.telefono && !errors.telefono && "✓"}
                      {errors.telefono && "!"}
                    </span>
                  </div>
                  {errors.telefono && <p className="error-message">{errors.telefono.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Imagen de Perfil */}
          {currentStep === 3 && (
            <div className="form-section">
              <h3 className="section-title">Imagen de Perfil</h3>
              <div className="form-row">
                <div className="form-group">
                  {showCamera ? (
                    <div className="camera-container">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-preview"
                        style={{ display: showCamera ? "block" : "none" }}
                      />
                      <div className="camera-controls">
                        <button type="button" onClick={capturePhoto} className="camera-button capture">
                          Capturar
                        </button>
                        <button type="button" onClick={stopCamera} className="camera-button cancel">
                          Cancelar
                        </button>
                      </div>
                      <canvas ref={canvasRef} style={{ display: "none" }} />
                    </div>
                  ) : (
                    <div className="image-upload-wrapper">
                      <div className="image-upload-label" onClick={openImageOptions}>
                        {imagePreview ? (
                          <img src={imagePreview || "/placeholder.svg"} alt="Vista previa" className="image-preview" />
                        ) : (
                          <div className="upload-placeholder">
                            <span>Subir Imagen</span>
                          </div>
                        )}
                      </div>

                      {showOptions && (
                        <div className="image-options-menu">
                          <button type="button" onClick={selectFromFiles} className="option-button">
                            Buscar en archivos
                          </button>
                          <button type="button" onClick={startCamera} className="option-button">
                            Usar cámara
                          </button>
                        </div>
                      )}

                      <input
                        type="file"
                        id="imagen"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                        className="image-upload-input"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Paso 4: Datos de Cuenta */}
          {currentStep === 4 && (
            <div className="form-section">
              <h3 className="section-title">Datos de Cuenta</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className={`input-container ${getFieldClass("email")}`}>
                    <input
                      type="email"
                      id="email"
                      {...register("email", {
                        required: "El email es obligatorio",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Formato no válido" },
                      })}
                    />
                    <span className="input-icon">
                      {dirtyFields.email && !errors.email && "✓"}
                      {dirtyFields.email && errors.email && "!"}
                    </span>
                  </div>
                  {dirtyFields.email && errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmarEmail">Confirmar Email</label>
                  <div className={`input-container ${getFieldClass("confirmarEmail")}`}>
                    <input
                      type="email"
                      id="confirmarEmail"
                      {...register("confirmarEmail", {
                        required: "Debes confirmar tu email",
                        validate: (value) => value === email || "Los emails no coinciden",
                      })}
                    />
                    <span className="input-icon">
                      {dirtyFields.confirmarEmail && !errors.confirmarEmail && "✓"}
                      {dirtyFields.confirmarEmail && errors.confirmarEmail && "!"}
                    </span>
                  </div>
                  {dirtyFields.confirmarEmail && errors.confirmarEmail && (
                    <p className="error-message">{errors.confirmarEmail.message}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <div className={`input-container ${getFieldClass("password")}`}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: { value: 8, message: "Mínimo 8 caracteres" },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.]{8,}$/,
                          message: "Debe contener mayúscula, minúscula, número y carácter especial",
                        },
                      })}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                    <span className="input-icon password-validation">
                      {dirtyFields.password && !errors.password && "✓"}
                      {dirtyFields.password && errors.password && "!"}
                    </span>
                  </div>
                  {dirtyFields.password && errors.password && (
                    <p className="error-message">{errors.password.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmarPassword">Confirmar Contraseña</label>
                  <div className={`input-container ${getFieldClass("confirmarPassword")}`}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmarPassword"
                      {...register("confirmarPassword", {
                        required: "Debes confirmar tu contraseña",
                        validate: (value) => value === password || "Las contraseñas no coinciden",
                      })}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                    <span className="input-icon password-validation">
                      {dirtyFields.confirmarPassword && !errors.confirmarPassword && "✓"}
                      {dirtyFields.confirmarPassword && errors.confirmarPassword && "!"}
                    </span>
                  </div>
                  {dirtyFields.confirmarPassword && errors.confirmarPassword && (
                    <p className="error-message">{errors.confirmarPassword.message}</p>
                  )}
                </div>
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
                Registrar Administrador
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
