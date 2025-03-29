import React, { useState } from 'react';
import '../stylos/HisCli.css'
import { obtenerFechaHoraActual, guardarDatos, validarCamposObligatorios } from '../funcionalidades/HisCli';

function FormularioVeterinario() {
  const [datosFormulario, setDatosFormulario] = useState({
    codigo: '',
    hora: '',
    fecha: '',
    nombrePropietario: '',
    identidad: '',
    direccion: '',
    celular1: '',
    celular2: '',
    nombreMascota: '',
    especie: '',
    raza: '',
    sexo: '',
    fechaNacimiento: '',
    peso: '',
    color: '',
    motivoConsulta: '',
  });

  const [mensaje, setMensaje] = useState('');

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(estadoPrevio => ({
      ...estadoPrevio,
      [name]: value
    }));
  };

  const manejarGuardar = () => {
    // Obtener fecha, hora y código generado automáticamente
    const { fecha, hora, codigo } = obtenerFechaHoraActual();

    // Actualizar los campos de fecha, hora y código en el formulario
    const datosActualizados = {
      ...datosFormulario,
      fecha,
      hora,
      codigo
    };

    // Validar campos obligatorios
    const validacion = validarCamposObligatorios(datosActualizados);

    if (validacion.valido) {
      // Intentar guardar los datos
      const resultado = guardarDatos(datosActualizados);

      // Mostrar mensaje según el resultado
      setMensaje(resultado.mensaje);
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => setMensaje(''), 3000);
    } else {
      // Mostrar mensaje de error de validación
      setMensaje(validacion.mensaje);
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const manejarLimpiar = () => {
    setDatosFormulario({
      codigo: '',
      hora: '',
      fecha: '',
      nombrePropietario: '',
      identidad: '',
      direccion: '',
      celular1: '',
      celular2: '',
      nombreMascota: '',
      especie: '',
      raza: '',
      sexo: '',
      fechaNacimiento: '',
      peso: '',
      color: '',
      motivoConsulta: '',
    });
  };

  const manejarImprimir = () => {
    window.print();
  };

  return (
    <main className="contenedor">
      <header>
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.jpg-GHthXA7NYvr2Icd9rkW6r7ApXTbEkl.jpeg" 
          alt="Logo PET MOYBE Clínica Veterinaria" 
          className="logo" 
        />
      </header>

      <h1>HISTORIA CLÍNICA</h1>

      <form id="formularioHistoriaClinica">
        <section className="info-basica">
          <article className="campo-info">
            <label htmlFor="codigo">Código:</label>
            <input 
              type="text" 
              id="codigo" 
              name="codigo" 
              value={datosFormulario.codigo}
              onChange={manejarCambio}
              readOnly
            />
          </article>
          <article className="campo-info">
            <label htmlFor="hora">Hora:</label>
            <input 
              type="text" 
              id="hora" 
              name="hora" 
              value={datosFormulario.hora}
              onChange={manejarCambio}
              readOnly
            />
          </article>
          <article className="campo-info fecha-completa">
            <label htmlFor="fecha">Fecha:</label>
            <input 
              type="text" 
              id="fecha" 
              name="fecha" 
              value={datosFormulario.fecha}
              onChange={manejarCambio}
              readOnly
            />
          </article>
        </section>

        <section className="propietario">
          <h2>Datos del Propietario</h2>
          <article className="fila">
            <div className="campo">
              <label htmlFor="nombrePropietario">Nombre:</label>
              <input 
                type="text" 
                id="nombrePropietario" 
                name="nombrePropietario" 
                value={datosFormulario.nombrePropietario}
                onChange={manejarCambio}
              />
            </div>
            <div className="campo">
              <label htmlFor="identidad"># de Identidad:</label>
              <input 
                type="text" 
                id="identidad" 
                name="identidad" 
                value={datosFormulario.identidad}
                onChange={manejarCambio}
              />
            </div>
          </article>
          <article className="campo">
            <label htmlFor="direccion">Dirección:</label>
            <input 
              type="text" 
              id="direccion" 
              name="direccion" 
              value={datosFormulario.direccion}
              onChange={manejarCambio}
            />
          </article>
          <article className="fila">
            <div className="campo">
              <label htmlFor="celular1">Celular:</label>
              <input 
                type="tel" 
                id="celular1" 
                name="celular1" 
                value={datosFormulario.celular1}
                onChange={manejarCambio}
              />
            </div>
            <div className="campo">
              <label htmlFor="celular2">Celular 2:</label>
              <input 
                type="tel" 
                id="celular2" 
                name="celular2" 
                value={datosFormulario.celular2}
                onChange={manejarCambio}
              />
            </div>
          </article>
        </section>

        <section className="mascota">
          <h2>Datos de la Mascota</h2>
          <article className="fila">
            <div className="campo">
              <label htmlFor="nombreMascota">Nombre:</label>
              <input 
                type="text" 
                id="nombreMascota" 
                name="nombreMascota" 
                value={datosFormulario.nombreMascota}
                onChange={manejarCambio}
              />
            </div>
            <div className="campo">
              <label htmlFor="especie">Especie:</label>
              <input 
                type="text" 
                id="especie" 
                name="especie" 
                value={datosFormulario.especie}
                onChange={manejarCambio}
              />
            </div>
          </article>
          <article className="fila">
            <div className="campo">
              <label htmlFor="raza">Raza:</label>
              <input 
                type="text" 
                id="raza" 
                name="raza" 
                value={datosFormulario.raza}
                onChange={manejarCambio}
              />
            </div>
            <div className="campo">
              <label htmlFor="sexo">Sexo:</label>
              <input 
                type="text" 
                id="sexo" 
                name="sexo" 
                value={datosFormulario.sexo}
                onChange={manejarCambio}
              />
            </div>
          </article>
          <article className="fila">
            <div className="campo">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
              <input 
                type="text" 
                id="fechaNacimiento" 
                name="fechaNacimiento" 
                value={datosFormulario.fechaNacimiento}
                onChange={manejarCambio}
              />
            </div>
            <div className="campo">
              <label htmlFor="peso">Peso:</label>
              <input 
                type="text" 
                id="peso" 
                name="peso" 
                value={datosFormulario.peso}
                onChange={manejarCambio}
              />
            </div>
          </article>
          <article className="campo">
            <label htmlFor="color">Color:</label>
            <input 
              type="text" 
              id="color" 
              name="color" 
              value={datosFormulario.color}
              onChange={manejarCambio}
            />
          </article>
        </section>

        <section className="anamnesis">
          <h2>Anamnesis</h2>
          <article className="campo">
            <label htmlFor="motivoConsulta">Motivo de Consulta:</label>
            <textarea 
              id="motivoConsulta" 
              name="motivoConsulta"
              value={datosFormulario.motivoConsulta}
              onChange={manejarCambio}
            ></textarea>
          </article>
        </section>

        <section className="botones">
          <button type="button" id="btnGuardar" onClick={manejarGuardar}>
            Guardar
          </button>
          <button type="button" id="btnLimpiar" onClick={manejarLimpiar}>
            Limpiar
          </button>
          <button type="button" id="btnImprimir" onClick={manejarImprimir}>
            Imprimir
          </button>
        </section>
      </form>

      {mensaje && <section id="mensaje">{mensaje}</section>}
    </main>
  );
}

export default FormularioVeterinario;