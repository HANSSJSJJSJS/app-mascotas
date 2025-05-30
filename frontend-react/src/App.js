import React from 'react';
import MainRoutes from './routes/MainRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <MainRoutes />
        {/* <ModuloAdministradores /> */}
      </AuthProvider>
    </div>
  );
}

export default App;