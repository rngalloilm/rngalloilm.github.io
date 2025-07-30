import React from 'react';
import '../styles/landingStyle.css';
import '../styles/style.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to My Portfolio</h1>
      <p className="landing-subtitle">
        This site is my sandbox and portfolio.
      </p>
      <p className="landing-description">
        Use the navigation bar on the left to explore. <br></br> <strong>Projects</strong> showcases raw code from my coding projects.
      </p>
    </div>
  );
}

export default LandingPage;