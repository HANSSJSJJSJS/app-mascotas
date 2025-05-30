"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, Loader2, Upload, User, Phone, Mail, MapPin, FileText, Plus } from "lucide-react"
import logo from "../../imagenes/logo.png"
import "../../stylos/cssPropietario/ActualizarPropietario.css"

const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  apellido: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  telefono: z.string().min(8, { message: "El teléfono debe tener al menos 8 dígitos" }),
  email: z.string().email({ message: "Ingrese un email válido" }),
  direccion: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
  notas: z.string().optional(),
})

export default function ActualizarPropietario() {
  const [activeTab, setActiveTab] = useState("informacion")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagenPreview, setImagenPreview] = useState(null)
  const [imagenFile, setImagenFile] = useState(null)

  const propietario = JSON.parse(localStorage.getItem("userData"));

  console.log(propietario)

  const propietarioEjemplo = {
    nombre: propietario.nombre,
    apellido: propietario.apellido,
    telefono: propietario.telefono,
    email: propietario.email,
    direccion: propietario.direccion,
    notas: "Cliente desde 2020",
    mascotas: [
      {
        id: "1",
        nombre: "Max",
        especie: "Perro",
        raza: "Labrador",
        edad: 3,
        imagen: "/placeholder.svg?height=150&width=150",
      },
      {
        id: "2",
        nombre: "Luna",
        especie: "Gato",
        raza: "Siamés",
        edad: 2,
        imagen: "/placeholder.svg?height=150&width=150",
      },
    ],
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: propietarioEjemplo,
  })

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagenFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagenPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Aquí se incluiría la lógica para enviar los datos y la imagen al servidor
      await new Promise((resolve) => setTimeout(resolve, 1500))
      alert("Datos actualizados correctamente")
    } catch (error) {
      alert("Error al actualizar los datos")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-content">
      {/* Encabezado de la página */}
      <div className="page-header">
        <div className="header-logo">
          <img src={logo || "/placeholder.svg?height=60&width=60"} alt="Logo Clínica" className="logo" />
        </div>
        <div className="header-text">
          <h1 className="header-title">Clínica Veterinaria</h1>
          <h2 className="header-subtitle">Actualizar Datos del Propietario</h2>
          <p className="header-description">Actualice la información del propietario de la mascota</p>
        </div>
      </div>

      {/* Pestañas de navegación */}
      <div className="tabs-navigation">
        <button
          onClick={() => setActiveTab("informacion")}
          className={`tab-button ${activeTab === "informacion" ? "active" : ""}`}
        >
          Información Personal
        </button>
        <button
          onClick={() => setActiveTab("mascotas")}
          className={`tab-button ${activeTab === "mascotas" ? "active" : ""}`}
        >
          Mascotas Asociadas
        </button>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        {activeTab === "informacion" ? (
          <div className="info-personal-content">
            <form onSubmit={handleSubmit(onSubmit)} className="form-propietario">
              <div className="form-section profile-section">
                <div className="profile-image-wrapper">
                  {imagenPreview ? (
                    <img
                      src={imagenPreview || "/placeholder.svg"}
                      alt="Foto del propietario"
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-image-placeholder">
                      <User size={40} />
                    </div>
                  )}
                  <label htmlFor="imagen-propietario" className="upload-button">
                    <Upload className="icon" size={16} />
                    Subir imagen
                  </label>
                  <input
                    type="file"
                    id="imagen-propietario"
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="input-file"
                  />
                </div>
                <div className="profile-info">
                  <h3 className="profile-name">
                    {propietarioEjemplo.nombre} {propietarioEjemplo.apellido}
                  </h3>
                  <div className="profile-badge">
                    <span className="badge">{propietarioEjemplo.mascotas.length} mascotas</span>
                  </div>
                  <p className="profile-since">Cliente desde 2020</p>
                </div>
              </div>

              <div className="form-section data-section">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="nombre">Nombre</label>
                    <div className="input-with-icon">
                      <User className="field-icon" size={16} />
                      <input id="nombre" {...register("nombre")} />
                    </div>
                    {errors.nombre && <span className="error-message">{errors.nombre.message}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="apellido">Apellido</label>
                    <div className="input-with-icon">
                      <User className="field-icon" size={16} />
                      <input id="apellido" {...register("apellido")} />
                    </div>
                    {errors.apellido && <span className="error-message">{errors.apellido.message}</span>}
                  </div>
                </div>

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
                  <div className="form-field full-width">
                    <label htmlFor="direccion">Dirección</label>
                    <div className="input-with-icon">
                      <MapPin className="field-icon" size={16} />
                      <input id="direccion" {...register("direccion")} />
                    </div>
                    {errors.direccion && <span className="error-message">{errors.direccion.message}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field full-width">
                    <label htmlFor="notas">Notas adicionales</label>
                    <div className="input-with-icon textarea-container">
                      <FileText className="field-icon" size={16} />
                      <textarea id="notas" {...register("notas")} rows="2"></textarea>
                    </div>
                    <p className="field-hint">Información adicional relevante sobre el propietario.</p>
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
            </form>
          </div>
        ) : (
          <div className="mascotas-content">
            <h3 className="mascotas-title">
              Mascotas de {propietarioEjemplo.nombre} {propietarioEjemplo.apellido}
            </h3>

            <div className="mascotas-grid">
              {propietarioEjemplo.mascotas.map((mascota) => (
                <div key={mascota.id} className="mascota-card">
                  <div className="mascota-image-container">
                    <img src={mascota.imagen || "/placeholder.svg"} alt={mascota.nombre} className="mascota-image" />
                  </div>
                  <div className="mascota-details">
                    <h4 className="mascota-name">{mascota.nombre}</h4>
                    <p className="mascota-breed">
                      {mascota.especie} - {mascota.raza}
                    </p>
                    <p className="mascota-age">{mascota.edad} años</p>
                    <button className="details-button">Ver detalles</button>
                  </div>
                </div>
              ))}

              <div className="add-mascota-card">
                <div className="add-icon-container">
                  <Plus size={30} />
                </div>
                <p className="add-text">Agregar mascota</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
