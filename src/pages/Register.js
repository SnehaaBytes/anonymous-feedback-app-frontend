import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Form.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    uniqueId: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { username, password, uniqueId } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // --- THE CHANGE IS HERE ---
      const res = await axios.post('https://anonymous-feedback-app-backend.onrender.com/api/auth/register', formData);
      
      setMessage(res.data.message);
      // Redirect to the login page after a successful registration
      navigate('/login');
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
        console.error(err.response.data);
      } else if (err.request) {
        setMessage('No response from server. Please check your internet connection.');
        console.error(err.request);
      } else {
        setMessage('Error: ' + err.message);
        console.error('Error', err.message);
      }
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Unique ID (for your feedback link)</label>
          <input
            type="text"
            name="uniqueId"
            value={uniqueId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
        {message && <p className="message">{message}</p>}
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;