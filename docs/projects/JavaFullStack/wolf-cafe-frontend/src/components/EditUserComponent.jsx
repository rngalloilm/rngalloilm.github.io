import React, { useState, useEffect } from 'react';
import { getUserById, editUser } from '../services/AuthService';
import { useNavigate, useParams } from 'react-router-dom';

const EditUserComponent = () => {
  const { id } = useParams(); // Get user id from URL
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({}); // State for input validation errors
  const [errorMessage, setErrorMessage] = useState(null); // State for general error messages
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent editing admin user (user ID 1)
    if (id === '1') {
      setErrorMessage("Editing the admin user is not allowed.");
      // Option to redirect back to the user list after a delay
      // setTimeout(() => navigate('/view-users'), 3000);
    } else {
      fetchUser();
    }
  }, [id]);

  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await getUserById(id);
      setUser({
        name: response.data.name || '',
        username: response.data.username || '',
        email: response.data.email || '',
        password: '', // Leave password empty
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to load user data.";
      setErrorMessage(message);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear previous errors for this field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validate inputs before submitting
  const validate = () => {
    const newErrors = {};
    if (!user.name || user.name.trim() === '') {
      newErrors.name = 'Name is required.';
    }
    if (!user.username || user.username.trim() === '') {
      newErrors.username = 'Username is required.';
    }
    if (!user.email || user.email.trim() === '') {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = 'Email is invalid.';
    }
    // Password is optional; no validation unless provided
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessage(null);

    // Validate inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare data to send
    const userData = {
      name: user.name,
      username: user.username,
      email: user.email,
    };

    if (user.password && user.password.trim() !== '') {
      userData.password = user.password;
    }

    try {
      await editUser(id, userData);
      navigate('/view-users');
    } catch (error) {
      console.error("Error updating user:", error);
      // Extract error message from the response
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to update user.";
      setErrorMessage(message);
    }
  };

  // If editing admin user is not allowed, display an error message and redirect
  if (id === '1') {
    return (
      <div className="container mt-3">
        <h2 className="text-center">Edit User</h2>
        <div className="alert alert-danger">{errorMessage}</div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/view-users')}
          style={{ marginTop: '10px' }}
        >
          Back to User List
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <h2 className="text-center">Edit User</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            name="username"
            value={user.username}
            onChange={handleChange}
            required
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">
            Password (leave blank to keep unchanged)
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update User
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/view-users')}
          style={{ marginLeft: '10px' }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditUserComponent;
