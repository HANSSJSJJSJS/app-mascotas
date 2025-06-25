"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, Loader2, Upload, User, Phone, Mail, MapPin, FileText, AlertCircle } from "lucide-react"
import "../../stylos/cssPropietario/ActualizarPropietario.css"
import { apiService } from "../../services/apiService"

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
        alert("Por favor seleccione un archivo de imagen válido")
        return
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 5MB permitido.")
        return
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
      alert("No se encontraron datos del usuario")
      return
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
        alert("Datos actualizados correctamente")
        const updatedUser = { ...propietario, ...data, foto_perfil: result.foto_perfil }
        localStorage.setItem("pet-app-user", JSON.stringify(updatedUser))
        setPropietario(updatedUser)
        setImagenFile(null)
        setImagenPreview(null)
      } else {
        alert("Error al actualizar los datos: " + (result.message || "Error desconocido"))
      }
    } catch (error) {
      console.error("Error al actualizar:", error)
      alert("Error de conexión al actualizar los datos. Verifique su conexión a internet.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-container">
          <Loader2 className="icon-spin" size={32} />
          <p>Cargando datos del usuario...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="error-container">
          <AlertCircle size={32} />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!propietario) {
    return (
      <div className="page-content">
        <div className="error-container">
          <AlertCircle size={32} />
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

      {/* Contenido principal */}
      <div className="main-content">
        <div className="info-personal-content">
          <form onSubmit={handleSubmit(onSubmit)} className="form-propietario">
            <div className="form-propietario-compact">
              <div className="profile-section-compact">
                <div className="profile-image-wrapper-compact">
                  {imagenPreview ? (
                    <img
                      src={imagenPreview || "/placeholder.svg"}
                      alt="Foto del propietario"
                      className="profile-image-small"
                    />
                  ) : propietario.foto ? (
                    <img
                      src={`http://localhost:3001/uploads/propietarios/${propietario.foto_perfil}`}
                      alt="Foto del propietario"
                      className="profile-image-small"
                    />
                  ) : (
                    <div className="profile-image-placeholder-small">
                      <User size={24} />
                    </div>
                  )}
                  <label htmlFor="imagen-propietario" className="upload-button-small">
                    <Upload className="icon" size={14} />
                    {imagenFile ? "Cambiar" : "Subir"}
                  </label>
                  <input
                    type="file"
                    id="imagen-propietario"
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="input-file"
                  />
                </div>
                <div className="profile-info-compact">
                  <h3 className="profile-name-compact">
                    {propietario.nombre} {propietario.apellido}
                  </h3>
                </div>
              </div>

              <div className="data-section-compact">
                {/* Campos de solo lectura para nombre y apellido */}
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="nombre">Nombre</label>
                    <div className="input-with-icon">
                      <User className="field-icon" size={16} />
                      <input id="nombre" value={propietario.nombre || ""} readOnly className="readonly-input" />
                    </div>
                    <p className="field-hint">Este campo no se puede modificar</p>
                  </div>

                  <div className="form-field">
                    <label htmlFor="apellido">Apellido</label>
                    <div className="input-with-icon">
                      <User className="field-icon" size={16} />
                      <input id="apellido" value={propietario.apellido || ""} readOnly className="readonly-input" />
                    </div>
                    <p className="field-hint">Este campo no se puede modificar</p>
                  </div>
                </div>

                {/* Campos editables */}
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="telefono">Teléfono</label>
                    <div className="input-with-icon">
                      <Phone className="field-icon" size={16} />
                      <input id="telefono" {...register("telefono")} />
                    </div>
                    {errors.telefono && <span className="error-message">{errors.telefono.message}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <div className="input-with-icon">
                      <Mail className="field-icon" size={16} />
                      <input id="email" type="email" {...register("email")} />
                    </div>
                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="ciudad">Ciudad</label>
                    <div className="input-with-icon">
                      <MapPin className="field-icon" size={16} />
                      <input id="ciudad" {...register("ciudad")} />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="barrio">Barrio</label>
                    <div className="input-with-icon">
                      <MapPin className="field-icon" size={16} />
                      <input id="barrio" {...register("barrio")} />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field full-width">
                    <label htmlFor="direccion">Dirección</label>
                    <div className="input-with-icon">
                      <MapPin className="field-icon" size={16} />
                      <input id="direccion" {...register("direccion")} />
                    </div>
                    {errors.direccion && <span className="error-message">{errors.direccion.message}</span>}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-button" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="icon-spin" size={16} />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
