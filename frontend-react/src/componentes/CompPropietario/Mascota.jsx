import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FileText, Calendar, Weight, Camera, Upload, X, Heart, Shield, PawPrint } from "lucide-react";
import "../../stylos/cssPropietario/Mascota.css";

// Componente de imagen optimizado
const PetImage = ({ foto, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(getImageUrl(foto));
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setImgSrc(getImageUrl(foto));
    setRetryCount(0);
  }, [foto]);

  const handleError = () => {
    if (retryCount < 2) {
      setImgSrc(`${getImageUrl(foto)}?t=${Date.now()}`);
      setRetryCount(retryCount + 1);
    } else {
      setImgSrc("/placeholder.svg");
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

// Función para obtener URLs de imágenes con cache busting
const getImageUrl = (foto) => {
  if (!foto || foto === "default.jpg") {
    return "/placeholder.svg";
  }
  
  const baseUrl = "http://localhost:3001";
  const timestamp = Date.now();
  
  if (foto.startsWith('http')) {
    return `${foto}?t=${timestamp}`;
  }
  
  if (foto.startsWith('/uploads/')) {
    return `${baseUrl}${foto}?t=${timestamp}`;
  }
  
  return `${baseUrl}/uploads/mascotas/${foto}?t=${timestamp}`;
};

export default function Mascota() {
  const [mascotas, setMascotas] = useState([])
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null)
  const [showHistorial, setShowHistorial] = useState(false)
  const [showFotoModal, setShowFotoModal] = useState(false)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [isUploadingFoto, setIsUploadingFoto] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const fileInputRef = useRef(null)

  // Cargar mascotas reales del backend
  const fetchMascotas = async (selectLast = false) => {
    try {
      const usuarioActual = JSON.parse(localStorage.getItem("pet-app-user"))
      if (!usuarioActual?.id_usuario) return
      const res = await axios.get(`http://localhost:3001/api/mascotas/${usuarioActual.id_usuario}`)
      setMascotas(res.data)
      if (res.data.length > 0) {
        setMascotaSeleccionada(selectLast ? res.data[res.data.length - 1].id : res.data[0].id)
      }
    } catch (error) {
      setMascotas([])
    }
  }
  useEffect(() => {
    fetchMascotas()
  }, [])

  // Escuchar evento de registro de nueva mascota (custom event)
  useEffect(() => {
    const handleNuevaMascota = () => {
      fetchMascotas(true) // Selecciona la última mascota (la recién creada)
    }
    window.addEventListener("mascota-registrada", handleNuevaMascota)
    return () => window.removeEventListener("mascota-registrada", handleNuevaMascota)
  }, [])

  const mascotaActual = mascotas.find((m) => m.id === mascotaSeleccionada) || {};

  // Evita errores si historial_medico es undefined
  const historialMedico = Array.isArray(mascotaActual.historial_medico) ? mascotaActual.historial_medico : [];

  const formatearFecha = (fecha) => {
    if (!fecha) return "-"
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calcularEdadDetallada = (edad, fecha_nacimiento) => {
    if (fecha_nacimiento) {
      const hoy = new Date()
      const nacimiento = new Date(fecha_nacimiento)
      const diffTime = Math.abs(hoy - nacimiento)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const years = Math.floor(diffDays / 365)
      const months = Math.floor((diffDays % 365) / 30)
      if (years > 0) {
        return `${years} año${years > 1 ? "s" : ""} ${months > 0 ? `y ${months} mes${months > 1 ? "es" : ""}` : ""}`
      } else {
        return `${months} mes${months > 1 ? "es" : ""}`
      }
    }
    return `${edad || "-"} años`
  }

  // (Eliminada la definición duplicada de getImageUrl, solo queda la versión superior junto a PetImage)

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFotoUpload = async () => {
    if (!fileInputRef.current || !fileInputRef.current.files[0]) return;

    setIsUploadingFoto(true);
    try {
      const formData = new FormData();
      formData.append("foto", fileInputRef.current.files[0]);

      // Sube la foto al backend
      const response = await axios.put(
        `http://localhost:3001/api/mascotas/${mascotaSeleccionada}/foto`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Actualiza el estado local con la nueva foto
      setMascotas(prevMascotas => {
        const updated = prevMascotas.map(mascota =>
          mascota.id === mascotaSeleccionada
            ? { ...mascota, foto: response.data.foto }
            : mascota
        );
        // Debug: mostrar el estado actualizado
        console.log("Mascotas tras la subida de foto:", updated);
        console.log("Foto antes:", prevMascotas.find(m => m.id === mascotaSeleccionada)?.foto);
        console.log("Foto después:", response.data.foto);
        return updated;
      });

      setShowFotoModal(false);
      setFotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al subir foto:", error);
      setErrorModalMessage(error.response?.data?.message || "Error al actualizar la foto");
      setShowErrorModal(true);
    } finally {
      setIsUploadingFoto(false);
    }
  }

  const cancelarFoto = () => {
    setShowFotoModal(false)
    setFotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const closeSuccessModal = () => setShowSuccessModal(false);
  const closeErrorModal = () => setShowErrorModal(false);

  return (
    <div className="mascota-layout-container">
      {/* Header integrado con el layout existente */}
      <div className="mascota-header-integrado">
        <div className="header-content-integrado">
          <div className="clinic-branding">
            <div className="clinic-logo-container">
              <div className="clinic-logo-circle">
                <PawPrint color="#c2d8ff" size={40} />
              </div>
              <div className="clinic-info-text">
                <h1 className="clinic-name-integrado">Clínica veterinaria</h1>
                <p className="clinic-subtitle-integrado">Información de tu mascota</p>
              </div>
            </div>
          </div>

          <div className="mascota-selector-container">
            <label className="selector-label-integrado">Mis Mascotas</label>
            <select
              value={mascotaSeleccionada || ""}
              onChange={(e) => setMascotaSeleccionada(Number(e.target.value))}
              className="mascota-selector-integrado"
            >
              {mascotas.map((mascota) => (
                <option key={mascota.id} value={mascota.id}>
                  {mascota.nombre} - {mascota.tipo} ({mascota.raza})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contenido principal con mejor integración */}
      <div className="mascota-main-content">
        {/* Perfil de la mascota */}
        {mascotaActual && mascotaActual.id ? (
          <div className="mascota-profile-section">
            <div className="profile-header-section">
              <div className="pet-photo-info">
                <div className="pet-photo-container">
                  <PetImage
                    foto={mascotaActual.foto}
                    alt={mascotaActual.nombre}
                    className="pet-photo-main"
                  />
                  <button onClick={() => setShowFotoModal(true)} className="photo-edit-button" title="Cambiar foto">
                    <Camera className="camera-icon-main" />
                  </button>
                </div>

                <div className="pet-info-main">
                  <h2 className="pet-name-main">{mascotaActual.nombre}</h2>
                  <div className="pet-badges-container-mascota">
                    <span className={`badge-main-mascota ${mascotaActual.tipo?.toLowerCase()}`}>
                      {mascotaActual.tipo?.toUpperCase()}
                    </span>
                    <span className="badge-secondary-mascota">{mascotaActual.raza}</span>
                    {mascotaActual.vacunado && (
                      <span className="pet-badge-mascota vaccinated-badge-mascota" title="Vacunado">
                        <Shield size={14} className="badge-icon-mascota" />
                        Vacunado
                      </span>
                    )}
                    {mascotaActual.esterilizado && (
                      <span className="pet-badge-mascota neutered-badge-mascota" title="Esterilizado">
                        <Heart size={14} className="badge-icon-mascota" />
                        Esterilizado
                      </span>
                    )}
                  </div>
                  <p className="pet-description-main">
                    {mascotaActual.genero} • {calcularEdadDetallada(mascotaActual.edad, mascotaActual.fecha_nacimiento)} • {mascotaActual.peso} kg
                  </p>
                </div>
              </div>

              <button onClick={() => setShowHistorial(true)} className="historial-button-main">
                <FileText className="historial-icon" />
                <span className="historial-text">Historial Médico</span>
                <span className="historial-badge">{Array.isArray(historialMedico) ? historialMedico.length : 0}</span>
              </button>
            </div>

            {/* Stats mejoradas */}
            <div className="stats-grid-main">
              <div className="stat-card-main edad-card">
                <div className="stat-icon-wrapper">
                  <Calendar className="stat-icon-main" />
                </div>
                <div className="stat-content-main">
                  <span className="stat-number-main">{mascotaActual.edad}</span>
                  <span className="stat-label-main">Años de edad</span>
                  <span className="stat-detail-main">
                    Nacido el {formatearFecha(mascotaActual.fecha_nacimiento).split(" de ")[0]} de{" "}
                    {formatearFecha(mascotaActual.fecha_nacimiento).split(" de ")[1]}
                  </span>
                </div>
              </div>

              <div className="stat-card-main peso-card">
                <div className="stat-icon-wrapper">
                  <Weight className="stat-icon-main" />
                </div>
                <div className="stat-content-main">
                  <span className="stat-number-main">{mascotaActual.peso}</span>
                  <span className="stat-label-main">Kilogramos</span>
                  <span className="stat-detail-main">Peso actual</span>
                </div>
              </div>

              <div className="stat-card-main consultas-card">
                <div className="stat-icon-wrapper">
                  <Heart className="stat-icon-main" />
                </div>
                <div className="stat-content-main">
                  <span className="stat-number-main">{historialMedico.length}</span>
                  <span className="stat-label-main">Consultas</span>
                  <span className="stat-detail-main">Historial médico</span>
                </div>
              </div>
            </div>

            {/* Información detallada */}
            <div className="details-grid-main">
              <div className="detail-card-main">
                <h4 className="detail-title-main">Información Básica</h4>
                <div className="detail-content-main">
                  <div className="detail-item-main">
                    <span className="detail-key-main">Color:</span>
                    <span className="detail-value-main">{mascotaActual.color}</span>
                  </div>
                  <div className="detail-item-main">
                    <span className="detail-key-main">Género:</span>
                    <span className="detail-value-main">{mascotaActual.genero}</span>
                  </div>
                  <div className="detail-item-main">
                    <span className="detail-key-main">Microchip:</span>
                    <span className="detail-value-main microchip-main">{mascotaActual.microchip}</span>
                  </div>
                </div>
              </div>

              <div className="detail-card-main">
                <h4 className="detail-title-main">Información Médica</h4>
                <div className="detail-content-main">
                  <div className="detail-item-main">
                    <span className="detail-key-main">Alergias:</span>
                    <span className="detail-value-main">{mascotaActual.alergias}</span>
                  </div>
                  <div className="detail-item-main">
                    <span className="detail-key-main">Condiciones:</span>
                    <span className="detail-value-main">{mascotaActual.condiciones_especiales}</span>
                  </div>
                  <div className="detail-item-main full-width-item">
                    <span className="detail-key-main">Notas:</span>
                    <span className="detail-value-main">{mascotaActual.notas}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-mascota-msg">No tienes mascotas registradas.</div>
        )}

        {/* Modales */}
        {showFotoModal && (
          <div className="modal-overlay-main" onClick={cancelarFoto}>
            <div className="foto-modal-main" onClick={(e) => e.stopPropagation()}>
              <div className="foto-modal-header-main">
                <h3 className="foto-modal-title-main">
                  <Camera className="modal-icon-main" />
                  Cambiar Foto de {mascotaActual.nom_mas}
                </h3>
                <button onClick={cancelarFoto} className="modal-close-button">
                  <X className="close-icon-main" />
                </button>
              </div>

              <div className="foto-modal-body-main">
                <div className="foto-preview-container">
                  <img
                    src={fotoPreview || getImageUrl(mascotaActual.foto)}
                    alt="Preview"
                    className="preview-image-main"
                    onError={e => {
                      e.target.src = "/placeholder.svg";
                      e.target.onerror = null;
                    }}
                  />
                </div>

                <div className="foto-upload-container">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFotoChange}
                    accept="image/*"
                    className="file-input-hidden-main"
                  />
                  <button onClick={() => fileInputRef.current?.click()} className="upload-button-main">
                    <Upload className="upload-icon-main" />
                    Seleccionar Nueva Foto
                  </button>
                </div>

                <div className="foto-modal-actions-main">
                  <button onClick={cancelarFoto} className="cancel-button-main">
                    Cancelar
                  </button>
                  <button
                    onClick={handleFotoUpload}
                    disabled={!fotoPreview || isUploadingFoto}
                    className="save-button-main"
                  >
                    {isUploadingFoto ? "Guardando..." : "Guardar Foto"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showHistorial && (
          <div className="modal-overlay-main" onClick={() => setShowHistorial(false)}>
            <div className="historial-modal-main" onClick={(e) => e.stopPropagation()}>
              <div className="historial-modal-header-main">
                <h3 className="historial-modal-title-main">
                  <FileText className="modal-icon-main" />
                  Historial Médico - {mascotaActual.nom_mas}
                </h3>
                <button onClick={() => setShowHistorial(false)} className="modal-close-button">
                  <X className="close-icon-main" />
                </button>
              </div>

              <div className="historial-modal-body-main">
                {Array.isArray(historialMedico) && historialMedico.length > 0 ? (
                  historialMedico.map((registro, index) => (
                    <div key={index} className="historial-item-main">
                      <div className="historial-item-header">
                        <div className="historial-item-info">
                            <span className={`tipo-badge-main ${registro.tipo?.toLowerCase?.() || ''}`}>{registro.tipo}</span>
                          <h4 className="historial-item-title">{registro.descrip_his}</h4>
                        </div>
                        <span className="historial-item-date">{formatearFecha(registro.fech_his)}</span>
                      </div>
                      <p className="historial-item-vet">
                        <strong>Veterinario:</strong> {registro.veterinario}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="no-historial-msg">No hay historial médico disponible.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modales de éxito y error para la foto */}
      {showSuccessModal && (
        <div className="modal-overlay-main" onClick={closeSuccessModal}>
          <div className="modal-success-main" onClick={e => e.stopPropagation()}>
            <div className="modal-success-content-main">
              <div className="success-icon-main">
                <Upload size={48} />
              </div>
              <h3>¡Foto actualizada correctamente!</h3>
              <p>La foto de tu mascota se ha actualizado con éxito.</p>
              <button className="btn-modal-close-main" onClick={closeSuccessModal}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="modal-overlay-main" onClick={closeErrorModal}>
          <div className="modal-error-main" onClick={e => e.stopPropagation()}>
            <div className="modal-error-content-main">
              <div className="error-icon-main">
                <X size={48} />
              </div>
              <h3>¡Error!</h3>
              <p>{errorModalMessage}</p>
              <button className="btn-modal-close-main" onClick={closeErrorModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
