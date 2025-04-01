import { useState } from 'react';
import '../../stylos/OlvideContrasena.css'; // Asumiendo que crearás este archivo CSS
import logo from "../../imagenes/logo.png"; // Usando el mismo logo que en Login

const OlvideContrasena = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Expresión regular para validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Aquí iría la lógica de integración con EmailJS
        // Por ejemplo:
        // await emailjs.send('service_id', 'template_id', { email }, 'user_id');
        
        // Simulando un retraso para la demostración
        setTimeout(() => {
          setIsLoading(false);
          setIsSubmitted(true);
        }, 1500);
      } catch (error) {
        setIsLoading(false);
        setErrors({ submit: 'Error al enviar el correo. Intente nuevamente.' });
      }
    }
  };

  return (
    <div className="main-container">
      {/* Contenedor principal */}
      <div className="login_container">
        
        {/* Contenedor del formulario */}
        <div className="form_area">
          <p className="title">RECUPERAR CONTRASEÑA</p>
          
          {isSubmitted ? (
            // Vista de éxito
            <div className="success-message-container">
              <div className="success-icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <p className="success-text">Se ha enviado un enlace de recuperación a tu correo electrónico.</p>
              <p className="success-instruction">Revisa tu bandeja de entrada y sigue las instrucciones.</p>
              <button 
                className="btn"
                onClick={() => window.location.href = "/login"}
              >
                VOLVER AL INICIO DE SESIÓN
              </button>
            </div>
          ) : (
            // Formulario de recuperación
            <form onSubmit={handleSubmit}>
              <div className="form_group">
                <label className="sub_title" htmlFor="email">Email</label>
                <input
                  placeholder="Ingresa tu email de registro"
                  id="email"
                  className={`form_style ${errors.email ? 'error' : ''}`}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  required
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
              
              <div className="recovery-instructions">
                <p>Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.</p>
              </div>
              
              {errors.submit && <p className="error-message server-error">{errors.submit}</p>}
              
              <div>
                <button 
                  type="submit" 
                  className="btn" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      ENVIANDO...
                    </>
                  ) : (
                    'ENVIAR INSTRUCCIONES'
                  )}
                </button>
                
                <p>
                  ¿Recordaste tu contraseña?{' '}
                  <a href="/login" className="link">
                    Iniciar sesión
                  </a>
                </p>
              </div>
            </form>
          )}
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

export default OlvideContrasena;