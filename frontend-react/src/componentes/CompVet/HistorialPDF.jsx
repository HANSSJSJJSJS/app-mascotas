import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos usando tu paleta de colores
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    color: '#000000', // var(--color1)
    backgroundColor: '#ffffff', // var(--white)
  },
  header: {
    borderBottom: '2px solid #8196eb', // var(--color4)
    paddingBottom: 15,
    marginBottom: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 24,
    color: '#1a2540', // var(--color2)
    marginBottom: 5,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 12,
    color: '#495a90', // var(--color3)
    marginTop: 5
  },
  date: {
    fontSize: 10,
    color: '#6c757d', // var(--gray-medium)
    textAlign: 'right'
  },
  section: {
    marginBottom: 20,
    fontSize: 12
  },
  sectionTitle: {
    fontSize: 16,
    color: '#495a90', // var(--color3)
    borderBottom: '1px solid #c2d8ff', // var(--color5)
    paddingBottom: 5,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 15,
    gap: 30
  },
  infoColumn: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start'
  },
  label: {
    fontWeight: 'bold',
    color: '#1a2540', // var(--color2)
    width: '35%'
  },
  value: {
    flex: 1
  },
  consultaBlock: {
    borderLeft: '3px solid #8196eb', // var(--color4)
    paddingLeft: 10,
    marginBottom: 15,
    pageBreakInside: 'avoid'
  },
  consultaHeader: {
    color: '#495a90', // var(--color3)
    fontSize: 12,
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  noConsultas: {
    fontStyle: 'italic',
    color: '#6c757d' // var(--gray-medium)
  },
  statusActive: {
    backgroundColor: '#28a745', // var(--success)
    color: 'white',
    padding: '2px 5px',
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold'
  },
  statusInactive: {
    backgroundColor: '#dc3545', // var(--danger)
    color: 'white',
    padding: '2px 5px',
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold'
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: '1px solid #c2d8ff', // var(--color5)
    fontSize: 9,
    color: '#6c757d', // var(--gray-medium)
    textAlign: 'center'
  }
});

const HistorialPDF = ({ historial }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Historial Clínico</Text>
          <Text style={styles.subtitle}>{historial.mascota?.nombre || 'Mascota'}</Text>
        </View>
        <Text style={styles.date}>Generado el: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Información de la mascota */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de la Mascota</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{historial.mascota?.nombre || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Especie:</Text>
              <Text style={styles.value}>{historial.mascota?.especie || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Raza:</Text>
              <Text style={styles.value}>{historial.mascota?.raza || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.row}>
              <Text style={styles.label}>Edad:</Text>
              <Text style={styles.value}>{historial.mascota?.edad ?? 'N/A'} años</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Peso:</Text>
              <Text style={styles.value}>{historial.mascota?.peso ?? 'N/A'} kg</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Información del propietario */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Propietario</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{historial.mascota?.propietario || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{historial.mascota?.telefono || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.row}>
              <Text style={styles.label}>Estado:</Text>
              <Text style={historial.activo ? styles.statusActive : styles.statusInactive}>
                {historial.activo ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha creación:</Text>
              <Text style={styles.value}>
                {historial.fechaCreacion ? new Date(historial.fechaCreacion).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Consultas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consultas ({historial.consultas?.length || 0})</Text>
        {historial.consultas?.length > 0 ? (
          historial.consultas.map((consulta, index) => (
            <View key={index} style={styles.consultaBlock}>
              <View style={styles.consultaHeader}>
                <Text>{new Date(consulta.fecha).toLocaleDateString()}</Text>
                <Text>{consulta.motivo}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Veterinario:</Text>
                <Text style={styles.value}>{consulta.veterinario}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Diagnóstico:</Text>
                <Text style={styles.value}>{consulta.diagnostico}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Tratamiento:</Text>
                <Text style={styles.value}>{consulta.tratamiento}</Text>
              </View>
              {consulta.observaciones && (
                <View style={styles.row}>
                  <Text style={styles.label}>Observaciones:</Text>
                  <Text style={styles.value}>{consulta.observaciones}</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noConsultas}>No hay consultas registradas.</Text>
        )}
      </View>

      {/* Pie de página */}
      <View style={styles.footer}>
        <Text>Documento generado automáticamente por el sistema de la clínica veterinaria</Text>
      </View>
    </Page>
  </Document>
);

export default HistorialPDF;