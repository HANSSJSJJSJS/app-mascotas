import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import "../../stylos/cssPropietario/ActualizarPropietario.css"
import { Save, Loader2, Upload, User, Phone, Mail, MapPin, AlertCircle, Camera, CheckCircle, XCircle } from "lucide-react"

const formSchema = z.object({
  telefono: z.string().min(8, { message: "El teléfono debe tener al menos 8 dígitos" }),
  email: z.string().email({ message: "Ingrese un email válido" }),
  direccion: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
  ciudad: z.string().optional(),
  barrio: z.string().optional(),
})

export default function ActualizarPropietario() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagenPreview, setImagenPreview] = useState(null)
  const [imagenFile, setImagenFile] = useState(null)
  const [propietario, setPropietario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem("pet-app-user")
        if (userData) {
          const parsedData = JSON.parse(userData)
          setPropietario(parsedData)
          console.log("Datos del usuario cargados:", parsedData)
        } else {
          setError("No se encontraron datos del usuario")
        }
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err)
        setError("Error al cargar los datos del usuario")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  // Actualizar valores del formulario cuando se cargan los datos
  useEffect(() => {
    if (propietario) {
      reset({
        telefono: propietario.telefono || "",
        email: propietario.email || "",
        direccion: propietario.direccion || "",
        ciudad: propietario.ciudad || "",
        barrio: propietario.barrio || "",
      })
    }
  }, [propietario, reset])

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        setErrorModalMessage("Por favor seleccione un archivo de imagen válido");
        setShowErrorModal(true);
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setErrorModalMessage("El archivo es demasiado grande. Máximo 5MB permitido.");
        setShowErrorModal(true);
        return;
      }

      setImagenFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagenPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    if (!propietario) {
      setErrorModalMessage("No se encontraron datos del usuario");
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("telefono", data.telefono)
      formData.append("email", data.email)
      formData.append("direccion", data.direccion)
      formData.append("ciudad", data.ciudad)
      formData.append("barrio", data.barrio)
      formData.append("nombre", propietario.nombre)
      formData.append("apellido", propietario.apellido)
      formData.append("tipo_documento", propietario.tipo_documento)
      formData.append("numeroid", propietario.numeroid)
      formData.append("genero", propietario.genero)
      formData.append("fecha_nacimiento", propietario.fecha_nacimiento)

      if (imagenFile) {
        formData.append("imagen", imagenFile)
      }

      const response = await fetch(`http://localhost:3001/api/propietario/${propietario.id_usuario}`, {
        method: "PUT",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setShowSuccessModal(true);
        // Guardar solo el nombre del archivo, no la ruta completa
        let foto_perfil = result.foto_perfil
        if (foto_perfil && foto_perfil.startsWith("/uploads/propietarios/")) {
          foto_perfil = foto_perfil.replace("/uploads/propietarios/", "")
        }

        const updatedUser = { ...propietario, ...data, foto_perfil }
        localStorage.setItem("pet-app-user", JSON.stringify(updatedUser))
        setPropietario(updatedUser)
        setImagenFile(null)
        setImagenPreview(null)
      } else {
        setErrorModalMessage("Error al actualizar los datos: " + (result.message || "Error desconocido"));
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error al actualizar:", error)
      setErrorModalMessage("Error de conexión al actualizar los datos. Verifique su conexión a internet.");
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false)
    }
  }
  const closeErrorModal = () => setShowErrorModal(false);

  const closeSuccessModal = () => setShowSuccessModal(false);

  if (loading) {
    return (
      <div className="update-container">
        <div className="loading-state">
          <Loader2 className="loading-spinner" size={32} />
          <p>Cargando datos del usuario...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="update-container">
        <div className="error-state">
          <AlertCircle className="error-icon" size={32} />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!propietario) {
    return (
      <div className="update-container">
        <div className="error-state">
          <AlertCircle className="error-icon" size={32} />
          <p>No se encontraron datos del usuario</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      {/* Encabezado de la página */}
      <div className="page-header">
        <div className="header-logo">
          <div className="logo-placeholder">
            <User size={30} />
          </div>
        </div>
        <div className="header-text">
          <h1 className="header-title">Clínica Veterinaria</h1>
          <h2 className="header-subtitle">Actualizar Datos del Propietario</h2>
          <p className="header-description">Actualice su información de contacto</p>
        </div>
      </div>

      <div className="content-layout">
        {/* Sección de perfil */}
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-image-section">
              <div className="image-container">
                <div className="avatar-wrapper">
                  {imagenPreview ? (
                    <img
                      src={imagenPreview || "/placeholder.svg"}
                      alt="Foto del propietario"
                      className="profile-avatar"
                    />
                  ) : propietario.foto_perfil ? (
                    <img
                      src={`http://localhost:3001/uploads/propietarios/${propietario.foto_perfil}`}
                      alt="Foto del propietario"
                      className="profile-avatar"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <User className="avatar-icon" size={40} />
                    </div>
                  )}
                  <label htmlFor="imagen-propietario" className="camera-overlay">
                    <Camera className="camera-icon" size={16} />
                  </label>
                  <input
                    type="file"
                    id="imagen-propietario"
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="file-input-hidden"
                  />
                </div>
                <span className="image-label">Foto del propietario</span>
              </div>
            </div>

            <div className="profile-info">
              <h2 className="profile-name">
                {propietario.nombre} {propietario.apellido}
              </h2>
              <div className="profile-id">{propietario.tipo_documento}: {propietario.numeroid}</div>

              <div className="profile-details">
                <div className="detail-row">
                  <User className="detail-icon" size={16} />
                  <span>{propietario.genero}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección del formulario */}
        <div className="form-section">
          <div className="form-card">
            <div className="form-header">
              <User className="form-header-icon" size={20} />
              <h3 className="form-title">Información de Contacto</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
              <div className="form-grid">
                {/* Campos de solo lectura */}
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <div className="input-container">
                    <User className="input-icon" size={16} />
                    <input
                      type="text"
                      value={propietario.nombre || ""}
                      readOnly
                      className="form-input readonly-input"
                    />
                  </div>
                  <span className="field-note">Este campo no se puede modificar</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Apellido</label>
                  <div className="input-container">
                    <User className="input-icon" size={16} />
                    <input
                      type="text"
                      value={propietario.apellido || ""}
                      readOnly
                      className="form-input readonly-input"
                    />
                  </div>
                  <span className="field-note">Este campo no se puede modificar</span>
                </div>

                {/* Campos editables */}
                <div className="form-group">
                  <label className="form-label">Teléfono *</label>
                  <div className="input-container">
                    <Phone className="input-icon" size={16} />
                    <input type="text" {...register("telefono")} className="form-input" placeholder="3101234567" />
                  </div>
                  {errors.telefono && <span className="error-text">{errors.telefono.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <div className="input-container">
                    <Mail className="input-icon" size={16} />
                    <input
                      type="email"
                      {...register("email")}
                      className="form-input"
                      placeholder="carlos@example.com"
                    />
                  </div>
                  {errors.email && <span className="error-text">{errors.email.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Ciudad</label>
                  <div className="input-container">
                    <MapPin className="input-icon" size={16} />
                    <input type="text" {...register("ciudad")} className="form-input" placeholder="soacha" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Barrio</label>
                  <div className="input-container">
                    <MapPin className="input-icon" size={16} />
                    <input type="text" {...register("barrio")} className="form-input" placeholder="Hogares Soacha" />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Dirección *</label>
                  <div className="input-container">
                    <MapPin className="input-icon" size={16} />
                    <input type="text" {...register("direccion")} className="form-input" placeholder="Calle 1 #1-1" />
                  </div>
                  {errors.direccion && <span className="error-text">{errors.direccion.message}</span>}
                </div>
              </div>

              {imagenFile && (
                <div className="file-alert">
                  <Upload className="alert-icon" size={16} />
                  <span>Nueva imagen seleccionada: {imagenFile.name}</span>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" disabled={isSubmitting} className="save-button">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="button-icon spin" size={16} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="button-icon" size={16} />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay" onClick={closeSuccessModal}>
          <div className="modal-success" onClick={e => e.stopPropagation()}>
            <div className="modal-success-content">
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>
              <h3>¡Datos actualizados correctamente!</h3>
              <p>Tu información de propietario ha sido guardada exitosamente.</p>
              <button className="btn-modal-close" onClick={closeSuccessModal}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="modal-overlay" onClick={closeErrorModal}>
          <div className="modal-error" onClick={e => e.stopPropagation()}>
            <div className="modal-error-content">
              <div className="error-icon-modal">
                <XCircle size={48} />
              </div>
              <h3>¡Ha ocurrido un error!</h3>
              <p>{errorModalMessage}</p>
              <button className="btn-modal-close" onClick={closeErrorModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
