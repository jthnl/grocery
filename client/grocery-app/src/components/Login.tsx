// Login Page 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import '../styles/Form.css'; 

interface LoginProps {
  setUser: (user: string | null) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await authApi.login(email, password);
      setUser(email);
      navigate('/');
    } catch (err) {
      setError('An error occurred while logging in.');
    }
  };

  const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="form-container">
      <div className="form-form">
        <h1 className="form-heading">Grocery</h1>
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
          onKeyDown={handleEnterKeyPress}
        />
        <button className="form-button" onClick={handleLogin}>
          Sign In
        </button>
        <p className="form-error">{error}</p>
        <Link className="form-link" to="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;
