import React, { useState } from 'react';
import '../stylos/cssAdmin/ModuloHorarios.css'; 

function ModuloHorarios() {
  // Estado inicial para los horarios
  const [horarios, setHorarios] = useState([
    {
      dia: 'Lunes',
      activo: true,
      mananaInicio: '08:30',
      mananaFin: '12:30',
      tardeInicio: '13:45',
      tardeFin: '18:45'
    },
    {
      dia: 'Martes',
      activo: false,
      mananaInicio: '08:45',
      mananaFin: '12:45',
      tardeInicio: '12:45',
      tardeFin: '12:45'
    },
    {
      dia: 'Miércoles',
      activo: true,
      mananaInicio: '12:45',
      mananaFin: '15:45',
      tardeInicio: '16:45',
      tardeFin: '12:45'
    }
  ]);

  // Función para actualizar el estado de activo de un día
  const cambiarEstado = (index) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index].activo = !nuevosHorarios[index].activo;
    setHorarios(nuevosHorarios);
  };

  // Función para actualizar cualquier campo de tiempo
  const actualizarTiempo = (index, campo, valor) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index][campo] = valor;
    setHorarios(nuevosHorarios);
  };

  // Función para añadir un nuevo horario
  const agregarHorario = () => {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const diasActuales = horarios.map(h => h.dia);
    
    // Encontrar el primer día que no está en la lista
    const nuevoDia = diasSemana.find(dia => !diasActuales.includes(dia));
    
    if (nuevoDia) {
      setHorarios([...horarios, {
        dia: nuevoDia,
        activo: false,
        mananaInicio: '09:00',
        mananaFin: '13:00',
        tardeInicio: '15:00',
        tardeFin: '19:00'
      }]);
    } else {
      alert('Todos los días de la semana ya están añadidos.');
    }
  };

  // Función para guardar cambios
  const guardarCambios = () => {
    alert('Cambios guardados con éxito');
    // Aquí iría la lógica para enviar los datos al servidor
  };

  return (
    <div>
      <header className="header">
        <h1 className="titulo">MODULO DE HORARIOS</h1>
      </header>

      <main className="main">
        <section className="controles">
          <button onClick={agregarHorario} className="boton">
            Nuevo hora
          </button>
          
          <p className="nombre-doctor">
            Dr. Carlos Sánchez
          </p>
          
          <button onClick={guardarCambios} className="boton">
            Guardar Cambios
          </button>
        </section>

        <section className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th className="cabecera-tabla">DIA</th>
                <th className="cabecera-tabla">ESTADO</th>
                <th colSpan="2" className="cabecera-tabla">TURNO MAÑANA</th>
                <th colSpan="2" className="cabecera-tabla">TURNO TARDE</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario, index) => (
                <tr key={index}>
                  <td className={index === horarios.length - 1 ? "ultima-celda" : "celda-tabla"}>
                    {horario.dia}
                  </td>
                  <td className={index === horarios.length - 1 ? "ultima-celda" : "celda-tabla"}>
                    <label className="switch-container">
                      <input 
                        type="checkbox" 
                        checked={horario.activo}
                        onChange={() => cambiarEstado(index)}
                        className="switch-input"
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td className={index === horarios.length - 1 ? "ultima-celda" : "celda-tabla"}>
                    <input 
                      type="time" 
                      value={horario.mananaInicio}
                      onChange={(e) => actualizarTiempo(index, 'mananaInicio', e.target.value)}
                      className="input-tiempo"
                    />
                  </td>
                  <td className={index === horarios.length - 1 ? "ultima-celda" : "celda-tabla"}>
                    <input 
                      type="time" 
                      value={horario.mananaFin}
                      onChange={(e) => actualizarTiempo(index, 'mananaFin', e.target.value)}
                      className="input-tiempo"
                    />
                  </td>
                  <td className={index === horarios.length - 1 ? "ultima-celda" : "celda-tabla"}>
                    <input 
                      type="time" 
                      value={horario.tardeInicio}
                      onChange={(e) => actualizarTiempo(index, 'tardeInicio', e.target.value)}
                      className="input-tiempo"
                    />
                  </td>
                  <td className={index === horarios.length - 1 ? "ultima-celda" : "celda-tabla"}>
                    <input 
                      type="time" 
                      value={horario.tardeFin}
                      onChange={(e) => actualizarTiempo(index, 'tardeFin', e.target.value)}
                      className="input-tiempo"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default ModuloHorarios;