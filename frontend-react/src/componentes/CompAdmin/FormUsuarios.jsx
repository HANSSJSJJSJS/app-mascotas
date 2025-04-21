import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FormUsuarios = ({ usuario = null, onGuardar, onCancelar }) => {
  // Simplificamos el estado - solo lo que necesitamos
  const [nombres, setNombres] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('Usuario');

  // Usamos useEffect para cargar datos cuando hay un usuario para editar
  useEffect(() => {
    if (usuario) {
      setNombres(usuario.nombres || '');
      setEmail(usuario.email || '');
      setRol(usuario.rol || 'Usuario');
    } else {
      // Reset cuando es un nuevo usuario
      setNombres('');
      setEmail('');
      setRol('Usuario');
    }
  }, [usuario]);

  // Manejadores simplificados - uno por campo
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Preparando datos para guardar');
    
    // Construimos el objeto aquí, manteniendo el ID si existe
    const datosUsuario = {
      ...(usuario && { id: usuario.id }),
      nombres,
      email,
      rol
    };
    
    console.log('Enviando datos:', datosUsuario);
    
    try {
      // Verificación explícita
      if (typeof onGuardar !== 'function') {
        throw new Error('La función onGuardar no está disponible');
      }
      
      onGuardar(datosUsuario);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('No se pudo guardar el formulario. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombres:</label>
            <input
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Rol:</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
            >
              <option value="Administrador">Administrador</option>
              <option value="Editor">Editor</option>
              <option value="Usuario">Usuario</option>
            </select>
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => {
                console.log('Cancelando');
                if (typeof onCancelar === 'function') onCancelar();
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar
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