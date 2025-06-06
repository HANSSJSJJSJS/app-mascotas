import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../CompAdmin/Sidebar';
import Topbar from '../CompAdmin/Topbar';
import '../../stylos/cssAdmin/AdminDashboard.css'; // Asegúrate que esta ruta es correcta

const LayoutAdmin = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main-content">
        <Topbar />
        <main className="admin-page-content">
          {/* Las rutas hijas (DashboardHome, GestionUsuarios, etc.) se renderizarán aquí */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;