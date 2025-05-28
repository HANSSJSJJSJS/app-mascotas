// src/funcionalidades/CerrarSesion.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useCerrarSesionAlRetroceder = () => {
 const navegar = useNavigate();

 const cerrarSesion = () => {
   // Limpiar datos de sesión
   sessionStorage.clear();
   localStorage.removeItem('userSession');
   
   // Redirigir al login
   navegar('/Login', { replace: true });
 };

 useEffect(() => {
   const manejarRetroceso = (evento) => {
     // Verificar si hay una sesión activa
     if (sessionStorage.getItem('userSession') || localStorage.getItem('userSession')) {
       cerrarSesion();
     }
   };

   // Agregar el listener del evento
   window.addEventListener('popstate', manejarRetroceso);
   
   // Limpiar el listener cuando el componente se desmonte
   return () => window.removeEventListener('popstate', manejarRetroceso);
 }, [navegar]);

 return { cerrarSesion };
};

// Exportar el hook
export default useCerrarSesionAlRetroceder;