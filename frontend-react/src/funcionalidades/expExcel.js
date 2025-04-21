import * as XLSX from 'xlsx';

export const exportarExcel = (datos, nombreArchivo) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet(datos);
  XLSX.utils.book_append_sheet(libro, hoja, 'Datos');
  XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
};