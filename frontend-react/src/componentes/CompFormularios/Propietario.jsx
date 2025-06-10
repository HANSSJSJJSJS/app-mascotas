import { useState } from "react"
import { useForm } from "react-hook-form"
import "react-datepicker/dist/react-datepicker.css"
import { setDefaultLocale } from "react-datepicker"
import axios from "axios"
import Swal from "sweetalert2"
import "../../stylos/cssFormularios/Propietario.css"
import "../../stylos/cssFormularios/direccion-avanzada.css"
// Registrar el idioma español para el calendario

// Lista de ciudades colombianas
const ciudadesColombianas = [
  { value: "", label: "Seleccione una ciudad" },
  { value: "bogota", label: "Bogotá D.C." },
  { value: "soacha", label: "Soacha" },
]

// Reemplazar la función validarDireccionReal con una versión mejorada:

const validarDireccionReal = async (direccion, ciudad, barrio) => {
  try {
    console.log("🔍 Iniciando validación:", { direccion, ciudad, barrio })

    // Validación básica del formato de dirección colombiana más flexible
    const formatoDireccionValido =
      /^(calle|carrera|diagonal|transversal|avenida|av|cr|cl|dg|tv|kr|tr|cra|cll)\s*\d+[a-z]?[\s\-#]*\d+[\s-]*\d*/i.test(
        direccion,
      )

    if (!formatoDireccionValido) {
      console.log("❌ Formato de dirección inválido:", direccion)
      return false
    }

    const ciudadLabel = ciudadesColombianas.find((c) => c.value === ciudad)?.label || ciudad

    // Normalizar la dirección para mejorar la búsqueda
    const direccionNormalizada = direccion
      .toLowerCase()
      .replace(/\bno\b/g, "#")
      .replace(/\bno\.\b/g, "#")
      .replace(/\s+/g, " ")
      .trim()

    // Intentar múltiples consultas para mejorar las posibilidades de encontrar la dirección
    const queries = [
      `${direccionNormalizada}, ${barrio}, ${ciudadLabel}, Colombia`,
      `${direccionNormalizada}, ${ciudadLabel}, Colombia`,
      `${direccion}, ${barrio}, ${ciudadLabel}`,
      `${direccion}, ${ciudadLabel}, Cundinamarca, Colombia`,
    ]

    console.log("🔍 Queries a probar:", queries)

    // Crear AbortController para manejar timeout manualmente
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 segundos

    try {
      for (const query of queries) {
        console.log("🌐 Probando query:", query)

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3&countrycodes=co&addressdetails=1`,
          {
            headers: {
              "User-Agent": "PropietarioApp/1.0",
            },
            signal: controller.signal,
          },
        )

        if (response.ok) {
          const data = await response.json()
          console.log(`📍 Respuesta para "${query}":`, data)

          if (data && data.length > 0) {
            // Buscar el mejor resultado
            const mejorResultado = data.find((resultado) => {
              const address = resultado.address || {}
              const displayName = resultado.display_name || ""

              // Verificar que contenga Colombia
              const contieneColombiaYCiudad =
                displayName.toLowerCase().includes("colombia") &&
                (displayName.toLowerCase().includes(ciudadLabel.toLowerCase()) ||
                  displayName.toLowerCase().includes("cundinamarca") ||
                  displayName.toLowerCase().includes("soacha"))

              // Verificar que tenga información de dirección específica
              const tieneInformacionEspecifica =
                address.house_number || address.road || address.street || resultado.importance > 0.1

              console.log("🔍 Evaluando resultado:", {
                displayName: displayName.substring(0, 100),
                contieneColombiaYCiudad,
                tieneInformacionEspecifica,
                importance: resultado.importance,
                address: address,
              })

              return contieneColombiaYCiudad && tieneInformacionEspecifica
            })

            if (mejorResultado) {
              clearTimeout(timeoutId)
              console.log("✅ Dirección válida encontrada:", mejorResultado)
              return true
            }
          }
        }

        // Pequeña pausa entre consultas para no sobrecargar la API
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      clearTimeout(timeoutId)
      console.log("❌ No se encontró una dirección válida en ninguna consulta")
      return false
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError.name === "AbortError") {
        console.log("⏱️ Timeout en la validación de dirección")
        return false
      }
      throw fetchError
    }
  } catch (error) {
    console.error("❌ Error validando dirección:", error)
    return false
  }
}

// También actualizar la función de debounce para que sea menos agresiva:

const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

setDefaultLocale("es")

function Propietario() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [showPassword, setShowPassword] = useState(false)
  const [validandoDireccion, setValidandoDireccion] = useState(false)
  const [direccionVerificada, setDireccionVerificada] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    setError,
    clearErrors,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "onChange",
  })

  const email = watch("email")
  const password = watch("password")
  const ciudadSeleccionada = watch("ciudad")
  const direccionActual = watch("direccion")
  const barrioActual = watch("barrio")

  // También actualizar la función de debounce para que sea menos agresiva:

  const validarDireccion = debounce(async (direccion, ciudad, barrio) => {
    if (!direccion || !ciudad || !barrio || direccion.length < 8) {
      setDireccionVerificada(false)
      return
    }

    console.log("🚀 Iniciando validación con debounce:", { direccion, ciudad, barrio })
    setValidandoDireccion(true)
    clearErrors("direccion")

    try {
      const esValida = await validarDireccionReal(direccion, ciudad, barrio)

      if (esValida) {
        console.log("✅ Dirección verificada exitosamente")
        setDireccionVerificada(true)
        clearErrors("direccion")
      } else {
        console.log("❌ Dirección no pudo ser verificada")
        setDireccionVerificada(false)
        setError("direccion", {
          type: "manual",
          message:
            "No se pudo verificar esta dirección. Intente con un formato más específico o verifique que la dirección exista.",
        })
      }
    } catch (error) {
      console.error("❌ Error en validación:", error)
      setDireccionVerificada(false)
      setError("direccion", {
        type: "manual",
        message: "Error al verificar la dirección. Verifique su conexión e intente nuevamente.",
      })
    } finally {
      setValidandoDireccion(false)
    }
  }, 1000)

  const onSubmit = async (data) => {
    try {
      // No logueamos los datos del formulario para evitar exponer información sensible
      const { confirmarEmail, confirmarPassword, ...userData } = data

      // Verificar que todos los campos requeridos estén presentes
      const camposRequeridos = [
        "tipoDocumento",
        "numeroId",
        "genero",
        "fechaNacimiento",
        "nombre",
        "apellido",
        "telefono",
        "ciudad",
        "barrio",
        "direccion",
        "email",
        "password",
      ]

      const camposFaltantes = camposRequeridos.filter((campo) => !userData[campo])
      if (camposFaltantes.length > 0) {
        throw new Error(`Faltan campos requeridos: ${camposFaltantes.join(", ")}`)
      }

      // Verificar que la dirección esté verificada
      if (!direccionVerificada) {
        throw new Error("La dirección debe estar verificada antes de continuar")
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
        const healthCheck = await axios.get("http://localhost:3001/health", {
          timeout: 5000,
        })

        debugger
        if (!healthCheck.data.database) {
          throw new Error("La base de datos no está conectada")
        }
      } catch (healthError) {
        throw new Error("No se pudo conectar con el servidor. Verifica que esté en ejecución.")
      }

      const response = await axios.post("http://localhost:3001/registro", userData, {
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
      let errorMessage = "Error al registrar el propietario"

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
        fieldsToValidate = ["tipoDocumento", "numeroId", "genero", "fechaNacimiento"]
        break
      case 2:
        fieldsToValidate = ["nombre", "apellido", "telefono"]
        break
      case 3:
        fieldsToValidate = ["ciudad", "barrio", "direccion"]
        break
      case 4:
        fieldsToValidate = ["email", "confirmarEmail", "password", "confirmarPassword"]
        break
    }

    // Validar los campos del paso actual
    const isStepValid = await trigger(fieldsToValidate)

    // Validación adicional para el paso 3 (ubicación)
    if (currentStep === 3) {
      if (!direccionVerificada) {
        Swal.fire({
          icon: "warning",
          title: "Dirección no verificada",
          text: "La dirección debe estar verificada antes de continuar. Use el formato correcto: Calle/Carrera + número + # + número",
          confirmButtonColor: "#495a90",
        })
        return
      }
    }

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
    if (fieldName === "direccion") {
      if (validandoDireccion) return "field-validating"
      if (direccionVerificada && !errors[fieldName]) return "field-success"
      if (errors[fieldName] || !direccionVerificada) return "field-error"
    }
    return errors[fieldName] ? "field-error" : "field-success"
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Registro de Propietario</h2>

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
                  {index === 2 && "Ubicación"}
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

          {/* Paso 3: Ubicación */}
          {currentStep === 3 && (
            <div className="form-section">
              <h3 className="section-title">Ubicación</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad</label>
                  <div className={`input-container ${getFieldClass("ciudad")}`}>
                    <select
                      id="ciudad"
                      {...register("ciudad", {
                        required: { value: true, message: "La ciudad es obligatoria" },
                        validate: (value) => value !== "" || "Debe seleccionar una ciudad",
                        onChange: () => {
                          setDireccionVerificada(false)
                        },
                      })}
                    >
                      {ciudadesColombianas.map((ciudad) => (
                        <option key={ciudad.value} value={ciudad.value}>
                          {ciudad.label}
                        </option>
                      ))}
                    </select>
                    <span className="input-icon">
                      {dirtyFields.ciudad && !errors.ciudad && "✓"}
                      {errors.ciudad && "!"}
                    </span>
                  </div>
                  {errors.ciudad && <p className="error-message">{errors.ciudad.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="barrio">Barrio</label>
                  <div className={`input-container ${getFieldClass("barrio")}`}>
                    <input
                      type="text"
                      id="barrio"
                      placeholder="Ej: Chapinero, Kennedy, San Mateo, Hogares Soacha"
                      {...register("barrio", {
                        required: { value: true, message: "El barrio es obligatorio" },
                        minLength: { value: 3, message: "Mínimo 3 caracteres" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" },
                        pattern: {
                          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s0-9\-.,]+$/,
                          message: "Formato de barrio inválido",
                        },
                        onChange: () => {
                          setDireccionVerificada(false)
                        },
                      })}
                    />
                    <span className="input-icon">
                      {dirtyFields.barrio && !errors.barrio && "✓"}
                      {errors.barrio && "!"}
                    </span>
                  </div>
                  {errors.barrio && <p className="error-message">{errors.barrio.message}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label htmlFor="direccion">Dirección completa</label>
                  <div className={`input-container ${getFieldClass("direccion")}`}>
                    <input
                      type="text"
                      id="direccion"
                      placeholder="Ej: Carrera 19 # 5-13 Sur, Calle 13 # 45-67, Transversal 4F # 0-192"
                      {...register("direccion", {
                        required: { value: true, message: "La dirección es obligatoria" },
                        minLength: { value: 8, message: "Mínimo 8 caracteres" },
                        maxLength: { value: 100, message: "Máximo 100 caracteres" },
                        pattern: {
                          value:
                            /^(calle|carrera|diagonal|transversal|avenida|av|cr|cl|dg|tv|kr|tr|cra|cll)\s*\d+[a-z]?\s*(#|no\.?|-)?\s*\d+[a-z]?\s*[-]?\s*\d*\s*(sur|norte|oriente|occidente|este|oeste)?$/i,
                          message: "Use formato: Tipo de vía + número + # + número (ej: Carrera 19A # 5-13 Sur)",
                        },
                        onChange: (e) => {
                          setDireccionVerificada(false)
                          const direccion = e.target.value
                          if (ciudadSeleccionada && barrioActual && direccion.length >= 8) {
                            validarDireccion(direccion, ciudadSeleccionada, barrioActual)
                          }
                        },
                      })}
                    />
                    <span className="input-icon">
                      {validandoDireccion && "⏳"}
                      {!validandoDireccion && direccionVerificada && !errors.direccion && "✓"}
                      {!validandoDireccion && (!direccionVerificada || errors.direccion) && "!"}
                    </span>
                  </div>
                  {errors.direccion && <p className="error-message">{errors.direccion.message}</p>}
                  {validandoDireccion && <p className="info-message">🔍 Verificando dirección...</p>}
                  {!validandoDireccion && direccionVerificada && (
                    <p className="success-message">✅ Dirección verificada correctamente</p>
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
                Registrar Propietario
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Propietario
