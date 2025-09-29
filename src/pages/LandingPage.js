import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-tagline">
          Get honest feedback. No filters. No pressure.
        </h1>
        <p className="landing-subheading">
          Create your personal feedback link and share it with your network.
        </p>
        <Link to="/register" className="create-link-button">
          Create My Feedback Link
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;