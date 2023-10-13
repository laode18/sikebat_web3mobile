/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faHome, faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import withAuth from './authMiddleware'

// eslint-disable-next-line react/prop-types
const Footer = ({ handleMenuClick }) => {
  const [activeMenu, setActiveMenu] = useState('menu1'); // Mengatur menu pertama sebagai active menu

  const handleMenuClickWithActive = (menuName) => {
    setActiveMenu(menuName);
    handleMenuClick(menuName);
  };

  return (
    <footer className="footer" style={{ backgroundColor: '#e6a769' }}>
    <nav className="navigation" style={{ display: 'flex' }}>
        <a
        href="#"
        className={`nav-link ${activeMenu === 'menu1' ? 'active' : ''}`}
        onClick={() => handleMenuClickWithActive('menu1')}
        style={{ fontSize: '28px', marginRight: '20px' }}
        >
        <FontAwesomeIcon icon={faHome} />
        </a>
        <a
        href="#1"
        className={`nav-link ${activeMenu === 'menu2' ? 'active' : ''}`}
        onClick={() => handleMenuClickWithActive('menu2')}
        style={{ fontSize: '28px', marginRight: '20px' }}
        >
        <FontAwesomeIcon icon={faFile} />
        </a>
        <a
        href="#2"
        className={`nav-link ${activeMenu === 'menu3' ? 'active' : ''}`}
        onClick={() => handleMenuClickWithActive('menu3')}
        style={{ fontSize: '28px', marginRight: '20px' }}
        >
        <FontAwesomeIcon icon={faMessage} />
        </a>
        <a
        href="#3"
        className={`nav-link ${activeMenu === 'menu4' ? 'active' : ''}`}
        onClick={() => handleMenuClickWithActive('menu4')}
        style={{ fontSize: '28px', marginRight: '20px' }}
        >
        <FontAwesomeIcon icon={faUser} />
        </a>
    </nav>
    </footer>
  );
};

export default withAuth(['user'])(Footer)
