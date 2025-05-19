import React from 'react';
import Header from '../index/Header';
import Footer from '../index/Footer';

const LayoutPublico = ({ children }) => {
  return (
    <div className="layout-publico">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutPublico;