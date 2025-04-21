import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children, rolPermitido }) => {
  const { usuario } = useAuth();

  // Si no hay usuario logueado, redirige a login
  if (!usuario) {
    return <Navigate to="/Login" replace />;
  }

  // Si se especificó un rol y el usuario no lo tiene
  if (rolPermitido && usuario.rol !== rolPermitido) {
    return <Navigate to="/Home" replace />; // o a una ruta de no autorizado
  }

  return children;
};

export default RutaProtegida;
