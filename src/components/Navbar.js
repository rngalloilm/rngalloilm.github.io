import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbarStyle.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-header">
        <h3>Navigation</h3>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects">
            Projects
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;