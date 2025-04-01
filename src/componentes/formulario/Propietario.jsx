import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import "react-datepicker/dist/react-datepicker.css"
import { registerLocale, setDefaultLocale } from "react-datepicker"
import es from "date-fns/locale/es"
import "../../stylos/Propietario.css"

// Registrar el idioma español para el calendario
registerLocale("es", es)
setDefaultLocale("es")


function Propietario() {
    const [showPassword, setShowPassword] = useState(false);
    const {
      register,
      handleSubmit,
      setValue,
      reset,
      watch,
      formState: { errors },
    } = useForm();
    const [imagePreview, setImagePreview] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);
  
    const onSubmit = (data) => {
      console.log(data);
      reset();
      setImagePreview(null);
    };
  
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          // Importante: actualizar el valor en el formulario
          setValue("imagen", file);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const openImageOptions = () => {
      if (showCamera) {
        stopCamera();
      } else {
        setShowOptions(!showOptions); // Toggle para facilitar la depuración
        console.log("Menu de opciones:", showOptions ? "cerrado" : "abierto");
      }
    };
  
    const selectFromFiles = () => {
      console.log("Intentando abrir selector de archivos");
      if (fileInputRef.current) {
        fileInputRef.current.click();
        console.log("Selector de archivos abierto");
      } else {
        console.log("Error: fileInputRef.current es null");
      }
      setShowOptions(false);
    };
  
    const startCamera = async () => {
      console.log("Intentando iniciar la cámara");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
  
        console.log("Stream de cámara obtenido:", stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata cargada, reproduciendo video");
            videoRef.current.play().catch((err) => console.error("Error al reproducir video:", err));
          };
          streamRef.current = stream;
          setShowCamera(true);
          setShowOptions(false);
          console.log("Cámara iniciada correctamente");
        } else {
          console.log("Error: videoRef.current es null");
        }
      } catch (err) {
        console.error("Error al acceder a la cámara: ", err);
        alert("No se pudo acceder a la cámara. Verifica los permisos.");
        setShowOptions(false);
      }
    };
  
    const stopCamera = () => {
      console.log("Deteniendo cámara");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setShowCamera(false);
    };
  
    const capturePhoto = () => {
      console.log("Capturando foto");
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
  
        // Configurar el canvas con las dimensiones del video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
  
        // Dibujar el frame actual del video en el canvas
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        // Convertir el canvas a una URL de datos
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
  
        // Convertir la URL de datos a un archivo Blob
        canvas.toBlob((blob) => {
          const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
          setValue("imagen", file);
          console.log("Foto capturada y guardada");
        }, "image/jpeg");
  
        // Detener la cámara
        stopCamera();
      } else {
        console.log("Error: videoRef o canvasRef es null");
      }
    };
  
    // Cerrar el menú de opciones si se hace clic fuera de él
    const handleClickOutside = (e) => {
      if (showOptions && !e.target.closest(".image-options-menu") && !e.target.closest(".image-upload-label")) {
        setShowOptions(false);
      }
    };
  
    // Agregar event listener para cerrar el menú al hacer clic fuera
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showOptions]);
  
    // Observar los valores de email y password para compararlos con los de confirmación
    const email = watch("email");
    const password = watch("password");
  
    // Registrar el input de imagen después de que el componente se monte
    useEffect(() => {
      // Registrar la imagen en el formulario
      register("imagen");
    }, [register]);

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Registro</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="image-upload-container">
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

          <div className="form-group">
            <label htmlFor="tipoRol">Tipo rol:</label>
            <select id="tipoRol" {...register("tipoRol", { required: "El tipo de rol es obligatorio" })}>
              <option value="">Seleccione un rol</option>
              <option value="A">Administrador</option>
              <option value="V">Veterinario</option>
              <option value="P">Propietario</option>
            </select>
            {errors.tipoRol && <p className="error-message">{errors.tipoRol.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="tipoDocumento">Tipo de documento:</label>
            <select
              id="tipoDocumento"
              {...register("tipoDocumento", { required: "El tipo de documento es obligatorio" })}
            >
              <option value="">Seleccione un tipo</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PP">Pasaporte</option>
            </select>
            {errors.tipoDocumento && <p className="error-message">{errors.tipoDocumento.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="numeroId">Número de documento:</label>
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
            {errors.numeroId && <p className="error-message">{errors.numeroId.message}</p>}
          </div>

          <div id="checklist">
            <input
              value="Mujer"
              type="radio"
              id="01"
              {...register("genero", { required: "El género es obligatorio" })}
            />
            <label htmlFor="01">Mujer</label>

            <input
              value="Hombre"
              type="radio"
              id="02"
              {...register("genero", { required: "El género es obligatorio" })}
            />
            <label htmlFor="02">Hombre</label>

            <input
              value="No identificado"
              type="radio"
              id="03"
              {...register("genero", { required: "El género es obligatorio" })}
            />
            <label htmlFor="03">No identificado</label>
            {errors.genero && <p className="error-message">{errors.genero.message}</p>}
          </div>

          <div className="form-group">
            <label>
              Fecha de nacimiento:
              <input
                type="date"
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
              {errors.fechaNacimiento && <p className="error-message">{errors.fechaNacimiento.message}</p>}
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
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
            {errors.telefono && <p className="error-message">{errors.telefono.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
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
            {errors.nombre && <p className="error-message">{errors.nombre.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido:</label>
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
            {errors.apellido && <p className="error-message">{errors.apellido.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "El email es obligatorio",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Formato no válido" },
              })}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmarEmail">Confirmar Email:</label>
            <input
              type="email"
              id="confirmarEmail"
              {...register("confirmarEmail", {
                required: "Debes confirmar tu email",
                validate: (value) => value === email || "Los emails no coinciden",
              })}
            />
            {errors.confirmarEmail && <p className="error-message">{errors.confirmarEmail.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 8, message: "Mínimo 8 caracteres" },
                  pattern: {
                    value: /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/,
                    message: "Debe contener mayúscula, minúscula, número y carácter especial",
                  },
                })}
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmarPassword">Confirmar Contraseña:</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmarPassword"
                {...register("confirmarPassword", {
                  required: "Debes confirmar tu contraseña",
                  validate: (value) => value === password || "Las contraseñas no coinciden",
                })}
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.confirmarPassword && <p className="error-message">{errors.confirmarPassword.message}</p>}
          </div>

          <button type="submit" className="submit-button">
            Registrar Propietario
          </button>
        </form>
      </div>
    </div>
  )
}

export default Propietario;