import React from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onStartChat, suggestedTopics }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="bot-avatar-large">
          <div className="avatar-ring-outer">
            <div className="avatar-ring-inner">
              <svg className="bot-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h2v2H7v-2zm8 0h2v2h-2v-2zm-4 0h2v2h-2v-2z"/>
              </svg>
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