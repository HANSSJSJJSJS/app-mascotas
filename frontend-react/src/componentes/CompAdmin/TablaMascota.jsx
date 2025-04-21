import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import '../../stylos/cssAdmin/TablaMascota.css';
=======
import '../stylos/cssAdmin/TablaMascota.css';
>>>>>>> 7a29e7559b85d5c5f61f453e87e8560c5783623b

const TablaMascotas = ({ onMascotaSelect }) => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'registro', direction: 'desc' });

  useEffect(() => {
    // Simulando carga de datos desde una API
    const fetchData = async () => {
      try {
        // En una aplicación real, aquí harías una llamada a la API
        const data = [
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
        setMascotas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching mascotas:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedMascotas = [...mascotas].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

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
      {loading ? (
        <p>Cargando mascotas...</p>
      ) : (
        <table className="tabla-mascotas">
          <thead>
            <tr>
              {columnas.map(columna => (
                <th 
                  key={columna.key} 
                  onClick={() => handleSort(columna.key)}
                  className={sortConfig.key === columna.key ? `sort-${sortConfig.direction}` : ''}
                >
                  {columna.label}
                  {sortConfig.key === columna.key && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedMascotas.map(mascota => (
              <tr 
                key={mascota.nombre} 
                onClick={() => onMascotaSelect && onMascotaSelect(mascota)}
                className="clickable-row"
              >
                {columnas.map(columna => (
                  <td key={`${mascota.nombre}-${columna.key}`}>
                    {mascota[columna.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TablaMascotas;