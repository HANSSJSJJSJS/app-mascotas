"use client"

import "bootstrap-icons/font/bootstrap-icons.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import "../../stylos/cssFormularios/Login.css"
import logo from "../../imagenes/logo.png"
import { useAuth } from "../../context/AuthContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [rol, setRol] = useState("")
  const [isBlocked, setIsBlocked] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)

  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const blockedEmails = JSON.parse(localStorage.getItem("blockedEmails")) || {}
    const currentEmailBlock = blockedEmails[email]

    if (currentEmailBlock && Date.now() < currentEmailBlock.blockTime) {
      setIsBlocked(true)
      const timeLeft = Math.min(30, Math.ceil((currentEmailBlock.blockTime - Date.now()) / 1000))
      setRemainingTime(timeLeft)
    } else {
      setIsBlocked(false)
    }
  }, [email])

  useEffect(() => {
    let interval
    if (isBlocked && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1)
      }, 1000)
    } else if (remainingTime === 0 && isBlocked) {
      setIsBlocked(false)
      const blockedEmails = JSON.parse(localStorage.getItem("blockedEmails")) || {}
      delete blockedEmails[email]
      localStorage.setItem("blockedEmails", JSON.stringify(blockedEmails))
    }
    return () => clearInterval(interval)
  }, [isBlocked, remainingTime, email])

  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Ingrese un correo electrónico válido"
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Debe contener al menos una letra mayúscula"
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Debe contener al menos un número"
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "Debe contener al menos un carácter especial"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async () => {
    try {
      if (isBlocked) {
        await Swal.fire({
          icon: "error",
          title: "Cuenta bloqueada",
          text: `Demasiados intentos fallidos. Intente nuevamente en ${remainingTime} segundos.`,
          confirmButtonColor: "#d33",
        })
        return
      }

      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      })

      const blockedEmails = JSON.parse(localStorage.getItem("blockedEmails")) || {}
      delete blockedEmails[email]
      localStorage.setItem("blockedEmails", JSON.stringify(blockedEmails))

      await Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: response.data.message,
        confirmButtonColor: "#3085d6",
      })

      const { user } = response.data

      if (user) {
        login(user)
      }

      if (user && user.id_rol === 1) {
        navigate(`/admin/dashboard?id=${user.id_usuario}`);
      } else if (user && user.id_rol === 2) {
        navigate("/PanelVet")
      } else if (user && user.id_rol === 3) {
        navigate("/PanelPropietario")
      } else {
        console.error("Rol no reconocido:", user?.id_rol)
        navigate("/")
      }

      setEmail("")
      setPassword("")
    } catch (error) {
      const blockedEmails = JSON.parse(localStorage.getItem("blockedEmails")) || {}
      const currentAttempts = blockedEmails[email]?.attempts || 0
      const newAttempts = currentAttempts + 1

      if (newAttempts >= 3) {
        const blockDuration = 30 * 1000
        const newBlockTime = Date.now() + blockDuration
        blockedEmails[email] = {
          attempts: newAttempts,
          blockTime: newBlockTime,
        }

        localStorage.setItem("blockedEmails", JSON.stringify(blockedEmails))
        setIsBlocked(true)
        setRemainingTime(30)

        await Swal.fire({
          icon: "error",
          title: "Cuenta bloqueada",
          text: `Demasiados intentos fallidos. Su cuenta ha sido bloqueada por 30 segundos.`,
          confirmButtonColor: "#d33",
        })
      } else {
        blockedEmails[email] = {
          attempts: newAttempts,
          blockTime: blockedEmails[email]?.blockTime || 0,
        }
        localStorage.setItem("blockedEmails", JSON.stringify(blockedEmails))

        await Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: error.response?.data?.message || `Credenciales incorrectas. Intentos restantes: ${3 - newAttempts}`,
          confirmButtonColor: "#d33",
        })
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit()
    }
  }

  // Funciones para descargar manuales
const downloadTechnicalManual = () => {
  const link = document.createElement("a")
  link.href = "/manuales/manual-tecnico.pdf"
  link.download = "Manual_Tecnico.pdf"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadUserManual = () => {
  const link = document.createElement("a")
  link.href = "/manuales/manual-usuario.pdf"
  link.download = "Manual_Usuario.pdf"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

  return (
    <div className="main-container">
      <div className="login_container">
        <div id="header-container"></div>

        <div className="form_area">
          <p className="title">INICIAR SESIÓN</p>
          <form onSubmit={handleSubmit}>
            <div className="form_group">
              <label className="sub_title" htmlFor="email">
                Email
              </label>
              <input
                placeholder="Ingresa tu email"
                id="email"
                className={`form_style ${errors.email ? "error" : ""}`}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrors((prev) => ({ ...prev, email: "" }))
                }}
                required
                disabled={isBlocked}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form_group">
              <label className="sub_title" htmlFor="password">
                Contraseña
              </label>
              <div className="password-input-container">
                <input
                  placeholder="Ingresa tu contraseña"
                  id="password"
                  className={`form_style ${errors.password ? "error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, password: "" }))
                  }}
                  required
                  disabled={isBlocked}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                </button>
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
              <a href="/OlvideContrasena" className="forgot-password-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <div>
              <button type="submit" className="btn" disabled={isBlocked}>
                {isBlocked ? `CUENTA BLOQUEADA (${remainingTime}s)` : "INICIAR SESIÓN"}
              </button>
              <p>
                ¿No tienes una cuenta?{" "}
                <a href="/Propietario" className="link">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </form>
        </div>

        <div className="logo-container">
          <img className="logo-image" src={logo || "/placeholder.svg"} alt="Logo" />
        </div>
      </div>
    </div>
  )
}

export default Login
