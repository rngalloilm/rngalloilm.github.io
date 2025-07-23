import React from 'react';
import '../styles/landingStyle.css';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/registration");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <main className="landing">
      <div className="login-main">
        <section className="login-image">
          <div className="logo"></div>
          <div className="logo-container">
            <h1 className="header">WOLFPACK</h1>
            <h3 className="header">Budget Planner</h3>
          </div>
        </section>
        <section className="login-data">
          <button className="sign-up-button" onClick={handleSignUp}>
            Sign Up with Email
          </button>
          <a href="" onClick={handleLogin} className="link">
            Already have an account?
          </a>
          <p className="text">
            <a href="" className="link">Terms of Service</a> and{" "}
            <a href="" className="link">Privacy Policy</a>
          </p>
        </section>
      </div>
    </main>
  );
}

export default LandingPage;
