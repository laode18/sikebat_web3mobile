/* eslint-disable prettier/prettier */
// Content.js
import React from 'react';
import Menu1 from './menu/Menu1';
import Menu2 from './menu/Menu2';
import Menu3 from './menu/Menu3';
import Menu4 from './menu/Menu4';
import withAuth from './authMiddleware'
import Suratkependudukan from './surat/suratkependudukan/Suratkependudukan';

// eslint-disable-next-line react/prop-types
const Content = ({ activeMenu }) => {
  let content;
  if (activeMenu === 'menu1') {
    content = <Menu1 />;
  } else if (activeMenu === 'menu2') {
    content = <Menu2 />;
  } else if (activeMenu === 'menu3') {
    content = <Menu3 />;
  } else if (activeMenu === 'menu4') {
    content = <Menu4 />;
  } else if (activeMenu === 'menu2') {
    content = <Suratkependudukan />;
  }

  return (
    <main className="content">
      {content}
    </main>
  );
};

export default withAuth(['user'])(Content)
