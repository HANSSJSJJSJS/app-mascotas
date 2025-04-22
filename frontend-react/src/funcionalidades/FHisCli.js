// Función para obtener fecha y hora actual
export const obtenerFechaHoraActual = () => {
    const ahora = new Date();
    
    // Formato de fecha: DD/MM/AAAA
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = ahora.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    
    // Formato de hora: HH:MM
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const horaFormateada = `${horas}:${minutos}`;
    
    // Generar código único
    const codigo = `HC-${anio}${mes}${dia}-${horas}${minutos}`;
    
    return {
        fecha: fechaFormateada,
        hora: horaFormateada,
        codigo: codigo
    };
};

// Función para guardar datos
export const guardarDatos = (datos) => {
    try {
        // Guardar en localStorage (en una app real, enviarías a un servidor)
        localStorage.setItem(`historiaClinica_${datos.codigo}`, JSON.stringify(datos));
        return {
            mensaje: 'Historia clínica guardada correctamente',
            exito: true
        };
    } catch (error) {
        return {
            mensaje: 'Error al guardar la historia clínica',
            exito: false
        };
    }
};

// Función para validar campos obligatorios
export const validarCamposObligatorios = (datos) => {
    const camposObligatorios = [
        'nombre Propietario', 'identidad', 'celular1',
        'nombre Mascota', 'especie', 'raza', 'sexo'
    ];

    for (let campo of camposObligatorios) {
        if (!datos[campo] || datos[campo].trim() === '') {
            return {
                valido: false,
                mensaje: `El campo ${campo} es obligatorio`
            };
        }
    }

    return {
        valido: true,
        mensaje: ''
    };
};