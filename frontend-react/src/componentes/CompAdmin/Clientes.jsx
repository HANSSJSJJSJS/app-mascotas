import React from 'react';
import "../../stylos/cssAdmin/Clientes.css"

const RegistroClientes = () => {
  // Datos de ejemplo - en una aplicación real 
  const clientes = [
    {
      id: 1,
      tipoDocumento: 'CC',
      numeroDocumento: '123456789',
      nombreCompleto: 'Juan Pérez Gómez',
      fechaNacimiento: '14/5/1985',
      telefono: '3001234567',
      correo: 'juan.perez@example.com',
      direccion: 'Calle 123 #45-67, Bogotá',
      estado: 'activo'
    },
    {
      id: 2,
      tipoDocumento: 'CE',
      numeroDocumento: 'AB123456',
      nombreCompleto: 'María García López',
      fechaNacimiento: '21/8/1990',
      telefono: '3109876543',
      correo: 'maria.garcia@example.com',
      direccion: 'Carrera 8 #12-34, Medellín',
      estado: 'inactivo'
    }
  ];

  return (
    <main>
      <header className="content-header">
        <h1 className="page-title">Registro de Clientes</h1>
        <section className="search-container">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar cliente..."
          />
        </section>
      </header>

      <section className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>DOCUMENTO</th>
              <th>NOMBRE COMPLETO</th>
              <th>FECHA NACIMIENTO</th>
              <th>TELÉFONO</th>
              <th>EMAIL</th>
              <th>DIRECCIÓN</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>
                  <span className="doc-type">{cliente.tipoDocumento}</span> {cliente.numeroDocumento}
                </td>
                <td>{cliente.nombreCompleto}</td>
                <td>{cliente.fechaNacimiento}</td>
                <td>
                  <span className="contact-info">
                    <span className="icon">📞</span>
                    {cliente.telefono}
                  </span>
                </td>
                <td>
                  <span className="contact-info">
                    <span className="icon">✉️</span>
                    {cliente.correo}
                  </span>
                </td>
                <td>
                  <span className="contact-info">
                    <span className="icon">📍</span>
                    {cliente.direccion}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${cliente.estado}`}>
                    {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <section className="action-buttons">
                    <button className="action-btn edit-btn">✏️</button>
                    <button className="action-btn delete-btn">🗑️</button>
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

export default RegistroClientes;