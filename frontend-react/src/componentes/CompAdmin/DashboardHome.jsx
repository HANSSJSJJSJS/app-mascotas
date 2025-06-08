import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Users, Shield, Briefcase } from 'react-feather';
import '../../stylos/cssAdmin/Dashboard.css';
import Loading from '../index/Loading';

// Componente para una tarjeta de estadística individual
const StatCard = ({ icon, label, value, color }) => {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-card-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-card-info">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  );
};

// Componente principal del Dashboard
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-home">
      <h1 className="dashboard-title">Bienvenido, {usuario?.nombre_completo || 'Administrador'}</h1>
      <p className="dashboard-subtitle">Aquí tienes un resumen de la actividad en la plataforma.</p>
      
      {error && <p className="error-message">{error}</p>}

      <div className="stats-container">
        <StatCard 
          icon={<Users size={24} color="white" />} 
          label="Usuarios Registrados" 
          value={stats.users}
          color="#3498db" // Azul
        />
        <StatCard 
          icon={<Shield size={24} color="white" />} 
          label="Roles Definidos" 
          value={stats.roles}
          color="#2ecc71" // Verde
        />
        <StatCard 
          icon={<Briefcase size={24} color="white" />} 
          label="Servicios Ofrecidos" 
          value={stats.services}
          color="#e67e22" // Naranja
        />
      </div>

      {/* Aquí podrías agregar más componentes en el futuro, como gráficos o listas de actividad reciente */}
      <div className="dashboard-widgets">
        <div className="widget">
            <h2>Actividad Reciente</h2>
            <p>Próximamente...</p>
        </div>
        <div className="widget">
            <h2>Gráficos</h2>
            <p>Próximamente...</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
