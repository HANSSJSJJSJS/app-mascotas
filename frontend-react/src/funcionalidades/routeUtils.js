// src/funcionalidades/routeUtils.js

/**
 * Codifica una cadena de texto a Base64 URL-safe.
 * @param {string} str La cadena a codificar (ej. "mascotas").
 * @returns {string} La cadena codificada.
 */
export const encodePath = (str) => {
  return btoa(String(str));
};

/**
 * Decodifica una cadena en Base64 a texto plano.
 * @param {string} encodedStr La cadena codificada.
 * @returns {string | null} La cadena decodificada o null si hay un error.
 */
export const decodePath = (encodedStr) => {
  try {
    return atob(String(encodedStr));
  } catch (e) {
    console.error("Error al decodificar la ruta:", e);
    return null;
  }
};