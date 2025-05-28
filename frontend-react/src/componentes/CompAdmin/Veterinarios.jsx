import React from 'react';
import "../../stylos/cssAdmin/Veterinario.css"

const VeterinariosRegistrados = () => {
  // Datos de los veterinarios
  const veterinarios = [
    {
      id: 1,
      foto: "/placeholder.svg?height=40&width=40",
      nombre: "Dra. Martinez",
      especialidad: "Cirugía",
      correo: "martinez@vetclinic.com",
      telefono: "555-123-4567"
    },
    {
      id: 2,
      foto: "/placeholder.svg?height=40&width=40",
      nombre: "Dr. Gómez",
      especialidad: "Dermatología",
      correo: "gomez@vetclinic.com",
      telefono: "555-234-5678"
    },
    {
      id: 3,
      foto: "/placeholder.svg?height=40&width=40",
      nombre: "Dra. Fernández",
      especialidad: "Odontología",
      correo: "fernandez@vetclinic.com",
      telefono: "555-345-6789"
    },
    {
      id: 4,
      foto: "/placeholder.svg?height=40&width=40",
      nombre: "Dr. Ramírez",
      especialidad: "Medicina interna",
      correo: "ramirez@vetclinic.com",
      telefono: "555-456-7890"
    }
  ];

  return (
    <main>
      <header className="content-header">
        <h1 className="page-title">Veterinarios Registrados</h1>
        <section className="header-controls">
          <section className="search-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar veterinarios..."
            />
          </section>
        </section>
      </header>

      <section className="table-container">
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Correo electrónico</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {veterinarios.map(veterinario => (
              <tr key={veterinario.id}>
                <td>
                  <img 
                    src={veterinario.foto} 
                    alt={veterinario.nombre} 
                    className="vet-photo" 
                  />
                </td>
                <td className="vet-name">{veterinario.nombre}</td>
                <td className="specialty">{veterinario.especialidad}</td>
                <td className="contact-info">{veterinario.correo}</td>
                <td className="contact-info">{veterinario.telefono}</td>
                <td>
                  <section className="action-buttons">
                    <button 
                      className="action-btn edit-btn" 
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </section>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default VeterinariosRegistrados;