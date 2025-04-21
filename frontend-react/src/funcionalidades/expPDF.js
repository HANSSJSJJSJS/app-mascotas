import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportarPDF = (datos, nombreArchivo) => {
  const doc = new jsPDF();
  
  // Título
  doc.text('Lista de Usuarios', 14, 15);
  
  // Encabezados de tabla
  const headers = [['#', 'Nombres', 'Email', 'Rol']];
  
  // Datos de tabla
  const data = datos.map(usuario => [
    usuario.id,
    usuario.nombres,
    usuario.email,
    usuario.rol
  ]);
  
  // Generar tabla
  doc.autoTable({
    head: headers,
    body: data,
    startY: 20,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  doc.save(`${nombreArchivo}.pdf`);
};