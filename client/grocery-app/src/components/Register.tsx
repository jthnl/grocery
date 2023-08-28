// Register Page - New User Registration
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import '../styles/Form.css';

function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    // TODO: Add error handling validation checks and messages in the server.
    if (password !== rePassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await authApi.register({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });
      navigate('/login');
    } catch (err) {
      setError('An error occurred while signing up.');
    }
  };

  return (
    <div className="form-container">
      <div className="form-form">
        <h1 className="form-heading">Sign Up</h1>
        <div className="form-row">
          <input
            className="form-input"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="form-input"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <input
          className="form-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="form-input"
          type="password"
          placeholder="Re-enter Password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />
        <button className="form-button" onClick={handleSignup}>
          Sign Up
        </button>
        <p className="form-error">{error}</p>
        <Link className="form-link" to="/login">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default Register;
