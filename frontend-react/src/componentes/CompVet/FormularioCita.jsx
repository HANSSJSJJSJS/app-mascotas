import React, { useState } from 'react';
import { Modal, Button, Form, FloatingLabel, Row, Col } from 'react-bootstrap';
import { Plus, X } from 'react-feather';
import '../CompVet/GestionCitas'
const FormularioCita = ({ onGuardar, onCancelar }) => {
  const [cita, setCita] = useState({
    mascota: '',
    propietario: '',
    fecha: '',
    hora: '',
    tipo: 'Consulta General',
    estado: 'pendiente',
    prioridad: 'media',
    motivo: '',
    tipoMascota: '',
    telefono: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCita({
      ...cita,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(cita);
  };

  return (
    <Modal 
      show={true} 
      onHide={onCancelar}
      centered
      size="lg"
      className="appointment-modal"
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Nueva Cita Veterinaria</h4>
            <Button 
              variant="link" 
              onClick={onCancelar}
              className="p-0"
            >
              <X size={24} />
            </Button>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <FloatingLabel controlId="mascota" label="Nombre de la mascota" className="mb-3">
                <Form.Control 
                  type="text" 
                  name="mascota" 
                  value={cita.mascota}
                  onChange={handleChange}
                  required 
                  placeholder=" "
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel controlId="propietario" label="Nombre del propietario" className="mb-3">
                <Form.Control 
                  type="text" 
                  name="propietario" 
                  value={cita.propietario}
                  onChange={handleChange}
                  required 
                  placeholder=" "
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel controlId="tipoMascota" label="Especie y raza (ej: perro • Labrador)" className="mb-3">
                <Form.Control 
                  type="text" 
                  name="tipoMascota" 
                  value={cita.tipoMascota}
                  onChange={handleChange}
                  required 
                  placeholder=" "
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel controlId="telefono" label="Teléfono de contacto" className="mb-3">
                <Form.Control 
                  type="tel" 
                  name="telefono" 
                  value={cita.telefono}
                  onChange={handleChange}
                  required 
                  placeholder=" "
                />
              </FloatingLabel>
            </Col>
            {/* Resto de los campos del formulario... */}
          </Row>
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="outline-secondary" onClick={onCancelar}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              <Plus size={16} className="me-1" />
              Agregar Cita
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormularioCita;