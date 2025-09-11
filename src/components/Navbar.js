import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbarStyle.css';

function Navbar({ isNavOpen, toggleNav }) { // Receive isNavOpen and toggleNav as props
  return (
    <nav className={`navbar ${isNavOpen ? 'navbar--open' : ''}`}>
      <div className="navbar-toggle" onClick={toggleNav}> {/* Hamburger menu button */}
        <div className="hamburger"></div>
        <div className="hamburger"></div>
        <div className="hamburger"></div>
      </div>
      <div className="navbar-header">
        <h3>Navigation</h3>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end onClick={toggleNav}> {/* Close nav on link click */}
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" onClick={toggleNav}>
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/resume" onClick={toggleNav}>
            Resume
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;