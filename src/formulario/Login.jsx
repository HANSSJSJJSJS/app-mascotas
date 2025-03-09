import { useState } from 'react';
import '../stylos/Login.css';
import logo from "../imagenes/logo.png";

  const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');// Estado para almacenar la contraseña ingresada por el usuario
  const [errors, setErrors] = useState({});  // Estado para manejar los mensajes de error en el formulario
  const [showPassword, setShowPassword] = useState(false);  // Estado para controlar si la contraseña se muestra en texto o se oculta con asteriscos
  
  const validateForm = () => {
    const newErrors = {}; // Objeto donde guardaremos los errores detectados

    // Expresión regular para validar un correo electrónico correctamente escrito
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio'; // Si está vacío, se muestra este mensaje
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Ingrese un correo electrónico válido'; // Si el formato es incorrecto, muestra este mensaje
    }

    // Validación del campo contraseña
    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'La contraseña debe contener al menos una letra mayúscula';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'La contraseña debe contener al menos un número';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = 'La contraseña debe contener al menos un carácter especial';
    }
    

    // Guardamos los errores en el estado
    setErrors(newErrors);

    // Retornamos `true` si no hay errores, `false` si hay errores
    return Object.keys(newErrors).length === 0;
  };

  // Función que se ejecuta cuando el usuario envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Si el formulario pasa las validaciones, se muestra un mensaje en la consola
    if (validateForm()) {
      console.log('Login successful', { email, password });
    }
  };

  // Función que cambia la visibilidad de la contraseña (mostrar/ocultar)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Retornamos el JSX del formulario
  return (
    <div className="main-container">
      {/* Contenedor principal del login */}
      <div className="login_container">

        {/* Contenedor del encabezado (puede ser para logo o título) */}
        <div id="header-container"></div>

        {/* Contenedor del formulario */}
        <div className="form_area">
          <p className="title">INICIAR SESIÓN</p>

          {/* Formulario de inicio de sesión */}
          <form onSubmit={handleSubmit}>

            {/* Grupo del campo Email */}
            <div className="form_group">
              <label className="sub_title" htmlFor="email">Email</label>
              <input
                placeholder="Ingresa tu email" // Texto dentro del input
                id="email"
                className={`form_style ${errors.email ? 'error' : ''}`} // Agrega clase 'error' si hay un error
                type="email"
                value={email} // Enlaza con el estado 'email'
                onChange={(e) => {
                  setEmail(e.target.value); // Actualiza el estado con el valor ingresado
                  setErrors(prev => ({ ...prev, email: '' })); // Borra el error si el usuario modifica el campo
                }}
                required // Hace que el campo sea obligatorio
              />
              {/* Si hay error en email, lo mostramos en un párrafo */}
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            {/* Grupo del campo Contraseña */}
            <div className="form_group">
              <label className="sub_title" htmlFor="password">Contraseña</label>

              {/* Contenedor de la contraseña con botón para mostrar/ocultar */}
              <div className="password-input-container">
                <input
                  placeholder="Ingresa tu contraseña"
                  id="password"
                  className={`form_style ${errors.password ? 'error' : ''}`} // Aplica clase 'error' si hay errores
                  type={showPassword ? "text" : "password"} // Alterna entre 'text' y 'password'
                  value={password} // Enlaza con el estado 'password'
                  onChange={(e) => {
                    setPassword(e.target.value); // Actualiza el estado con la contraseña ingresada
                    setErrors(prev => ({ ...prev, password: '' })); // Borra el error si el usuario modifica el campo
                  }}
                  required // Campo obligatorio
                />
                {/* Botón para mostrar/ocultar contraseña */}
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                </button>
              </div>

              {/* Si hay error en la contraseña, lo mostramos en un párrafo */}
              {errors.password && <p className="error-message">{errors.password}</p>}

              {/* Enlace para recuperar contraseña */}
              <a href="/forgot-password" className="forgot-password-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón de enviar formulario */}
            <div>
              <button type="submit" className="btn">INICIAR SESIÓN</button>

              {/* Enlace para registrarse */}
              <p>
                ¿No tienes una cuenta?{' '}
                <a href="/register" className="link">
                  Regístrate aquí
                </a>
              </p>
            </div>

          </form>
        </div>

        {/* Contenedor del logo */}
        <div className="logo-container">
          <img 
            className="logo-image" 
            src={logo} 
            alt="Logo"
          />
          
        </div>

      </div>
    </div>
  );
};

// Exportamos el componente para usarlo en otras partes de la app
export default Login;