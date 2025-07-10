import { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, PawPrint, ChevronRight, Search } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import "../../stylos/cssVet/InicioVet.css";
import "../../stylos/cssVet/Card.css";

export default function InicioVet() {
  // Estados principales
  const [datos, setDatos] = useState({
    citasHoy: 0,
    consultasPendientes: 0,
    mascotasTotales: 0
  });

  const [citas, setCitas] = useState();
  const [citasCompletadas, setCitasCompletadas] = useState();

  const [mascotas, setMascotas] = useState([]);

  // Estados para UI
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAtencionAbierto, setModalAtencionAbierto] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [citaActual, setCitaActual] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [nombreVet, setNombreVet] = useState("");

  const navigate = useNavigate();

  // Funciones auxiliares
  const mostrarNotificacion = (mensaje, tipo) => {
    console.log(`${tipo}: ${mensaje}`);
    // Implementación real podría usar react-toastify o similar
  };

  const actualizarEstadisticas = (tipo) => {
    console.log(`Estadística actualizada: ${tipo}`);
    // Implementación real conectaría con backend
  };

  // Cargar mascotas desde el backend al montar el componente
  useEffect(() => {
    fetch("http://localhost:3001/api/mascotas")
      .then(res => res.json())
      .then(data => setMascotas(data))
      .catch(err => console.error("Error al cargar mascotas:", err));
  }, []);

  // Filtrar mascotas según búsqueda
  const mascotasFiltrados = mascotas.filter(mascota =>
    mascota.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    mascota.raza?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función para atender citas
  const atenderCita = async (id) => {
    try {
      const citaAtendida = citas?.find(cita => cita.id === id);
      
      if (!citaAtendida) {
        mostrarNotificacion('No se encontró la cita', 'error');
        return;
      }

      await ChangeStateAppointment(id)
      
      setModalAbierto(false);
      setModalAtencionAbierto(true);
      setCitaActual(citaAtendida);
      actualizarEstadisticas('citasAtendidas');
      mostrarNotificacion('Cita atendida con éxito', 'success');

    } catch (error) {
      mostrarNotificacion('Error al atender la cita', 'error');
    }
  };

  // Modifica la función para redirigir a nuevo historial con la mascota asignada
  const confirmarAtencion = (cita) => {
    console.log("Cita recibida:", cita);
    console.log("Mascotas disponibles:", mascotas);

    // Ajusta aquí según el campo correcto
    const mascota = mascotas.find(m => m.nombre === cita.mascota);
    console.log("Mascota encontrada:", mascota);

    const propietario = mascota
      ? `${mascota.nombre_propietario || ""} ${mascota.apellido_propietario || ""}`.trim()
      : cita.propietario || "";
    navigate(
      `/PanelVet/historial-clinico/nuevo/${mascota?.id || cita.cod_mas}`,
      { state: { mascota: { ...mascota, propietario }, fechaCita: cita.fecha } }
    );
  };

  // Función para cargar estadísticas desde el backend
  const cargarEstadisticas = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Llamadas individuales para mejor debugging
      const resMascotasTotales = await fetch('http://localhost:3001/api/mascotas-totales');
      const resCitasHoy = await fetch('http://localhost:3001/api/citas-hoy');
      const resConsultasPendientes = await fetch('http://localhost:3001/api/consultas-pendientes');

      // Verificar respuestas y parsear datos
      let mascotasTotales = 0;
      let citasHoy = 0;
      let consultasPendientes = 0;

      if (resMascotasTotales.ok) {
        const dataMascotasTotales = await resMascotasTotales.json();
        mascotasTotales = dataMascotasTotales.total || 0;
      }

      if (resCitasHoy.ok) {
        const dataCitasHoy = await resCitasHoy.json();
        citasHoy = dataCitasHoy.total || 0;
      }

      if (resConsultasPendientes.ok) {
        const dataConsultasPendientes = await resConsultasPendientes.json();
        consultasPendientes = dataConsultasPendientes.total || 0;
      }

      // Actualizar el estado con los datos del backend
      const nuevosdatos = {
        mascotasTotales,
        citasHoy,
        consultasPendientes
      };
      setDatos(nuevosdatos);

    } catch (error) {
      setError(`Error al cargar las estadísticas: ${error.message}`);
      // Valores por defecto en caso de error
      setDatos({
        mascotasTotales: 0,
        citasHoy: 0,
        consultasPendientes: 0
      });
    } finally {
      setCargando(false);
    }
  };

  const getCitasCompPen = () => {
    fetch("http://localhost:3001/api/citas-pendientes/REALIZADA")
      .then((res) => res.json())
      .then((data) => {
        setCitasCompletadas(data);
      })
      .catch(() => {});
    cargarEstadisticas()
  }

  const GetAppointment = async () => {
    fetch("http://localhost:3001/api/citas")
      .then((res) => res.json())
      .then((data) => {
        setCitas(data);
      })
      .catch(() => {});
  }

  const ChangeStateAppointment = async (cod) => {
    try {
      const mod = await fetch(`http://localhost:3001/api/citas/${cod}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: 'REALIZADA',
        }),
      });
  
      if (!mod.ok) {
        throw new Error(`Error en la respuesta: ${mod.status}`);
      }
  
      const data = await mod.json();
      cargarEstadisticas();
      GetAppointment()
    } catch (error) {
      // Puedes agregar manejo de error aquí si lo deseas
    }
  };
  

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    cargarEstadisticas();
    getCitasCompPen()
    GetAppointment()
  }, []);

  // Cargar nombre del veterinario
  useEffect(() => {
    fetch("http://localhost:3001/api/veterinarios/2") // Cambia el 2 por el ID real del veterinario
      .then(res => res.json())
      .then(data => setNombreVet(data.nombre + " " + data.apellido));
  }, []);

  // Función para recargar estadísticas manualmente
  const recargarEstadisticas = () => {
    cargarEstadisticas();
  };

  return (
    <>
      {/* Estados de carga y error */}
      {cargando && (
        <div className="inicioVet-loadingOverlay">
          <div className="inicioVet-loadingMessage">Cargando estadísticas...</div>
        </div>
      )}
      
      {error && (
        <div className="inicioVet-errorAlert">
          {error}
          <button 
            onClick={recargarEstadisticas}
            style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Contenido principal */}
      <div className="inicioVet-container">
        <div className="inicioVet-header">
          <h1 className="inicioVet-title">
            Bienvenido, Dr. {nombreVet || "Veterinario"}
          </h1>
          <p className="inicioVet-subtitle">Aquí tienes un resumen de tu día</p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="inicioVet-summaryGrid">
          <div className="inicioVet-summaryCard">
            <div className="inicioVet-cardContent">
              <div className="inicioVet-summaryCardInner">
                <div className="inicioVet-summaryIcon inicioVet-iconBlue">
                  <Calendar className="inicioVet-icon" />
                </div>
                <div>
                  <div className="inicioVet-summaryLabel">Citas hoy</div>
                  <div className="inicioVet-summaryValue">
                    {citas?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="inicioVet-summaryCard">
            <div className="inicioVet-cardContent">
              <div className="inicioVet-summaryCardInner">
                <div className="inicioVet-summaryIcon inicioVet-iconGreen">
                  <PawPrint className="inicioVet-icon" />
                </div>
                <div>
                  <div className="inicioVet-summaryLabel">Mascotas totales</div>
                  <div className="inicioVet-summaryValue">
                    {cargando ? '...' : datos.mascotasTotales}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="inicioVet-summaryCard">
            <div className="inicioVet-cardContent">
              <div className="inicioVet-summaryCardInner">
                <div className="inicioVet-summaryIcon inicioVet-iconPurple">
                  <FileText className="inicioVet-icon" />
                </div>
                <div>
                  <div className="inicioVet-summaryLabel">Consultas Completas</div>
                  <div className="inicioVet-summaryValue">
                    {citasCompletadas?.total || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="inicioVet-mainGrid">
          {/* Citas de hoy */}
          <div className="inicioVet-appointmentsSection">
            <div className="inicioVet-card">
              <div className="inicioVet-cardHeader">
                <h3 className="inicioVet-cardTitle">Citas de hoy</h3>
                <Link to="/PanelVet/gestion-citas" className="inicioVet-link">
                  Ver todas <ChevronRight className="inicioVet-linkIcon" />
                </Link>
              </div>
              <div className="inicioVet-cardContent">
                <div className="inicioVet-appointmentsList">
                  {citas?.map((cita) => (
                    <div 
                      key={cita.id} 
                      className={`inicioVet-appointmentCard ${cita.estado === 'atendido' ? 'inicioVet-cardGray' : cita.tipoMascota === 'Perro' ? 'inicioVet-cardBlue' : 'inicioVet-cardGreen'}`}
                    >
                      <div className="inicioVet-appointmentContent">
                        <div className="inicioVet-appointmentInfo">
                          <div className={`inicioVet-appointmentIconContainer ${cita.estado === 'atendido' ? 'inicioVet-iconGray' : cita.tipoMascota === 'Perro' ? 'inicioVet-iconBlue' : 'inicioVet-iconGreen'}`}>
                            <Clock className="inicioVet-iconSmall" />
                          </div>
                          <div>
                            <div className="inicioVet-appointmentTitle">{`${cita.hora} - ${cita.mascota} (${cita.servicio})`}</div>
                            <div className="inicioVet-appointmentText">{cita.tipo}</div>
                            <div className="inicioVet-appointmentText">Propietario: {cita.propietario}</div>
                          </div>
                        </div>
                        <div className="inicioVet-appointmentActions">
                          <button 
                            className={`inicioVet-button inicioVet-buttonSmall ${cita.estado?.toLowerCase() === 'realizada' ? 'inicioVet-buttonDisabled' : 'inicioVet-buttonSuccess'}`}
                            onClick={() => confirmarAtencion(cita)}
                            disabled={cita.estado?.toLowerCase() === 'realizada'}
                          >
                            {cita.estado?.toLowerCase() === 'pendiente' ? 'Atender' : 'Atendido'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mascotas recientes */}
          <div className="inicioVet-patientsSection">
            <div className="inicioVet-card">
              <div className="inicioVet-cardHeader">
                <div className="inicioVet-cardHeaderContent">
                  <h3 className="inicioVet-cardTitle">Mascotas recientes</h3>
                  <div className="inicioVet-searchContainer">
                    <div className="inicioVet-searchWrapper">
                      <Search className="inicioVet-searchIcon" />
                      <input
                        type="text"
                        placeholder="Buscar..."
                        className="inicioVet-searchInput"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                    </div>
                    <Link to="mascotas" className="inicioVet-link">
                      Ver todos <ChevronRight className="inicioVet-linkIcon" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="inicioVet-cardContent">
                <div className="inicioVet-patientsList">
                  {mascotasFiltrados.map((mascota) => (
                    <div key={mascota.id} className="inicioVet-patientItem">
                      <div className="inicioVet-patientIcon">
                        <PawPrint className="inicioVet-iconMedium" />
                      </div>
                      <div className="inicioVet-patientDetails">
                        <div className="inicioVet-patientName">{mascota.nombre}</div>
                        <div className="inicioVet-patientInfo">
                          {mascota.raza}, {mascota.edad} años
                        </div>
                      </div>
                      <Link to={`/PanelVet/historial-clinico/${mascota.id}`} className="inicioVet-patientLink">
                        Historial
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {modalAbierto && (
        <div className="inicioVet-modalOverlay">
          <div className="inicioVet-modal">
            <div className="inicioVet-modalContent">
              <h3 className="inicioVet-modalTitle">Confirmar atención</h3>
              <p className="inicioVet-modalText">¿Atender a {citaSeleccionada?.mascota} ({citaSeleccionada?.raza})?</p>
              <p className="inicioVet-modalText">Propietario: {citaSeleccionada?.propietario}</p>
              <p className="inicioVet-modalText">Motivo: {citaSeleccionada?.tipo}</p>
              <div className="inicioVet-modalActions">
                <button 
                  className="inicioVet-button inicioVet-buttonOutline" 
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="inicioVet-button inicioVet-buttonPrimary" 
                  onClick={() => atenderCita(citaSeleccionada.id)}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de atención en curso */}
      {modalAtencionAbierto && citaActual && (
        <div className="inicioVet-modalOverlay">
          <div className="inicioVet-modal">
            <div className="inicioVet-modalContent">
              <h3 className="inicioVet-modalTitle">Atención en curso</h3>
              <p className="inicioVet-modalText">Atendiendo a {citaActual.mascota}</p>
              <p className="inicioVet-modalText">Propietario: {citaActual.propietario}</p>
              <p className="inicioVet-modalText">Motivo: {citaActual.tipo}</p>
              <div className="inicioVet-modalActions">
                <button 
                  className="inicioVet-button inicioVet-buttonPrimary" 
                  onClick={() => setModalAtencionAbierto(false)}
                >
                  Finalizar atención
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}