import React from 'react';
import { Bone, Stethoscope, Calendar } from 'lucide-react';
import '../../stylos/cssAdmin/TarjetaEstadistica.css';

const TarjetasEstadisticas = () => {
    const estadisticas = [
    { 
        icono: Bone, 
        color: '#20c997', 
        titulo: 'Total de Mascotas', 
        valor: '8' 
    },
    { 
        icono: Stethoscope, 
        color: '#4e73df', 
        titulo: 'Total de Veterinarios', 
        valor: '5' 
    },
    { 
        icono: Calendar, 
        color: '#e74a3b', 
        titulo: 'Total de Citas', 
        valor: '12' 
    }
    ];

    return (
        <div className="contenedor-tarjetas">
            {estadisticas.map(({ icono: Icono, color, titulo, valor }) => (
                <div key={titulo} className="tarjeta-estadistica">
                    <div className="icono-estadistica" style={{ color }}>
                        <Icono size={24} />
                    </div>
                    <div className="contenido-estadistica">
                        <h3>{titulo}</h3>
                        <p>{valor}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default TarjetasEstadisticas;