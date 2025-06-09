"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Asegúrate que la ruta sea correcta
import Loading from '../index/Loading';
import { Link } from 'react-router-dom'; 

import { Users, Briefcase, Shield, Plus, Eye, TrendingUp, PawPrint, ChevronRight } from "lucide-react"
import "../../stylos/cssAdmin/Dashboard.css" // Asegúrate que la ruta sea correcta

const DashboardHome = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({ users: 0, roles: 0, services: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(response.data);
        setError('');
      } catch (err) {
        console.error("Error al obtener las estadísticas:", err);
        setError('No se pudieron cargar las estadísticas. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: "Total Usuarios",
      value: stats.users,
      icon: <Users size={24} />,
      color: "blue",
      trend: "+12%",
      subtitle: "vs mes anterior",
    },
    {
      title: "Servicios Activos",
      value: stats.services,
      icon: <Briefcase size={24} />,
      color: "purple",
      trend: "+5%",
      subtitle: "nuevos servicios",
    },
    {
      title: "Roles Definidos",
      value: stats.roles,
      icon: <Shield size={24} />,
      color: "green",
      trend: "0%",
      subtitle: "sin cambios",
    },
  ];

  // --- AQUÍ LA CORRECCIÓN ---
  // Actualizamos las rutas para que coincidan con MainRoutes.jsx
  const quickActions = [
    {
      title: "Registrar Usuario",
      description: "Agregar nuevo usuario al sistema",
      icon: <Plus size={20} />,
      color: "blue",
      href: "/admin/gestion-usuarios?tab=registrar", 
    },
    {
      title: "Ver Usuarios",
      description: "Lista completa de usuarios",
      icon: <Eye size={20} />,
      color: "green",
      href: "/admin/gestion-usuarios?tab=lista",
    },
    {
      title: "Crear Servicio",
      description: "Nuevo servicio veterinario",
      icon: <Plus size={20} />,
      color: "purple",
      href: "/admin/gestion-servicios?tab=registrar", // Suponiendo que tienes una lógica similar para servicios
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <PawPrint size={32} />
            </div>
            <div className="header-text">
              <h1>Bienvenido, {usuario?.nombre || 'Administrador'}</h1>
              <p>Gestiona eficientemente el sistema veterinario PET MOYBE</p>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="stats-section">
        <div className="stats-grid">
          {statsData.map((stat, index) => (
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

      <div className="dashboard-card quick-actions-container">
        <div className="card-header">
          <div className="card-title">
            <h2>Acciones Rápidas</h2>
            <p>Operaciones frecuentes del sistema</p>
          </div>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href} className={`action-card ${action.color}`}>
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">
                <ChevronRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardHome;