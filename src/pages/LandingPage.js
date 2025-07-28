import React from 'react';
import '../styles/landingStyle.css';
import '../styles/style.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to My Portfolio</h1>
      <p className="landing-subtitle">
        This site showcases a collection of my coding projects from various computer science courses.
      </p>
      <p className="landing-description">
        Use the navigation bar on the left to explore the different projects. 
        The "Projects" page contains an interactive file viewer for browsing the source code of each project directly in your browser.
      </p>
    </div>
  );
}

export default LandingPage;