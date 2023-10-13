import React from 'react';
import { useNavigate } from 'react-router-dom';
import withAuth from './authMiddleware';

const About = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Perform sign-out logic here
    // For now, we'll just simulate a sign-out by redirecting back to the login page
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome to Home Bro & Sister</h2>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default withAuth(About);
