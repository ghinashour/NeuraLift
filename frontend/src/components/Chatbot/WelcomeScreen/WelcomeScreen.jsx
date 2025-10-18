import React from 'react';
import './WelcomeScreen.css';
import logo from './image.png'; // Add your image import

const WelcomeScreen = ({ onStartChat, suggestedTopics }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="bot-avatar-large">
          <div className="avatar-ring-outer">
            <div className="avatar-ring-inner">
              <img src={logo} alt="Neuralift" className="bot-image" />
            </div>
          </div>
          <div className="status-indicator"></div>
        </div>
        <h1 className="brand-name">NEURALIFT</h1>
        <p className="welcome-message">Where should we begin?</p>
      </div>
      
      {suggestedTopics && suggestedTopics.length > 0 && (
        <div className="suggested-topics">
          {suggestedTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onStartChat(topic.text)}
              className="topic-button"
            >
              {topic.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;