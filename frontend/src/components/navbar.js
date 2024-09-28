import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './navbar.css';
import logo from '../scamlogocircle.jpg'; // Import the logo image

function Navbar() {
  const [isActive, setIsActive] = useState(false); // State for toggling menu

  const toggleMenu = () => {
    setIsActive(!isActive); // Toggle active state
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Brand Logo" className="logo-img" style={{width:"10%",height:"10%"}} /> 
          <span className="logo-text"><strong>ScamAggregator</strong></span> {/* Add the text next to the logo */}
        </Link>
        <div className="menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/report" className="nav-link">Report a Scam</Link>
          <Link to="/review" className="nav-link">Website Review</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>
        <div className="search-login">
          <input type="text" className="search-bar" placeholder="Search" />
          <Link to="/login" className="login-btn">Login/Signup</Link>
        </div>
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
