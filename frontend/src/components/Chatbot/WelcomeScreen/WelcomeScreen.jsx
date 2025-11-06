import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';
import logo from './image.png'; // image for avatar

const WelcomeScreen = ({ onStartChat, suggestedTopics = [] }) => {
  const navigate = useNavigate();

  const handleStart = (preset) => {
    if (preset) onStartChat?.(preset);
    // navigate to the in-app assistant conversation
    navigate('/Chatbot');
  };

 


  // simple Typewriter component (small, local)
  const Typewriter = ({ texts = [], speed = 40, loop = false }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [blink, setBlink] = useState(true);

    useEffect(() => {
      if (index >= texts.length) {
        if (loop) {
          setIndex(0);
        } else {
          return;
        }
      }
      const timeout = setTimeout(() => {
        setSubIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }, [subIndex, index, texts, speed, loop]);

    useEffect(() => {
      if (texts[index] && subIndex > texts[index].length) {
        const next = setTimeout(() => {
          setIndex((prev) => prev + 1);
          setSubIndex(0);
        }, 900);
        return () => clearTimeout(next);
      }
    }, [subIndex, index, texts]);

    useEffect(() => {
      const blinkInterval = setInterval(() => setBlink((b) => !b), 500);
      return () => clearInterval(blinkInterval);
    }, []);

    const text = texts[index] ? texts[index].slice(0, subIndex) : texts[texts.length - 1] || '';

    return (
      <span className="typewriter" aria-hidden={false}>
        {text}
        <span className={`cursor ${blink ? 'blink' : ''}`}>|</span>
      </span>
    );
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-card" role="region" aria-label="Welcome to Neuralift assistant">
        <div className="welcome-card__left">
          <div className="bot-avatar-large" aria-hidden>
            <div className="avatar-ring-outer">
              <div className="avatar-ring-inner">
                <img src={logo} alt="Neuralift assistant" className="bot-image" />
              </div>
            </div>
            <div className="status-indicator" aria-hidden></div>
          </div>
          <div className="brand-block">
            <h1 className="welcome-brand-name">Neuralift</h1>
            <p className="welcome-subtitle">Your friendly productivity assistant</p>
          </div>
        </div>

        <div className="welcome-card__right">
          <p className="welcome-message lead"><Typewriter texts={["Hi — what can I help you with today?", "I can help you focus, plan, and learn." ]} speed={36} loop={false} /></p>

       

          <div className="welcome-cta">
            <button className="start-chat-btn secondary" onClick={() => navigate('/Chatbot')}>Explore examples</button>
          </div>

          <div className="hint-text">Tip: Try a short prompt like “Help me focus for 25 minutes”</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;