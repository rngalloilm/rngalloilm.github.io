import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  const [isNavOpen, setIsNavOpen] = useState(false); // State for mobile nav toggle

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Add/remove no-scroll class to body when nav is open/closed
  useEffect(() => {
    if (isNavOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    // Cleanup function to ensure class is removed on unmount
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isNavOpen]);

  return (
    <div className={`app-layout ${isNavOpen ? 'nav-open' : ''}`}>
      <Navbar isNavOpen={isNavOpen} toggleNav={toggleNav} /> {/* Pass state and toggle function */}
      <main className="content-area">
        {isNavOpen && <div className="overlay" onClick={toggleNav}></div>} {/* Overlay for mobile */}
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
}

export default Layout;