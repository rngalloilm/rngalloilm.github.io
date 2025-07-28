import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* All routes inside here will share the Layout (Navbar + content area) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;