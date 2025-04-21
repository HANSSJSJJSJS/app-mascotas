import { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { fetchMascotas } from '../api/mascotas';
import '../../stylos/cssHome/Adopcion.css';

const Adopcion = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarMascotas = async () => {
      try {
        const datos = await fetchMascotas();
        setMascotas(datos);
      } catch (error) {
        console.error(error);
        // Datos de respaldo completos con 8 mascotas
        setMascotas([
          {
            id: "1",
            nombre: "Luna",
            edad: 2,
            ubicacion: "Ciudad Central",
            destacado: true,
            imagen: "https://images.dog.ceo/breeds/labrador/n02099712_741.jpg"
          },
          {
            id: "2",
            nombre: "Max",
            edad: 3,
            ubicacion: "Ciudad Norte",
            destacado: false,
            imagen: "https://images.dog.ceo/breeds/germanshepherd/n02106662_2415.jpg"
          },
          {
            id: "3",
            nombre: "Bella",
            edad: 1,
            ubicacion: "Ciudad Este",
            destacado: true,
            imagen: "https://images.dog.ceo/breeds/retriever-golden/n02099601_100.jpg"
          },
          {
            id: "4",
            nombre: "Rocky",
            edad: 2,
            ubicacion: "Ciudad Sur",
            destacado: false,
            imagen: "https://images.dog.ceo/breeds/bulldog-french/n02108915_4476.jpg"
          },
          {
            id: "5",
            nombre: "Mia",
            raza: "Siamés",
            edad: 1,
            ubicacion: "Ciudad Este",
            destacado: false,
            imagen: "https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg"
          },
          {
            id: "6",
            nombre: "Simba",
            edad: 3,
            ubicacion: "Ciudad Oeste",
            destacado: true,
            imagen: "https://cdn2.thecatapi.com/images/8pCFG7gCV.jpg"
          },

        ]);
      } finally {
        setLoading(false);
      }
    };

    cargarMascotas();
  }, []);

  if (loading) return <div className="cargando">Cargando mascotas...</div>;

  return (
    <div className="contenedor-adopcion">
      <h1>Mascotas Disponibles</h1>
      <div className="grid-mascotas">
        {mascotas.map((mascota) => (
          <div key={mascota.id} className={`tarjeta-mascota ${mascota.destacado ? 'destacada' : ''}`}>
            {mascota.destacado && <div className="badge-destacado">⭐ Destacado</div>}
            <div className="imagen-mascota">
              <img src={mascota.imagen} alt={mascota.nombre} />
            </div>
            <div className="info-mascota">
              <h3>{mascota.nombre}</h3>
              <div className="especie-raza">
                <span>{mascota.especie}</span> · <span>{mascota.raza}</span>
              </div>
              <div className="detalles">
                <span><Calendar size={16} /> {mascota.edad} años</span>
                <span><MapPin size={16} /> {mascota.ubicacion}</span>
              </div>
              <p className="descripcion">{mascota.descripcion}</p>
              <button className="boton-detalles">Ver Detalles</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Adopcion;