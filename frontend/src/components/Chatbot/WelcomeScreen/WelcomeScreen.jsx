import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';

const LandingMark = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 2C10 7 6 9 6 15a8 8 0 0 0 16 0c0-6-4-8-8-13Z" fill="#8E7FB8" />
    <path d="M14 6v16M14 12l-5-3M14 12l5-3M14 17l-4-2M14 17l4-2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const EXAMPLES = [
  'Help me focus for 25 minutes',
  'I feel stressed — quick reset?',
  'Better sleep habits?',
  'Plan my day calmly',
];

const Typewriter = ({ texts = [], speed = 36 }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (index >= texts.length) return;
    const timeout = setTimeout(() => setSubIndex((p) => p + 1), speed);
    return () => clearTimeout(timeout);
  }, [subIndex, index, texts, speed]);

  useEffect(() => {
    if (texts[index] && subIndex > texts[index].length) {
      const next = setTimeout(() => {
        setIndex((p) => p + 1);
        setSubIndex(0);
      }, 900);
      return () => clearTimeout(next);
    }
  }, [subIndex, index, texts]);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(t);
  }, []);

  const text = texts[index] ? texts[index].slice(0, subIndex) : texts[texts.length - 1] || '';
  return (
    <span className="typewriter">
      {text}
      <span className={`cursor ${blink ? 'blink' : ''}`}>|</span>
    </span>
  );
};

const WelcomeScreen = ({ onStartChat }) => {
  const navigate = useNavigate();
  const go = (preset) => {
    onStartChat?.(preset);
    navigate('/Chatbot', preset ? { state: { preset } } : undefined);
  };

  return (
    <div className="nl-page assistant-welcome-page">
      <div className="nl-hero">
        <div className="nl-hero-copy">
          <p className="nl-eyebrow">AI Assistant</p>
          <h1 className="nl-title">
            A calmer mind, <em>clearer focus</em>.
          </h1>
          <p className="nl-lede">
            Your NeuraLift companion for focus plans, stress resets, sleep tips and everyday planning.
          </p>
        </div>
        <p className="nl-hero-quote">“Small calm steps, every day.”</p>
      </div>

      <div className="welcome-card" role="region" aria-label="Welcome to Neuralift assistant">
        <div className="welcome-card__left">
          <div className="bot-avatar-large" aria-hidden>
            <div className="avatar-ring-outer">
              <div className="avatar-ring-inner">
                <LandingMark size={46} />
              </div>
            </div>
            <div className="status-indicator" aria-hidden />
          </div>
          <div className="brand-block">
            <h2 className="welcome-brand-name">Neuralift</h2>
            <p className="welcome-subtitle">Your friendly productivity assistant</p>
            <span className="live-badge"><span className="live-dot" />Live AI · Groq</span>
          </div>
        </div>

        <div className="welcome-card__right">
          <p className="welcome-message lead">
            <Typewriter texts={['Hi — what can I help you with today?', 'I can help you focus, plan, and unwind.']} />
          </p>

          <div className="quick-actions">
            {EXAMPLES.map((ex) => (
              <button key={ex} className="action-chip" onClick={() => go(ex)}>
                {ex}
              </button>
            ))}
          </div>

          <div className="welcome-cta">
            <button className="start-chat-btn primary" onClick={() => go()}>
              Start chatting →
            </button>
            <button className="start-chat-btn secondary" onClick={() => go()}>
              Explore examples
            </button>
          </div>

          <div className="hint-text">Tip: Try a short prompt like “Help me focus for 25 minutes”</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
