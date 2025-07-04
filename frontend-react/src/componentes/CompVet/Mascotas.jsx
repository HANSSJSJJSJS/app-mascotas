import React, { useState, useEffect } from 'react';
import "../../stylos/cssVet/Mascotas.css";
import axios from "axios";
import MascotaForm from '../CompFormularios/MascotaForm';

const GestorMascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mascotaEditando, setMascotaEditando] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar mascotas al montar el componente
  useEffect(() => {
    const cargarMascotas = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/mascotas');
        if (!response.ok) throw new Error('Error al cargar mascotas');
        
        const data = await response.json();
        // Normaliza el id para cualquier respuesta (id o cod_mas)
        const mascotasTransformadas = data.map(mascota => ({
          id: mascota.id || mascota.cod_mas,
          nombre: mascota.nombre || mascota.nom_mas,
          tipo: mascota.tipo || mascota.especie,
          raza: mascota.raza,
          edad: mascota.edad,
          genero: mascota.genero,
          peso: mascota.peso,
          idPropietario: mascota.id_pro,
          color: mascota.color,
          notas: mascota.notas,
          ultimaVisita: mascota.ultima_visita,
          proximaCita: mascota.proxima_cita,
          vacunado: mascota.vacunado,
          esterilizado: mascota.esterilizado,
          activo: mascota.activo,
          dueño: (mascota.nombre_propietario || mascota.nombrePropietario) ? 
            `${mascota.nombre_propietario || mascota.nombrePropietario} ${mascota.apellido_propietario || mascota.apellidoPropietario}` : 'Sin dueño',
          telefono: mascota.telefono,
          email: mascota.email,
          direccion: mascota.direccion
        }));
        
        setMascotas(mascotasTransformadas);
      } catch (error) {
        console.error("Error al cargar mascotas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarMascotas();
  }, []);

  // Filtrar mascotas
  const mascotasFiltradas = mascotas.filter(mascota => {
    return (
      mascota.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      (mascota.dueño && mascota.dueño.toLowerCase().includes(terminoBusqueda.toLowerCase())) ||
      (mascota.raza && mascota.raza.toLowerCase().includes(terminoBusqueda.toLowerCase()))
    );
  });

  // Estadísticas
  const totalMascotas = mascotas.length;
  const totalPerros = mascotas.filter(m => m.tipo === 'Perro').length;
  const totalGatos = mascotas.filter(m => m.tipo === 'Gato').length;
  const totalActivos = mascotas.filter(m => m.activo).length;
  const totalInactivos = mascotas.filter(m => !m.activo).length;

  // Manejar agregar mascota
  const handleAgregarMascota = async (nuevaMascota) => {
    try {
      const usuarioActual = JSON.parse(localStorage.getItem("userData"));
      if (!usuarioActual?.id_usuario) throw new Error("No se encontró información del usuario.");

      const response = await fetch('http://localhost:3001/api/mascotas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom_mas: nuevaMascota.nombre,
          especie: nuevaMascota.especie,
          raza: nuevaMascota.raza,
          edad: nuevaMascota.edad,
          genero: nuevaMascota.genero,
          peso: nuevaMascota.peso,
          color: nuevaMascota.color,
          notas: nuevaMascota.observaciones,
          vacunado: nuevaMascota.vacunado,
          esterilizado: nuevaMascota.esterilizado,
          id_pro: usuarioActual.id_usuario
        })
      });

      if (!response.ok) throw new Error('Error al agregar mascota');

      const data = await response.json();
      setMascotas([...mascotas, {
        id: data.id,
        nombre: data.nom_mas,
        tipo: data.especie,
        raza: data.raza,
        edad: data.edad,
        genero: data.genero,
        peso: data.peso,
        color: data.color,
        notas: data.notas,
        vacunado: data.vacunado,
        esterilizado: data.esterilizado,
        activo: true,
        dueño: usuarioActual.nombre ? 
          `${usuarioActual.nombre} ${usuarioActual.apellido}` : 'Tú'
      }]);
      
      setMostrarModalAgregar(false);
      return true;
    } catch (error) {
      console.error("Error al agregar mascota:", error);
      return false;
    }
  };

  // Manejar editar mascota
  const handleEditarMascota = async (mascotaActualizada) => {
    try {
      const response = await fetch(`http://localhost:3001/api/mascotas/${mascotaEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom_mas: mascotaActualizada.nombre,
          especie: mascotaActualizada.especie,
          raza: mascotaActualizada.raza,
          edad: mascotaActualizada.edad,
          genero: mascotaActualizada.genero,
          peso: mascotaActualizada.peso,
          color: mascotaActualizada.color,
          notas: mascotaActualizada.observaciones,
          vacunado: mascotaActualizada.vacunado,
          esterilizado: mascotaActualizada.esterilizado
        })
      });

      if (!response.ok) throw new Error('Error al actualizar mascota');

      setMascotas(mascotas.map(m => 
        m.id === mascotaEditando.id ? {
          ...m,
          nombre: mascotaActualizada.nombre,
          tipo: mascotaActualizada.especie,
          raza: mascotaActualizada.raza,
          edad: mascotaActualizada.edad,
          genero: mascotaActualizada.genero,
          peso: mascotaActualizada.peso,
          color: mascotaActualizada.color,
          notas: mascotaActualizada.observaciones,
          vacunado: mascotaActualizada.vacunado,
          esterilizado: mascotaActualizada.esterilizado
        } : m
      ));
      
      setMascotaEditando(null);
      return true;
    } catch (error) {
      console.error("Error al editar mascota:", error);
      return false;
    }
  };

  // Eliminar mascota
  const eliminarMascota = async (idMascota) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/mascotas/${idMascota}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar mascota');

        setMascotas(mascotas.filter(m => m.id !== idMascota));
        alert('Mascota eliminada exitosamente');
      } catch (error) {
        console.error("Error:", error);
        alert('Error al eliminar la mascota: ' + error.message);
      }
    }
  };

  // Cambiar estado de mascota
  const cambiarEstadoMascota = async (id, nuevoEstado) => {
  try {
    // Actualización optimista (cambia el estado antes de la respuesta del servidor)
    setMascotas(prev => prev.map(m => 
      m.id === id ? { ...m, activo: nuevoEstado } : m
    ));

    const response = await axios.patch(
      `http://localhost:3001/api/mascotas/${id}/estado`,
      { activo: nuevoEstado },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
        }
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Error al actualizar el estado");
    }

    console.log("Estado actualizado:", response.data);

  } catch (error) {
    console.error("Error al cambiar estado:", error);
    
    // Revertir el cambio si falla
    setMascotas(prev => prev.map(m => 
      m.id === id ? { ...m, activo: !nuevoEstado } : m
    ));

    // Mostrar error al usuario
    alert(error.response?.data?.error || 
         error.message || 
         "Error al cambiar el estado de la mascota");
  }
};
  

  // Helper para renderizar el badge de tipo de mascota
  const obtenerBadgeMascota = (tipo) => {
    switch(tipo) {
      case 'Perro': return { clase: 'mascota-badge-perro', icono: '🐕', texto: 'Perro' };
      case 'Gato': return { clase: 'mascota-badge-gato', icono: '🐈', texto: 'Gato' };
      default: return { clase: 'mascota-badge-otro', icono: '❓', texto: 'Otro' };
    }
  };

  if (isLoading) {
    return (
      <div className="mascota-contenedor">
        <div className="mascota-cargando">
          <div className="spinner"></div>
          <p>Cargando mascotas...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="mascota-contenedor">
      {/* Encabezado */}
      <header className="mascota-encabezado">
        <h1>🐾 Gestión de Mascotas</h1>
        <p>Sistema integral para el cuidado y seguimiento de tus mascotas</p>
      </header>

      {/* Búsqueda */}
      <section className="mascota-busqueda-filtros">
        <div className="mascota-buscador">
          <span className="mascota-buscador-icono">🔍</span>
          <input 
            type="search" 
            placeholder="Buscar por nombre, dueño o raza..."
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
          />
        </div>
        
        <div className="mascota-controles">
          <button 
            className="mascota-boton mascota-boton-primario" 
            onClick={() => setMostrarModalAgregar(true)}
          >
            <span>➕</span> Agregar Mascota
          </button>
        </div>
      </section>

      {/* Tarjetas de Estadísticas */}
      <section className="mascota-estadisticas">
        <article className="mascota-estadistica">
          <div className="mascota-estadistica-contenido">
            <div>
              <p className="mascota-estadistica-etiqueta">Total Mascotas</p>
              <p className="mascota-estadistica-valor">{totalMascotas}</p>
            </div>
            <span className="mascota-estadistica-icono">❤️</span>
          </div>
        </article>
        
        <article className="mascota-estadistica">
          <div className="mascota-estadistica-contenido">
            <div>
              <p className="mascota-estadistica-etiqueta">Activas</p>
              <p className="mascota-estadistica-valor">{totalActivos}</p>
            </div>
            <span className="mascota-estadistica-icono">✅</span>
          </div>
        </article>
        
        <article className="mascota-estadistica">
          <div className="mascota-estadistica-contenido">
            <div>
              <p className="mascota-estadistica-etiqueta">Inactivas</p>
              <p className="mascota-estadistica-valor">{totalInactivos}</p>
            </div>
            <span className="mascota-estadistica-icono">❌</span>
          </div>
        </article>
        
        <article className="mascota-estadistica">
          <div className="mascota-estadistica-contenido">
            <div>
              <p className="mascota-estadistica-etiqueta">Perros</p>
              <p className="mascota-estadistica-valor">{totalPerros}</p>
            </div>
            <span className="mascota-estadistica-icono">🐕</span>
          </div>
        </article>
        
        <article className="mascota-estadistica">
          <div className="mascota-estadistica-contenido">
            <div>
              <p className="mascota-estadistica-etiqueta">Gatos</p>
              <p className="mascota-estadistica-valor">{totalGatos}</p>
            </div>
            <span className="mascota-estadistica-icono">🐈</span>
          </div>
        </article>
      </section>

      {/* Listado de Mascotas */}
      <section className="mascota-listado">
        {mascotasFiltradas.length === 0 ? (
          <div className="mascota-vacio">
            <span className="mascota-vacio-icono">🐾</span>
            <h3 className="mascota-vacio-titulo">No se encontraron mascotas</h3>
            <p className="mascota-vacio-texto">Prueba con otros términos de búsqueda</p>
          </div>
        ) : (
          mascotasFiltradas.map(mascota => {
            const badge = obtenerBadgeMascota(mascota.tipo);
            return (
              <article key={mascota.id} className={`mascota-tarjeta ${!mascota.activo ? 'mascota-inactiva' : ''}`}>
                <header className="mascota-tarjeta-encabezado">
                  <div className="mascota-tarjeta-info">
                    <div className="mascota-avatar">{mascota.nombre.charAt(0)}</div>
                    <div>
                      <h3 className="mascota-nombre">{mascota.nombre}</h3>
                      <p className="mascota-detalle">{mascota.raza} • {mascota.edad} {mascota.edad === 1 ? 'año' : 'años'} • {mascota.peso} kg</p>
                    </div>
                  </div>
                  <div>
                    <span className={`mascota-badge ${badge.clase}`}>
                      {badge.icono} {badge.texto}
                    </span>
                    <span className={`mascota-estado ${mascota.activo ? 'mascota-activa' : 'mascota-inactiva'}`}>
                      {mascota.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </header>
                
                <section className="mascota-tarjeta-cuerpo">
                  <div className="mascota-detalle-item">
                    <span className="mascota-detalle-icono">👤</span>
                    <span>{mascota.dueño || 'Sin dueño registrado'}</span>
                  </div>
                  
                  {mascota.telefono && (
                    <div className="mascota-detalle-item">
                      <span className="mascota-detalle-icono">📞</span>
                      <span>{mascota.telefono}</span>
                    </div>
                  )}
                  
                  {mascota.direccion && (
                    <div className="mascota-detalle-item">
                      <span className="mascota-detalle-icono">📍</span>
                      <span className="mascota-direccion">{mascota.direccion}</span>
                    </div>
                  )}
                  
                  <div className="mascota-detalle-item">
                    <span className="mascota-detalle-icono">💉</span>
                    <span>Vacunado: {mascota.vacunado ? 'Sí ✅' : 'No ❌'}</span>
                  </div>
                  
                  <div className="mascota-detalle-item">
                    <span className="mascota-detalle-icono">✂️</span>
                    <span>Esterilizado: {mascota.esterilizado ? 'Sí ✅' : 'No ❌'}</span>
                  </div>
                  
                  {mascota.proximaCita && (
                    <div className="mascota-detalle-item">
                      <span className="mascota-detalle-icono">📅</span>
                      <span>Próxima cita: {new Date(mascota.proximaCita).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="mascota-acciones">
                    <button 
                      className="mascota-boton mascota-boton-editar" 
                      onClick={() => setMascotaEditando(mascota)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="mascota-boton mascota-boton-eliminar" 
                      onClick={() => eliminarMascota(mascota.id)}
                    >
                      🗑️ Eliminar
                    </button>
                    {mascota.activo ? (
                      <button 
                        className="mascota-boton mascota-boton-inactivar"
                        onClick={() => cambiarEstadoMascota(mascota.id, false)}
                      >
                        🚫 Inactivar
                      </button>
                    ) : (
                      <button 
                        className="mascota-boton mascota-boton-activar"
                        onClick={() => cambiarEstadoMascota(mascota.id, true)}
                      >
                        ✅ Activar
                      </button>
                    )}
                  </div>
                </section>
              </article>
            );
          })
        )}
      </section>

      {/* Modal para agregar mascota */}
      {mostrarModalAgregar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <MascotaForm 
              onClose={() => setMostrarModalAgregar(false)}
              onSubmit={handleAgregarMascota}
              isEditing={false}
            />
          </div>
        </div>
      )}

      {/* Modal para editar mascota */}
      {mascotaEditando && (
        <div className="modal-overlay">
          <div className="modal-content">
            <MascotaForm 
              onClose={() => setMascotaEditando(null)}
              onSubmit={handleEditarMascota}
              isEditing={true}
              initialData={{
                nombre: mascotaEditando.nombre,
                especie: mascotaEditando.tipo,
                raza: mascotaEditando.raza,
                edad: mascotaEditando.edad,
                genero: mascotaEditando.genero,
                peso: mascotaEditando.peso,
                color: mascotaEditando.color,
                observaciones: mascotaEditando.notas,
                vacunado: mascotaEditando.vacunado,
                esterilizado: mascotaEditando.esterilizado
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default GestorMascotas;