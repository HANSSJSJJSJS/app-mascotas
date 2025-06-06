import React, { useState } from 'react';
import { Button, Table, Card, Form, Row, Col } from 'react-bootstrap';
import { Plus, Eye, Edit, Trash2, PhoneCall, User, Calendar, CheckSquare } from 'react-feather';
import '../../stylos/cssVet/GestionCitas.css';
import FormularioCita from '../CompVet/FormularioCita';

const GestionCitas = () => {
  const [citas, setCitas] = useState([
    {
      id: "1",
      mascota: "Max",
      propietario: "María González",
      fecha: "2024-01-15",
      hora: "08:00",
      tipo: "Consulta General",
      estado: "pendiente",
      prioridad: "media",
      motivo: "Revisión anual y vacunas",
      tipoMascota: "perro • Golden Retriever",
      telefono: "+34 666 123 456"
    },
    {
      id: "2",
      mascota: "Luna",
      propietario: "Carlos Rodríguez",
      fecha: "2024-01-15",
      hora: "10:30",
      tipo: "Emergencia",
      estado: "confirmada",
      prioridad: "urgente",
      motivo: "Vómitos y diarrea desde ayer",
      tipoMascota: "gato • Siamés",
      telefono: "+34 677 987 654"
    },
    {
      id: "3",
      mascota: "Coco",
      propietario: "Laura Martínez",
      fecha: "2024-01-16",
      hora: "14:00",
      tipo: "Control",
      estado: "completada",
      prioridad: "alta",
      motivo: "Control post-operatorio",
      tipoMascota: "ave • Canario",
      telefono: "+34 688 555 777"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const tiposConsulta = {
    "Consulta General": citas.filter(c => c.tipo === "Consulta General").length,
    "Emergencia": citas.filter(c => c.tipo === "Emergencia").length,
    "Control": citas.filter(c => c.tipo === "Control").length
  };

  const filteredCitas = citas.filter(cita =>
    cita.mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cita.propietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cita.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCita = (nuevaCita) => {
    setCitas([...citas, {
      ...nuevaCita,
      id: (citas.length + 1).toString()
    }]);
    setShowForm(false);
  };

  return (
    <div className="agenda-vet-container">
      <h1 className="agenda-title">Gestión de Citas Veterinarias</h1>

      <div className="stats-section">
        <div className="stat-card">
          <h3>Citas Hoy</h3>
          <p>{citas.filter(c => c.fecha === new Date().toISOString().split('T')[0]).length}</p>
        </div>
        <div className="stat-card">
          <h3>Pendientes</h3>
          <p>{citas.filter(c => c.estado === 'pendiente').length}</p>
        </div>
        <div className="stat-card">
          <h3>Completadas</h3>
          <p>{citas.filter(c => c.estado === 'completada').length}</p>
        </div>
        <div className="stat-card">
          <h3>Urgentes</h3>
          <p>{citas.filter(c => c.prioridad === 'urgente').length}</p>
        </div>
      </div>

      <div className="consult-types">
        <h3>Distribución por Tipo de Consulta</h3>
        <div className="types-grid">
          <div className="type-item">
            <span className="type-count">{tiposConsulta["Consulta General"]}</span>
            <span className="type-label">Consulta General</span>
          </div>
          <div className="type-item">
            <span className="type-count">{tiposConsulta["Emergencia"]}</span>
            <span className="type-label">Emergencia</span>
          </div>
          <div className="type-item">
            <span className="type-count">{tiposConsulta["Control"]}</span>
            <span className="type-label">Control</span>
          </div>
        </div>
      </div>

      <Card className="management-card">
        <Card.Header className="management-header">
          <h3>Listado de Citas</h3>
          <Button 
            variant="primary" 
            className="new-appointment-btn"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} className="me-1" />
            Nueva Cita
          </Button>
        </Card.Header>
        <Card.Body>
          <Form className="mb-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Control 
                  type="text" 
                  placeholder="Buscar citas por mascota, propietario o motivo..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
            </Row>
          </Form>

          <div className="appointments-table-container">
            <Table className="appointments-table" striped bordered hover>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Especie/Raza</th>
                  <th>Propietario</th>
                  <th>Contacto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCitas.length > 0 ? (
                  filteredCitas.map(cita => (
                    <React.Fragment key={cita.id}>
                      <tr>
                        <td>
                          <strong>{cita.mascota}</strong><br />
                          <small>{cita.hora} • {cita.tipo}</small>
                        </td>
                        <td>
                          <strong>{cita.tipoMascota.split(' • ')[0]}</strong><br />
                          <small>{cita.tipoMascota.split(' • ')[1]}</small>
                        </td>
                        <td>
                          <User size={16} className="me-1" />
                          {cita.propietario}
                        </td>
                        <td>
                          <PhoneCall size={16} className="me-1 text-primary" />
                          {cita.telefono}
                        </td>
                        <td>
                          <span className={`badge rounded-pill bg-${cita.estado === 'completada' ? 'success' : cita.estado === 'confirmada' ? 'info' : 'warning'} d-inline-flex align-items-center gap-1 px-2 py-1`}>
                            <CheckSquare size={14} />
                            {cita.estado}
                          </span>
                        </td>
                        <td>
                          <Calendar size={16} className="me-1 text-primary" />
                          {cita.fecha}
                        </td>
                        <td className="d-flex gap-2">
                          <Button variant="light" className="btn-icon">
                            <Eye size={16} />
                          </Button>
                          <Button variant="light" className="btn-icon">
                            <Edit size={16} />
                          </Button>
                          <Button variant="light" className="btn-icon text-danger">
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No se encontraron citas
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {showForm && (
        <FormularioCita 
          onGuardar={handleAddCita} 
          onCancelar={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default GestionCitas;