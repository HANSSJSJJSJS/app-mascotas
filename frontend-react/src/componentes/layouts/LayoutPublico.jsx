import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../index/Header';
import Footer from '../index/Footer';

const LayoutPublico = () => {
  return (
    <div className="layout-publico">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutPublico;