import { useState, useEffect } from "react";
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
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(0);
  const navigate = useNavigate();

  // Verificar bloqueo al cargar el componente
  useEffect(() => {
    const savedBlockTime = localStorage.getItem('blockTime');
    const savedAttempts = localStorage.getItem('loginAttempts');
    
    if (savedBlockTime && Date.now() < parseInt(savedBlockTime)) {
      setIsBlocked(true);
      setBlockTime(parseInt(savedBlockTime));
    }
    
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
  }, []);

  // Temporizador para desbloquear
  useEffect(() => {
    if (isBlocked) {
      const timer = setTimeout(() => {
        setIsBlocked(false);
        setAttempts(0);
        localStorage.removeItem('blockTime');
        localStorage.removeItem('loginAttempts');
      }, blockTime - Date.now());

      return () => clearTimeout(timer);
    }
  }, [isBlocked, blockTime]);

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
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "Debe contener al menos un carácter especial";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    try {
      if (isBlocked) {
        const remainingTime = Math.ceil((blockTime - Date.now()) / 1000 / 60);
        await Swal.fire({
          icon: "error",
          title: "Cuenta bloqueada",
          text: `Demasiados intentos fallidos. Intente nuevamente en ${remainingTime} minutos.`,
          confirmButtonColor: "#d33",
        });
        return;
      }

      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      // Resetear intentos si el login es exitoso
      setAttempts(0);
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('blockTime');

      await Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: response.data.message,
        confirmButtonColor: "#3085d6",
      });

      navigate("/PanelPropietario");
      setEmail("");
      setPassword("");
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());

      if (newAttempts >= 3) {
        const blockDuration = 30 * 60 * 1000; // 30 minutos en milisegundos
        const newBlockTime = Date.now() + blockDuration;
        
        setIsBlocked(true);
        setBlockTime(newBlockTime);
        localStorage.setItem('blockTime', newBlockTime.toString());

        await Swal.fire({
          icon: "error",
          title: "Cuenta bloqueada",
          text: "Demasiados intentos fallidos. Su cuenta ha sido bloqueada por 30 minutos.",
          confirmButtonColor: "#d33",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: error.response?.data?.message || 
                `Credenciales incorrectas. Intentos restantes: ${3 - newAttempts}`,
          confirmButtonColor: "#d33",
        });
      }
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
                disabled={isBlocked}
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
              <button 
                type="submit" 
                className="btn"
                disabled={isBlocked}
              >
                {isBlocked ? "CUENTA BLOQUEADA" : "INICIAR SESIÓN"}
              </button>
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