export const fetchMascotas = async () => {
    try {
      // API de placeholder para perros y gatos
      const perrosResponse = await fetch('https://dog.ceo/api/breeds/image/random/6');
      const gatosResponse = await fetch('https://api.thecatapi.com/v1/images/search?limit=2');
      
      const [perrosData, gatosData] = await Promise.all([
        perrosResponse.json(),
        gatosResponse.json()
      ]);
      
      // Datos mock para las 8 mascotas
      const mascotasMock = [
        {
          id: "1",
          nombre: "Luna",
          especie: "perro",
          raza: "Labrador Retriever",
          edad: 2,
          ubicacion: "Ciudad Central",
          descripcion: "Luna es una labrador muy cariñosa y juguetona. Perfecta para familias con niños.",
          destacado: true
        },
        {
          id: "2",
          nombre: "Max",
          especie: "perro",
          raza: "Pastor Alemán",
          edad: 3,
          ubicacion: "Ciudad Norte",
          descripcion: "Max es un pastor alemán muy inteligente y protector. Ideal para hogares con espacio.",
          destacado: false
        },
        {
          id: "3",
          nombre: "Bella",
          especie: "perro",
          raza: "Golden Retriever",
          edad: 1,
          ubicacion: "Ciudad Este",
          descripcion: "Bella es una golden retriever alegre y sociable. Adora jugar al aire libre.",
          destacado: true
        },
        {
          id: "4",
          nombre: "Rocky",
          especie: "perro",
          raza: "Bulldog Francés",
          edad: 2,
          ubicacion: "Ciudad Sur",
          descripcion: "Rocky es un bulldog francés tranquilo y cariñoso. Perfecto para departamentos.",
          destacado: false
        },
        {
          id: "5",
          nombre: "Mia",
          especie: "gato",
          raza: "Siamés",
          edad: 1,
          ubicacion: "Ciudad Este",
          descripcion: "Mia es una gatita siamesa elegante y curiosa. Le encanta explorar su entorno.",
          destacado: false
        },
        {
          id: "6",
          nombre: "Simba",
          especie: "gato",
          raza: "Maine Coon",
          edad: 3,
          ubicacion: "Ciudad Oeste",
          descripcion: "Simba es un gato Maine Coon majestuoso pero juguetón. Muy sociable con personas.",
          destacado: true
        },
        

      ];
      
      // Combinamos imágenes reales con datos mock
      return mascotasMock.map((mascota, index) => {
        let imagen;
        if (mascota.especie === 'perro') {
          imagen = perrosData.message[index] || 'https://via.placeholder.com/300';
        } else if (mascota.especie === 'gato') {
          const catIndex = index - 4; // Ajuste para gatos
          imagen = (gatosData[catIndex]?.url || 'https://via.placeholder.com/300');
        } else {
          imagen = mascota.imagen || 'https://via.placeholder.com/300';
        }
        
        return {
          ...mascota,
          imagen
        };
      });
    } catch (error) {
      console.error("Error fetching mascotas:", error);
      throw error;
    }
  };