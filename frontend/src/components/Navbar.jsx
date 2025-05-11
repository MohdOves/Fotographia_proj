import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo192.png" alt="Logo" />
        <span className="navbar-brand">Fotographiya</span>
      </div>
      <div className="navbar-links">
        <Link to="/signin" className={location.pathname === '/signin' ? 'active' : ''}>Sign In</Link>
        <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar; 