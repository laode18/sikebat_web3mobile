/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

const Layout = () => {
  const [activeMenu, setActiveMenu] = useState('menu1');

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div className="container">
      <Header />
      <Content activeMenu={activeMenu} />
      <Footer handleMenuClick={handleMenuClick} />
    </div>
  );
};

export default Layout;
