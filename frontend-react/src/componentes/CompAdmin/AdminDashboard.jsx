"use client"

import { useState, useEffect, useContext } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useAuth } from "../../context/AuthContext" 
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import "../../stylos/cssAdmin/AdminDashboard.css"

const AdminDashboard = () => {
  // --- Estados para el layout del dashboard 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // --- Lógica para el logout y navegación 
  const navigate = useNavigate()
  const { logout } = useAuth() 
  // --- useEffect para el manejo del tamaño de pantalla 
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setSidebarCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // --- useEffect para el manejo del botón de retroceso 
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault()

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas cerrar la sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8196eb',
        cancelButtonColor: '#1a2540',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'No, quedarme',
      }).then((result) => {
        if (result.isConfirmed) {
          logout()
          navigate('/login')
        } else {
          window.history.pushState(null, '', window.location.href)
        }
      })
    }

    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [navigate, logout])

  // --- Función para colapsar/mostrar el sidebar (tu código original) ---
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  return (
    <div className="admin-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileMenuOpen}
        closeMobileMenu={() => setMobileMenuOpen(false)}
      />
      <div
        className={`admin-content ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${isMobile && mobileMenuOpen ? "mobile-menu-open" : ""}`}
      >
        <Topbar
          toggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          mobileMenuOpen={mobileMenuOpen}
        />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard