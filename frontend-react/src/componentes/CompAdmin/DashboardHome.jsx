"use client"

import { Users, Briefcase, Shield, Plus, Eye, TrendingUp, PawPrint, ChevronRight } from "lucide-react"
import "../../stylos/cssAdmin/Dashboard.css"

const DashboardHome = () => {
  const stats = [
    {
      title: "Total Usuarios",
      value: "1,234",
      icon: <Users size={24} />,
      color: "blue",
      trend: "+12%",
      subtitle: "vs mes anterior",
    },
    {
      title: "Servicios Activos",
      value: "28",
      icon: <Briefcase size={24} />,
      color: "purple",
      trend: "+5%",
      subtitle: "nuevos servicios",
    },
    {
      title: "Roles Activos",
      value: "8",
      icon: <Shield size={24} />,
      color: "green",
      trend: "0%",
      subtitle: "sin cambios",
    },
  ]

  const quickActions = [
    {
      title: "Registrar Usuario",
      description: "Agregar nuevo usuario al sistema",
      icon: <Plus size={20} />,
      color: "blue",
      href: "/gestion-usuarios?tab=registrar",
    },
    {
      title: "Ver Usuarios",
      description: "Lista completa de usuarios",
      icon: <Eye size={20} />,
      color: "green",
      href: "/gestion-usuarios?tab=lista",
    },
    {
      title: "Crear Servicio",
      description: "Nuevo servicio veterinario",
      icon: <Plus size={20} />,
      color: "purple",
      href: "/gestion-servicios?tab=registrar",
    },
  ]

  return (
    <div className="dashboard-home">
      {/* Header mejorado */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <PawPrint size={32} />
            </div>
            <div className="header-text">
              <h1>Dashboard de Administrador</h1>
              <p>Gestiona eficientemente el sistema veterinario PET MOYBE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards mejoradas */}
      <div className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-header">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-trend">
                  <TrendingUp size={14} />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
                <span className="stat-subtitle">{stat.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones Rápidas - Centrada */}
      <div className="dashboard-card quick-actions-container">
        <div className="card-header">
          <div className="card-title">
            <h2>Acciones Rápidas</h2>
            <p>Operaciones frecuentes del sistema</p>
          </div>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <a key={index} href={action.href} className={`action-card ${action.color}`}>
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">
                <ChevronRight size={18} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
