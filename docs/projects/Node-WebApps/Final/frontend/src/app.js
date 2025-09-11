import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import ExpensePage from './pages/ExpensePage';
import IncomePage from './pages/IncomePage';
import Profile from './pages/Profile';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        <Route path="/report" element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        } />
        <Route path="/income" element={
          <ProtectedRoute>
            <IncomePage />
          </ProtectedRoute>
        } />
        <Route path="/expense" element={
          <ProtectedRoute>
            <ExpensePage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        } />
        {/* Add more protected routes here */}
      </Routes>
    </Router>
  );
}

export default App;
