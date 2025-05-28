
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import "../../stylos/cssFormularios/CambioContraseña.css";
import logo from "../../imagenes/logo.png";

function CambioContraseña() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = (data) => {
    console.log("Contraseña actualizada", data)
  }

  const nuevaPassword = watch("nuevaPassword", "")

  return (
    <div className="container">
      <div className="container-contraseña">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>CAMBIO DE CONTRASEÑA</h1>

          <label>Nueva Contraseña:</label>
          <div className="password-input-container">
            <input
              type={showNewPassword ? "text" : "password"}
              {...register("nuevaPassword", {
                required: "La nueva contraseña es obligatoria",
                minLength: { value: 6, message: "Debe tener al menos 6 caracteres" },
                maxLength: { value: 30, message: "No puede tener más de 30 caracteres" },
                validate: {
                  hasUpperCase: (value) => /[A-Z]/.test(value) || "Debe contener al menos una mayúscula",
                  hasLowerCase: (value) => /[a-z]/.test(value) || "Debe contener al menos una minúscula",
                  hasNumber: (value) => /\d/.test(value) || "Debe contener al menos un número",
                  noSpaces: (value) => !/\s/.test(value) || "No se permiten espacios",
                  hasSpecialChar: (value) =>
                    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value) || "Debe contener al menos un carácter especial",
                },
              })}
            />
            <button type="button" className="toggle-password-btn" onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.nuevaPassword && <p>{errors.nuevaPassword.message}</p>}

          <label>Confirmar Nueva Contraseña:</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmarPassword", {
                required: "Debes confirmar la nueva contraseña",
                validate: (value) => value === nuevaPassword || "Las contraseñas no coinciden",
              })}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmarPassword && <p>{errors.confirmarPassword.message}</p>}

          <button type="submit">Actualizar Contraseña</button>
        </form>
      </div>

        <div className="logo-container">
                <img src={logo} alt="Logo" />
        </div>
    </div>
  )
}

export default CambioContraseña

