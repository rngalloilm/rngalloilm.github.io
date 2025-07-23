import React, { useState } from 'react';
import "../styles/registrationStyle.css";
import { useNavigate } from 'react-router-dom';
import api from '../js/APIClient';

function Registration() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const username = event.target.username.value;
    const password = event.target.password.value;
    const repeatPass = event.target.repeatPass.value;

    // --- Client-side validation ---
    let valid = true;
    let validationError = '';
    if (!firstName || !lastName || !username || !password || !repeatPass) {
      valid = false;
      validationError = "Please fill in all fields.";
    } else if (password.length < 8) {
      valid = false;
      validationError = "Password must be at least 8 characters.";
    } else if (password !== repeatPass) {
      valid = false;
      validationError = "Passwords do not match.";
    }

    if (!valid) {
      setError(validationError);
      setLoading(false);
      return; // Stop submission if client validation fails
    }
    // --- End Client-side validation ---


    api.register(firstName, lastName, username, password, repeatPass)
      .then(response => {
        console.log("Registration successful:", response);
        setLoading(false);
        navigate("/login");
      })
      .catch(err => {
        setLoading(false);
        console.error("Could not register user: ", err);
        // Display the error message from the API response if available
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("Registration failed. Please try again later.");
        }
        // Simple approach based on HTTPClient:
        setError(err.message || "Registration failed. Please try again later.");
      });
  };

  const handleExistingUser = () => {
    navigate("/login");
  };

  return (
    <div className="registration-page">
      <main className="registration-container">
        <section className="registration-title">
          <h2>Create An Account</h2>
        </section>

        {/* Display Error Messages */}
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1em' }}>{error}</p>}

        <section className="registration-form-container">
          {/* Disable form elements while loading */}
          <form className="registration-form" onSubmit={handleSignUp}>
            <input type="text" id="firstName" name="firstName" placeholder="First Name" required disabled={loading} />
            <input type="text" id="lastName" name="lastName" placeholder="Last Name" required disabled={loading} />
            <input type="text" id="username" name="username" placeholder="Username" required disabled={loading} />
            <input type="password" id="password" name="password" placeholder="Password (min 8 chars)" required disabled={loading} />
            <input type="password" id="repeatPass" name="repeatPass" placeholder="Repeat Password" required disabled={loading} />
            <label htmlFor="submit" style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Registering...' : 'Sign Up'}
            </label>
            <input type="submit" id="submit" name="submit" disabled={loading} />
          </form>
        </section>
        {/* ... rest of the component ... */}
         <section className="registration-policies">
          <p>By signing up, you agree with</p>
          <p><a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
        </section>
        <section className="registration-existing-user">
          <button className="registration-existing-user-button" onClick={handleExistingUser} disabled={loading}>Already have an account?</button>
        </section>
      </main>
    </div>
  );
}

export default Registration;