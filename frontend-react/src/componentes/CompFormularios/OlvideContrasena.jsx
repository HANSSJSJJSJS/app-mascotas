"use client"

import { useState, useEffect } from "react"
import emailjs from "@emailjs/browser"
import "../../stylos/cssFormularios/OlvideContrasena.css"
import logo from "../../imagenes/logo.png"

const OlvideContrasena = () => {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Configuración de EmailJS
  const EMAILJS_CONFIG = {
    serviceId: "service_fc4gglm",
    templateId: "template_mfv4h2s",
    publicKey: "28rzkwWqZRDIbe7D9",
  }

  // Inicializar EmailJS
  useEffect(() => {
    try {
      emailjs.init(EMAILJS_CONFIG.publicKey)
      console.log("📧 EmailJS inicializado correctamente")
    } catch (error) {
      console.error("❌ Error al inicializar EmailJS:", error)
    }
  }, [])

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Ingrese un correo electrónico válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Generar token de recuperación
  const generateResetToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Función para enviar el correo de recuperación
  const sendRecoveryEmail = async (userEmail) => {
    try {
      console.log("🚀 Iniciando proceso de envío para:", userEmail)

      // Generar token único
      const resetToken = generateResetToken()
      const expiryTime = Date.now() + 60 * 60 * 1000

      // Guardar token en localStorage
      localStorage.setItem(`reset_token_${userEmail}`, resetToken)
      localStorage.setItem(`reset_token_expiry_${userEmail}`, expiryTime.toString())

      // Crear enlace de recuperación
      const resetLink = `${window.location.origin}/cambio-contrasena?token=${resetToken}&email=${encodeURIComponent(userEmail)}`

      // Parámetros para el template
      const templateParams = {
        user_email: userEmail,
        user_name: userEmail.split("@")[0],
        reset_link: resetLink,
        expiry_time: "1 hora",
        to_email: userEmail,
        from_name: "Pet Move Clínica Veterinaria",
      }

      console.log("📋 Enviando con parámetros:", templateParams)

      // Enviar correo
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey,
      )

      console.log("✅ Respuesta completa:", response)

      if (response.status === 200) {
        return { success: true }
      } else {
        throw new Error(`Error del servidor: ${response.status}`)
      }
    } catch (error) {
      console.error("❌ Error completo:", error)

      // Manejo específico de errores
      let errorMessage = "No se pudo enviar el correo de recuperación"

      if (error.status === 412) {
        errorMessage = "🔐 La conexión con Gmail ha expirado. El administrador debe reconectar el servicio de correo."
      } else if (error.text && error.text.includes("Invalid grant")) {
        errorMessage = "🔐 Autorización de Gmail expirada. Contacta al administrador para reconectar el servicio."
      } else if (error.text && error.text.includes("template")) {
        errorMessage = "📧 Template de correo no encontrado. Contacta al administrador."
      } else if (error.text && error.text.includes("service")) {
        errorMessage = "🔧 Servicio de correo no disponible. Intenta más tarde."
      } else if (error.message && error.message.includes("network")) {
        errorMessage = "🌐 Error de conexión. Verifica tu internet e intenta nuevamente."
      }

      throw new Error(errorMessage)
    }
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)
      setErrors({})

      try {
        await sendRecoveryEmail(email)
        setIsSubmitted(true)
      } catch (error) {
        setErrors({
          submit: error.message || "Error desconocido al enviar el correo.",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="main-container">
      <div className="login_container">
        <div className="form_area">
          <p className="title">RECUPERAR CONTRASEÑA</p>

          {isSubmitted ? (
            <div className="success-message-container">
              <div className="success-icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <p className="success-text">¡Correo enviado exitosamente! 📧</p>
              <p className="success-instruction">
                Se ha enviado un enlace de recuperación a <strong>{email}</strong>.
                <br />
                <br />📥 Revisa tu bandeja de entrada y también la carpeta de <strong>spam</strong>.
                <br />⏰ El enlace expirará en 1 hora.
              </p>
              <button className="btn" onClick={() => (window.location.href = "/login")}>
                VOLVER AL INICIO DE SESIÓN
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form_group">
                <label className="sub_title" htmlFor="email">
                  Email
                </label>
                <input
                  placeholder="Ingresa tu email de registro"
                  id="email"
                  className={`form_style ${errors.email ? "error" : ""}`}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors((prev) => ({ ...prev, email: "", submit: "" }))
                  }}
                  required
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>

              <div className="recovery-instructions">
                <p>
                  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu
                  contraseña.
                </p>
              </div>

              {errors.submit && (
                <div
                  className="error-message server-error"
                  style={{
                    backgroundColor: "#fee2e2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "15px",
                    marginBottom: "20px",
                    color: "#dc2626",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "8px" }}>❌ Error de Configuración</div>
                  <div style={{ marginBottom: "10px" }}>{errors.submit}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.4" }}>
                    💡 <strong>Para el administrador:</strong> Ve a EmailJS Dashboard → Email Services → Reconectar
                    Gmail
                  </div>
                </div>
              )}

              <div>
                <button type="submit" className="btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      ENVIANDO...
                    </>
                  ) : (
                    "ENVIAR INSTRUCCIONES"
                  )}
                </button>

                <p>
                  ¿Recordaste tu contraseña?{" "}
                  <a href="/login" className="link">
                    Iniciar sesión
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="logo-container">
          <img className="logo-image" src={logo || "/placeholder.svg"} alt="Pet Move Logo" />
        </div>
      </div>
    </div>
  )
}

export default OlvideContrasena
