import React, { useState, useEffect } from 'react';
import "../../stylos/cssVet/Mascotas.css";

const GestorMascotas = () => {
  // Datos iniciales de mascotas (solo perros y gatos)
  const mascotasIniciales = [
    {
      id: "1",
      nombre: "Max",
      tipo: "perro",
      raza: "Golden Retriever",
      edad: 3,
      peso: 30,
      color: "Dorado",
      dueño: "Juan Pérez",
      telefono: "+34 123 456 789",
      email: "juan@email.com",
      direccion: "Calle Mayor 123, Madrid",
      notas: "Muy amigable, le gusta jugar con otros perros",
      ultimaVisita: "2024-01-15",
      proximaCita: "2024-02-15",
      vacunado: true,
      esterilizado: false,
      activo: true
    },
  ];

  useEffect(() => {
  const cargarMascotas = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/mascotas');
      if (!response.ok) {
        throw new Error('Error al cargar mascotas');
      }
      const data = await response.json();
      
      // Transformar los datos del backend al formato que espera tu frontend
      const mascotasTransformadas = data.map(mascota => ({
  id: mascota.id,
  nombre: mascota.nombre,
  tipo: mascota.tipo,
  raza: mascota.raza,
  edad: mascota.edad,
  genero: mascota.genero,
  peso: mascota.peso,
  idPropietario: mascota.idPropietario,
  color: mascota.color,
  notas: mascota.notas,
  ultimaVisita: mascota.ultimaVisita,
  proximaCita: mascota.proximaCita,
  vacunado: mascota.vacunado,
  esterilizado: mascota.esterilizado,
  activo: mascota.activo,
  dueño: `${mascota.nombre_propietario} ${mascota.apellido_propietario}`,
  telefono: mascota.telefono,
  email: mascota.email,
  direccion: mascota.direccion
}));
      
      setMascotas(mascotasTransformadas);
    } catch (error) {
      console.error("Error al cargar mascotas:", error);
      // Puedes mantener las mascotas iniciales como fallback
      setMascotas(mascotasIniciales);
    }
  };

  cargarMascotas();
}, []);

  // Estados principales
  const [mascotas, setMascotas] = useState(mascotasIniciales);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mascotaEditando, setMascotaEditando] = useState(null);
  
  // Estado para el formulario
  const [formulario, setFormulario] = useState({
  nombre: '',
  tipo: '',
  raza: '',
  edad: '',
  genero: '',
  peso: '',
  idPropietario: '',
  color: '',
  notas: '',
  ultimaVisita: '',
  proximaCita: '',
  vacunado: false,
  esterilizado: false,
  activo: true
});
  // Filtrar mascotas
  const mascotasFiltradas = mascotas.filter(mascota => {
    return (
      mascota.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      mascota.dueño.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      mascota.raza.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
  });

  // Estadísticas
  const totalMascotas = mascotas.length;
  const totalPerros = mascotas.filter(m => m.tipo === 'perro').length;
  const totalGatos = mascotas.filter(m => m.tipo === 'gato').length;
  const totalActivos = mascotas.filter(m => m.activo).length;
  const totalInactivos = mascotas.filter(m => !m.activo).length;

  // Manejadores de eventos
  const manejarCambioInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const agregarMascota = (e) => {
    e.preventDefault();
    const nuevaMascota = {
      ...formulario,
      id: Date.now().toString(),
      edad: parseInt(formulario.edad) || 0,
      peso: parseFloat(formulario.peso) || 0
    };
    setMascotas([...mascotas, nuevaMascota]);
    setMostrarModalAgregar(false);
    resetearFormulario();
  };

  const editarMascota = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`/api/mascotas/${mascotaEditando.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom_mas: formulario.nombre,
        especie: formulario.tipo,
        raza: formulario.raza,
        edad: parseInt(formulario.edad) || 0,
        genero: formulario.genero,
        peso: parseFloat(formulario.peso) || 0,
        id_pro: formulario.idPropietario
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar mascota');
    }

    // Actualizar el estado local
    const mascotaActualizada = {
      ...formulario,
      id: mascotaEditando.id,
      edad: parseInt(formulario.edad) || 0,
      peso: parseFloat(formulario.peso) || 0
    };
    
    setMascotas(mascotas.map(m => m.id === mascotaEditando.id ? mascotaActualizada : m));
    setMascotaEditando(null);
    alert('Mascota actualizada exitosamente');
  } catch (error) {
    console.error("Error:", error);
    alert('Error al actualizar la mascota: ' + error.message);
  }
};

const eliminarMascota = async (idMascota) => {
  if (window.confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
    try {
      const response = await fetch(`/api/mascotas/${idMascota}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar mascota');
      }

      setMascotas(mascotas.filter(m => m.id !== idMascota));
      alert('Mascota eliminada exitosamente');
    } catch (error) {
      console.error("Error:", error);
      alert('Error al eliminar la mascota: ' + error.message);
    }
  }
};
  const cambiarEstadoMascota = (idMascota, nuevoEstado) => {
    setMascotas(mascotas.map(m => 
      m.id === idMascota ? {...m, activo: nuevoEstado} : m
    ));
  };

  const abrirModalEdicion = (mascota) => {
    setMascotaEditando(mascota);
    setFormulario({
      nombre: mascota.nombre,
      tipo: mascota.tipo,
      raza: mascota.raza,
      edad: mascota.edad,
      peso: mascota.peso,
      color: mascota.color,
      dueño: mascota.dueño,
      telefono: mascota.telefono,
      email: mascota.email,
      direccion: mascota.direccion,
      ultimaVisita: mascota.ultimaVisita,
      proximaCita: mascota.proximaCita,
      notas: mascota.notas,
      vacunado: mascota.vacunado,
      esterilizado: mascota.esterilizado,
      activo: mascota.activo
    });
  };

  const resetearFormulario = () => {
    setFormulario({
      nombre: '',
      tipo: '',
      raza: '',
      edad: '',
      peso: '',
      color: '',
      dueño: '',
      telefono: '',
      email: '',
      direccion: '',
      ultimaVisita: '',
      proximaCita: '',
      notas: '',
      vacunado: false,
      esterilizado: false,
      activo: true
    });
  };

  // Helper para renderizar el badge de tipo de mascota
  const obtenerBadgeMascota = (tipo) => {
    switch(tipo) {
      case 'perro': return { clase: 'mascota-badge-perro', icono: '🐕', texto: 'Perro' };
      case 'gato': return { clase: 'mascota-badge-gato', icono: '🐈', texto: 'Gato' };
      default: return { clase: 'mascota-badge-otro', icono: '❓', texto: 'Otro' };
    }
  };

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
                    <span>{mascota.dueño}</span>
                  </div>
                  
                  <div className="mascota-detalle-item">
                    <span className="mascota-detalle-icono">📞</span>
                    <span>{mascota.telefono}</span>
                  </div>
                  
                  <div className="mascota-detalle-item">
                    <span className="mascota-detalle-icono">📍</span>
                    <span className="mascota-direccion">{mascota.direccion}</span>
                  </div>
                  
                  <div className="mascota-detalle-item">
                    <span className="mascota-detalle-icono">💉</span>
                    <span>Vacunado: {mascota.vacunado ? 'Sí ✅' : 'No ❌'}</span>
                  </div>
                  
                  <div className="mascota-detalle-item">
                    <span className="mascota-detalle-icono">✂️</span>
                    <span>Esterilizado: {mascota.esterilizado ? 'Sí ✅' : 'No ❌'}</span>
                  </div>
                  
                  <div className="mascota-detalle-item">
                    <span className="mascota-detalle-icono">📅</span>
                    <span>Próxima cita: {mascota.proximaCita || 'No programada'}</span>
                  </div>
                  
                  <div className="mascota-acciones">
                    <button 
                      className="mascota-boton mascota-boton-editar" 
                      onClick={() => abrirModalEdicion(mascota)}
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
        <div className="mascota-modal">
          <div className="mascota-modal-contenido">
            <header className="mascota-modal-encabezado">
              <h2>Agregar Nueva Mascota</h2>
              <p>Completa toda la información de la nueva mascota</p>
            </header>
            
            <form onSubmit={agregarMascota} className="mascota-formulario">
              <div className="mascota-formulario-grupo">
                <label htmlFor="nombre">Nombre </label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  value={formulario.nombre}
                  onChange={manejarCambioInput}
                  required 
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="tipo">Tipo </label>
                <select 
                  id="tipo" 
                  name="tipo" 
                  value={formulario.tipo}
                  onChange={manejarCambioInput}
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                </select>
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="raza">Raza</label>
                <input 
                  type="text" 
                  id="raza" 
                  name="raza" 
                  value={formulario.raza}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="edad">Edad (años)</label>
                <input 
                  type="number" 
                  id="edad" 
                  name="edad" 
                  min="0" 
                  value={formulario.edad}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="peso">Peso (kg)</label>
                <input 
                  type="number" 
                  id="peso" 
                  name="peso" 
                  step="0.1" 
                  min="0" 
                  value={formulario.peso}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="color">Color</label>
                <input 
                  type="text" 
                  id="color" 
                  name="color" 
                  value={formulario.color}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label>
                  <input 
                    type="checkbox" 
                    name="vacunado" 
                    checked={formulario.vacunado}
                    onChange={manejarCambioInput}
                  />
                  Vacunado
                </label>
              </div>
              
              <div className="mascota-formulario-grupo">
                <label>
                  <input 
                    type="checkbox" 
                    name="esterilizado" 
                    checked={formulario.esterilizado}
                    onChange={manejarCambioInput}
                  />
                  Esterilizado
                </label>
              </div>
              
              <div className="mascota-formulario-grupo">
                <label>
                  <input 
                    type="checkbox" 
                    name="activo" 
                    checked={formulario.activo}
                    onChange={manejarCambioInput}
                  />
                  Activo
                </label>
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="dueño">Dueño </label>
                <input 
                  type="text" 
                  id="dueño" 
                  name="dueño" 
                  value={formulario.dueño}
                  onChange={manejarCambioInput}
                  required 
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="telefono">Teléfono</label>
                <input 
                  type="tel" 
                  id="telefono" 
                  name="telefono" 
                  value={formulario.telefono}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo mascota-formulario-ancho-completo">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formulario.email}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo mascota-formulario-ancho-completo">
                <label htmlFor="direccion">Dirección</label>
                <input 
                  type="text" 
                  id="direccion" 
                  name="direccion" 
                  value={formulario.direccion}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="ultimaVisita">Última Visita</label>
                <input 
                  type="date" 
                  id="ultimaVisita" 
                  name="ultimaVisita" 
                  value={formulario.ultimaVisita}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="proximaCita">Próxima Cita</label>
                <input 
                  type="date" 
                  id="proximaCita" 
                  name="proximaCita" 
                  value={formulario.proximaCita}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo mascota-formulario-ancho-completo">
                <label htmlFor="notas">Notas</label>
                <textarea 
                  id="notas" 
                  name="notas" 
                  rows="3" 
                  value={formulario.notas}
                  onChange={manejarCambioInput}
                ></textarea>
              </div>
              
              <div className="mascota-modal-pie">
                <button 
                  type="button" 
                  className="mascota-boton mascota-boton-secundario" 
                  onClick={() => setMostrarModalAgregar(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="mascota-boton mascota-boton-primario">
                  Agregar Mascota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar mascota */}
      {mascotaEditando && (
        <div className="mascota-modal">
          <div className="mascota-modal-contenido">
            <header className="mascota-modal-encabezado">
              <h2>Editar Mascota: {mascotaEditando.nombre}</h2>
              <p>Modifica la información de la mascota</p>
            </header>
            
            <form onSubmit={editarMascota} className="mascota-formulario">
              <div className="mascota-formulario-grupo">
                <label htmlFor="editNombre">Nombre </label>
                <input 
                  type="text" 
                  id="editNombre" 
                  name="nombre" 
                  value={formulario.nombre}
                  onChange={manejarCambioInput}
                  required 
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="editTipo">Tipo </label>
                <select 
                  id="editTipo" 
                  name="tipo" 
                  value={formulario.tipo}
                  onChange={manejarCambioInput}
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                </select>
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="editRaza">Raza</label>
                <input 
                  type="text" 
                  id="editRaza" 
                  name="raza" 
                  value={formulario.raza}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="editEdad">Edad (años)</label>
                <input 
                  type="number" 
                  id="editEdad" 
                  name="edad" 
                  min="0" 
                  value={formulario.edad}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="editPeso">Peso (kg)</label>
                <input 
                  type="number" 
                  id="editPeso" 
                  name="peso" 
                  step="0.1" 
                  min="0" 
                  value={formulario.peso}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="editColor">Color</label>
                <input 
                  type="text" 
                  id="editColor" 
                  name="color" 
                  value={formulario.color}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label>
                  <input 
                    type="checkbox" 
                    name="vacunado" 
                    checked={formulario.vacunado}
                    onChange={manejarCambioInput}
                  />
                  Vacunado
                </label>
              </div>
              
              <div className="mascota-formulario-grupo">
                <label>
                  <input 
                    type="checkbox" 
                    name="esterilizado" 
                    checked={formulario.esterilizado}
                    onChange={manejarCambioInput}
                  />
                  Esterilizado
                </label>
              </div>
              
              <div className="mascota-formulario-grupo">
                <label>
                  <input 
                    type="checkbox" 
                    name="activo" 
                    checked={formulario.activo}
                    onChange={manejarCambioInput}
                  />
                  Activo
                </label>
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="editDueño">Dueño </label>
                <input 
                  type="text" 
                  id="editDueño" 
                  name="dueño" 
                  value={formulario.dueño}
                  onChange={manejarCambioInput}
                  required 
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="editTelefono">Teléfono</label>
                <input 
                  type="tel" 
                  id="editTelefono" 
                  name="telefono" 
                  value={formulario.telefono}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo mascota-formulario-ancho-completo">
                <label htmlFor="editEmail">Email</label>
                <input 
                  type="email" 
                  id="editEmail" 
                  name="email" 
                  value={formulario.email}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo mascota-formulario-ancho-completo">
                <label htmlFor="editDireccion">Dirección</label>
                <input 
                  type="text" 
                  id="editDireccion" 
                  name="direccion" 
                  value={formulario.direccion}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="editUltimaVisita">Última Visita</label>
                <input 
                  type="date" 
                  id="editUltimaVisita" 
                  name="ultimaVisita" 
                  value={formulario.ultimaVisita}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo">
                <label htmlFor="editProximaCita">Próxima Cita</label>
                <input 
                  type="date" 
                  id="editProximaCita" 
                  name="proximaCita" 
                  value={formulario.proximaCita}
                  onChange={manejarCambioInput}
                />
              </div>
              
              <div className="mascota-formulario-grupo mascota-formulario-ancho-completo">
                <label htmlFor="editNotas">Notas</label>
                <textarea 
                  id="editNotas" 
                  name="notas" 
                  rows="3" 
                  value={formulario.notas}
                  onChange={manejarCambioInput}
                ></textarea>
              </div>
              
              <div className="mascota-modal-pie">
                <button 
                  type="button" 
                  className="mascota-boton mascota-boton-secundario" 
                  onClick={() => setMascotaEditando(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className="mascota-boton mascota-boton-primario">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default GestorMascotas;