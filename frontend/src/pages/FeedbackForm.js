import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Form.css';

const FeedbackForm = () => {
  const { uniqueId } = useParams();
  const [recipient, setRecipient] = useState(null);
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        // --- THE FIRST CHANGE IS HERE ---
        const res = await axios.get(`https://anonymous-feedback-app-backend.onrender.com/api/auth/${uniqueId}`);
        setRecipient(res.data);
      } catch (err) {
        setMessage('User not found. Please check the link.');
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipient();
  }, [uniqueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipient) {
      setMessage('Cannot send feedback. User not found.');
      setError(true);
      return;
    }

    setSubmitting(true);
    setMessage('');
    setError(false);

    try {
      // --- THE SECOND CHANGE IS HERE ---
      const res = await axios.post('https://anonymous-feedback-app-backend.onrender.com/api/feedback/submit', {
        recipient: recipient._id,
        text,
      });
      setMessage(res.data?.message || 'Feedback submitted successfully!');
      setText('');
      setError(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit feedback.');
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-container">
        <p className="message error">{message}</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Send feedback to {recipient.username}</h2>

        <div className="form-group">
          <label>Your anonymous feedback:</label>
          <textarea
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="5"
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Anonymously'}
        </button>

        {message && (
          <p className={`message ${error ? 'error' : ''}`}>{message}</p>
        )}
      </form>
    </div>
  );
};

export default FeedbackForm;
