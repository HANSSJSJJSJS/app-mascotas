import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FormUsuarios = ({ usuario = null, onGuardar, onCancelar }) => {
  // Estado unificado para manejar todos los campos del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    email: '',
    rol: 'Usuario',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos cuando hay un usuario para editar
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombres: usuario.nombres || '',
        email: usuario.email || '',
        rol: usuario.rol || 'Usuario',
        password: '',
        confirmPassword: ''
      });
    }
  }, [usuario]);

  // Manejador genérico para cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error si el usuario corrige
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Nombres completos son requeridos';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }
    
    if (!usuario && !formData.password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Construimos el objeto a guardar
      const datosUsuario = {
        ...(usuario && { id: usuario.id }),
        nombres: formData.nombres,
        email: formData.email,
        rol: formData.rol
      };
      
      // Solo incluimos password si es nuevo usuario o se cambió
      if (!usuario || formData.password) {
        datosUsuario.password = formData.password;
      }
      
      await onGuardar(datosUsuario);
    } catch (error) {
      console.error('Error al guardar:', error);
      setErrors({
        submit: error.message || 'Error al guardar el usuario'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
        
        {errors.submit && (
          <div className="alert alert-danger">{errors.submit}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${errors.nombres ? 'has-error' : ''}`}>
            <label>Nombres Completos:</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
            />
            {errors.nombres && <span className="error-text">{errors.nombres}</span>}
          </div>
          
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Rol:</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
            >
              <option value="Administrador">Administrador</option>
              <option value="Veterinario">Veterinario</option>
              <option value="Usuario">Usuario</option>
            </select>
          </div>
          
          {!usuario && (
            <>
              <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <label>Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!usuario}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              
              <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
                <label>Confirmar Contraseña:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!usuario}
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>
            </>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancelar}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

FormUsuarios.propTypes = {
  usuario: PropTypes.shape({
    id: PropTypes.number,
    nombres: PropTypes.string,
    email: PropTypes.string,
    rol: PropTypes.string
  }),
  onGuardar: PropTypes.func.isRequired,
  onCancelar: PropTypes.func.isRequired
};

export default FormUsuarios;