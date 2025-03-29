import React from 'react';
// import '../stylos/TablaMascota.css';

const TablaMascotas = () => {
    const mascotas = [
        {
            nombre: 'Max',
            propietario: 'Carlos Rodríguez',
            telefono: '9342123',
            email: 'carlos@gmail.com',
            registro: '21 Marzo 2025'
        },
        {
            nombre: 'Luna',
            propietario: 'María López',
            telefono: '9345678',
            email: 'maria@gmail.com',
            registro: '18 Marzo 2025'
        },
        {
            nombre: 'Rocky',
            propietario: 'Juan Pérez',
            telefono: '9341234',
            email: 'juan@gmail.com',
            registro: '15 Marzo 2025'
        }
    ];

    const columnas = [
        { key: 'nombre', label: 'MASCOTA' },
        { key: 'propietario', label: 'PROPIETARIO' },
        { key: 'telefono', label: 'TELÉFONO' },
        { key: 'email', label: 'EMAIL' },
        { key: 'registro', label: 'REGISTRO' }
    ];

    return (
        <div className="contenedor-tabla">
            <h3 className="titulo-tabla">Las últimas mascotas registradas</h3>
            <table className="tabla-mascotas">
                <thead>
                    <tr>
                        {columnas.map(columna => (
                            <th key={columna.key}>{columna.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {mascotas.map(mascota => (
                        <tr key={mascota.nombre}>
                            {columnas.map(columna => (
                                <td key={`${mascota.nombre}-${columna.key}`}>
                                    {mascota[columna.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablaMascotas;