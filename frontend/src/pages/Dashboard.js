import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      // Redirect to login if no token is found
      if (!token || !user) {
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };

        // --- THE CHANGE IS HERE ---
        const res = await axios.get('https://anonymous-feedback-app-backend.onrender.com/api/feedback', config);
        setFeedbacks(res.data);
        setMessage('Feedback loaded successfully.');
      } catch (err) {
        setMessage('Error fetching feedback. Please log in again.');
        console.error(err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };
    fetchFeedback();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const uniqueId = JSON.parse(localStorage.getItem('user'))?.uniqueId;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Your Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="dashboard-link">
        <p>Your unique feedback link:</p>
        <div className="link-box">
          <span>{window.location.origin}/feedback/{uniqueId}</span>
        </div>
      </div>
      {message && <p className="status-message">{message}</p>}
      <div className="feedback-grid">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div key={feedback._id} className="feedback-card">
              <p>{feedback.text}</p>
              <small>Received on: {new Date(feedback.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p>You have not received any feedback yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;