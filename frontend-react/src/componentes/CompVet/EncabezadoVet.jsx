import { Menu, Search, Bell, LogOut, ChevronDown, ChevronUp, CheckCircle, Loader2, Mail, X, User } from 'lucide-react'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import "../../stylos/cssVet/EncabezadoVet.css"
import { useAuth } from '../../context/AuthContext'; 

const EncabezadoVet = ({ onToggleMenu, isSidebarOpen }) => { 
  return (
    <div className={`encabezado-container-vet ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <header className="encabezado-vet">
          <button className="boton-menu-vet" onClick={onToggleMenu}>
            <Menu size={20} />
            <span>MENU</span>
          </button>

        <div className="header-right">
          <LogoutComponent />
        </div>
      </header>
    </div>
  )
}

const LogoutComponent = () => {
  const [expanded, setExpanded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const dropdownRef = useRef(null)
  const { usuario, loading, logout } = useAuth(); 

  const userInitials = useMemo(() => {
    if (loading || !usuario) return 'JD'; 
    const nombreInicial = usuario.nombre ? usuario.nombre.charAt(0) : '';
    const apellidoInicial = usuario.apellido ? usuario.apellido.charAt(0) : '';
    return (nombreInicial + apellidoInicial).toUpperCase();
  }, [usuario, loading]);

  const fullName = useMemo(() => {
    if (loading || !usuario) return "Cargando...";
    const nombre = usuario.nombre || "Usuario";
    const apellido = usuario.apellido || "";
    return `${nombre} ${apellido}`.trim();
  }, [usuario, loading]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); 
      logout(); 
      setShowModal(false);
      setShowToast(true); 
      setTimeout(() => {
        window.location.href = '/Login'; 
      }, 1500);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);


  const closeToast = useCallback(() => {
    setShowToast(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="user-profile-loading">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (!usuario) {
    return null; 
  }

  return (
    <>
      <div className="user-profile" ref={dropdownRef}>
        <div className="user-avatar" onClick={() => setExpanded(!expanded)}>
          <span>{userInitials}</span>
        </div>
        <div className="user-name" onClick={() => setExpanded(!expanded)}>
          {fullName}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {expanded && (
          // CONTENIDO DEL DROPDOWN: MANTENEMOS SOLO LA ESTRUCTURA DESEADA
          <div className="dropdown-content header-dropdown">
            {/* Sección de cabecera con iniciales, nombre y rol */}
            <div className="dropdown-header">
              <div className="header-initials">
                {userInitials}
              </div>
              <div className="header-text">
                <div className="header-name">
                  {fullName}
                </div>
                <div className="header-role">{usuario.role || 'Veterinario'}</div> 
              </div>
            </div>

            {/* Sección de información con el correo electrónico */}
            <div className="dropdown-info">
              <div className="info-item">
                <Mail size={18} className="info-icon" />
                <span>{usuario.email || 'correo@ejemplo.com'}</span> 
              </div>
            </div>

            <div className="dropdown-actions"> {/* Un nuevo div para agrupar los botones */}
              <button className="dropdown-item" onClick={() => { /* Navegar a perfil de usuario */ setExpanded(false); }}>
                <User size={18} /> Mi Perfil {/* Usando el icono User para "Mi Perfil" */}
              </button>
              <button className="dropdown-item" onClick={() => setShowModal(true)}>
                <LogOut size={18} /> Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => !isLoggingOut && setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-icon">
                  <LogOut size={24} />
                </div>
                <h3>Cerrar sesión</h3>
                <p>¿Estás seguro de que quieres salir de tu cuenta?</p>
              </div>

              <div className="modal-user-info">
                <div className="modal-initials">
                  {userInitials}
                </div>
                <div>
                  <div className="modal-user-name">{fullName}</div>
                  <div className="modal-user-email">{usuario.email}</div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="cancel-button" 
                  disabled={isLoggingOut}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="confirm-logout-button"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Cerrando sesión...
                    </>
                  ) : (
                    "Sí, cerrar sesión"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {showToast && (
          <div className="toast-notification">
            <div className="toast-icon">
              <CheckCircle size={20} />
            </div>
            <div className="toast-content">
              <h4>Sesión finalizada</h4>
              <p>Has cerrado sesión correctamente</p>
            </div>
            <button onClick={closeToast} className="toast-close-button">
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default EncabezadoVet;