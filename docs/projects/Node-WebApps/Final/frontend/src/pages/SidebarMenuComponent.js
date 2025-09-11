import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../js/APIClient';
import '../styles/SidebarMenuComponent.css';

function SidebarMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api.getCurrentUser().then(userData => {
      setCurrentUser(userData);
    })
    .catch(error => {
      console.error('Failed to get user data.');
      setCurrentUser(null);
    });
  }, []);

  // Function to determine the navbar title based on the route
  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/report') return 'Report';
    if (location.pathname === '/income') return 'Income';
    if (location.pathname === '/expense') return 'Expense';
    if (location.pathname === '/profile') return 'Profile';
    return 'App'; // Default title
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Logout handler
  const handleLogout = () => {
    api.logOut()
      .then(() => {
        navigate('/login');
      })
      .catch(err => {
        console.error("Logout failed:", err);
        navigate('/login');
      });
  };
  
  const handleLinkClick = () => {
    // Close the menu when a link is clicked
    setIsMenuOpen(false);
  };

  const navigateToProfile = (e) => {
    //e.prevent.default();
    navigate('/profile');
  };

  return (
    <div className="sidebar">
      {/* HEADER BAR */}
      <nav className="sidebar-navbar">
        <div className="sidebar-navbar-brand">
          <a className="sidebar-navbar-item" onClick={toggleMenu}>
            <span className="sidebar-icon">
              <i className="fas fa-bars"></i>
            </span>
          </a>
          <h1 className="sidebar-navbar-title">{getPageTitle()}</h1>
        </div>
        {currentUser && (
          <a onClick={navigateToProfile} className="link-offset-2 link-underline link-underline-opacity-0" style={{ cursor: 'pointer' }}>
            <span className="greeting-text">Hello, {currentUser?.username}</span>
          </a>
        )}
      </nav>

      {/* SLIDING MENU */}
      <div className={`sidebar-menu ${isMenuOpen ? 'is-active' : ''}`}>
        <button className="sidebar-close-menu" onClick={toggleMenu}>✖</button>
        <ul>
          <li><Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link></li>
          <li><Link to="/report" onClick={handleLinkClick}>Report</Link></li>
          <li><Link to="/income" onClick={handleLinkClick}>Income</Link></li>
          <li><Link to="/expense" onClick={handleLinkClick}>Expense</Link></li>
          <li><Link to="/profile" onClick={handleLinkClick}>Profile</Link></li>
          <li><a onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a></li>
        </ul>
      </div>

      {/* BACKGROUND OVERLAY */}
      {isMenuOpen && <div className="sidebar-overlay is-active" onClick={toggleMenu}></div>}
    </div>
  );
}

export default SidebarMenu;