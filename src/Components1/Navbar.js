import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaParking } from 'react-icons/fa';

const Navbar = ({ toggleTheme }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    toggleTheme(newTheme); // Correctly pass the new theme here
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">PARK MATE <FaParking /></Link>
      </div>
      <div className="navbar-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <Link to="/Login">Login</Link>
        <button onClick={handleToggle} className="theme-toggle">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
