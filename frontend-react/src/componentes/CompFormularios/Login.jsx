import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import '../../stylos/cssFormularios/Login.css';
import logo from "../../imagenes/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Ingrese un correo electrónico válido";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Debe contener al menos una letra mayúscula";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Debe contener al menos un número";
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      newErrors.password = "Debe contener al menos un carácter especial";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      await Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: response.data.message,
        confirmButtonColor: "#3085d6",
      });

      // Redirigir al home después del mensaje de éxito
      navigate("/PanelPropietario");

      // Limpiar campos
      setEmail("");
      setPassword("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: error.response?.data?.message || "Ocurrió un error en el servidor",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <div className="main-container">
      <div className="login_container">
        <div id="header-container"></div>

        <div className="form_area">
          <p className="title">INICIAR SESIÓN</p>
          <form onSubmit={handleSubmit}>
            <div className="form_group">
              <label className="sub_title" htmlFor="email">Email</label>
              <input
                placeholder="Ingresa tu email"
                id="email"
                className={`form_style ${errors.email ? "error" : ""}`}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form_group">
              <label className="sub_title" htmlFor="password">Contraseña</label>
              <div className="password-input-container">
                <input
                  placeholder="Ingresa tu contraseña"
                  id="password"
                  className={`form_style ${errors.password ? "error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
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
              <button type="submit" className="btn">INICIAR SESIÓN</button>
              <p>
                ¿No tienes una cuenta?{' '}
                <a href="/Propietario" className="link">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </form>
        </div>

        <div className="logo-container">
          <img className="logo-image" src={logo} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default Login;