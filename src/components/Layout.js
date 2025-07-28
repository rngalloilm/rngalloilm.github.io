import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="content-area">
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
}

export default Layout;