import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../js/APIClient';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Attempt to get the current user
    api.getCurrentUser()
      .then(user => {
        setAuthenticated(true);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Not authenticated:", err);
        setAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;
