import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/App.css';
import { MdFavorite } from "react-icons/md";

function Intro() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/contacts');  // Navigate to the contacts page
  };

  return (
    <div className="intro-container">
      <div className="intro-content">
        <h1 className="intro-title">Welcome to Contact Manager</h1>
        
        <div className="intro-description">
          <p>
            Easily manage all your contacts in one place. Add new contacts, 
            update existing ones, or remove those you no longer need.
          </p>
          
          <div className="intro-features">
            <div className="feature">
              <div className="feature-icon">📋</div>
              <h3>Organize</h3>
              <p>Keep all your contacts organized and accessible</p>
            </div>
            
            <div className="feature">
              <div >
              <img className="favorite-display" src='/favorite.png'/>
              </div>
              <h3>Favorite</h3>
              <p>Mark important contacts as favorites for quick access</p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Block</h3>
              <p>Block unwanted contacts with a single click</p>
            </div>
          </div>
        </div>
        
        <button className="get-started-btn" onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
}

export default Intro;