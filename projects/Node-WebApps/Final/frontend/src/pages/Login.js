import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/signInStyle.css";
import api from '../js/APIClient';

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const username = event.target.username.value;
    const password = event.target.password.value;

    if (!username || !password) {
      setError("Please enter both username and password.");
      setLoading(false);
      return;
    }

    // Call the login function from APIClient
    api.logIn(username, password)
      .then(response => {
        console.log("Login successful:", response);
        setLoading(false);
        // On successful login, navigate to the dashboard
        navigate('/dashboard');
      })
      .catch(err => {
        console.error("Login failed:", err);
        setError("Invalid Username or Password");
        setLoading(false);
      });
  };

  return (
    <div className="login-page">
      <main className="login-container">
        <section className="login-title">
          <h2>Sign In With Username</h2>
        </section>
        {error && <div className="alert alert-danger">{error}</div>}
        <section className="login-form-container">
          <form className="login-form" onSubmit={handleSignIn}>
            <input 
              type="text" 
              id="username" 
              name="username" 
              placeholder="Username" 
              disabled={loading} 
            />
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Password" 
              disabled={loading} 
            />
            <label htmlFor="submit">
              {loading ? 'Signing In...' : 'Sign In'}
            </label>
            <input 
              type="submit" 
              id="submit" 
              name="submit" 
              disabled={loading} 
            />
          </form>
        </section>
        <section className="login-new-user-container">
          <button 
            className="login-new-user" 
            onClick={() => navigate("/registration")} 
            disabled={loading}
          >
            Need an account?
          </button>
        </section>
        <section className="login-policies">
          <p>
            <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Login;
