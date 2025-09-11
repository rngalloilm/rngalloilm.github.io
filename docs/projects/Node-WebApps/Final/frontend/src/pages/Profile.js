import React, { useState, useEffect } from 'react';
import SidebarMenu from './SidebarMenuComponent';
import api from '../js/APIClient';
import '../styles/profileStyle.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getCurrentUser()
      .then(data => setUser(data))
      .catch(err => {
        console.error('Error fetching user:', err);
        setError('Failed to load user data.');
      });
  }, []);

  if (error) {
    return (
      <div className="profile-page-wrapper">
        <SidebarMenu />
        <section className="profile-section">
          <p className="profile-error">{error}</p>
        </section>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page-wrapper">
        <SidebarMenu />
        <section className="profile-section">
          <p>Loading...</p>
        </section>
      </div>
    );
  }

  const balance = parseFloat(user.balance) || 0;

  return (
    <div className="profile-page-wrapper">
    <SidebarMenu />
    <section className="profile-section">
      <div className="profile-container">
        {/* Header + avatar side‑by‑side */}
        <div className="profile-header">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="profile-avatar header-avatar"
            />
          )}
          <h2>My Profile</h2>
        </div>

        {/* Card with the details only */}
        <div className="profile-card">
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Last Name:</strong> {user.lastName}</p>
          <p><strong>Username:</strong> {user.username}</p>
        </div>
      </div>
    </section>
  </div>
  );
}

export default Profile;
