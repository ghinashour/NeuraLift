import React from 'react';
import { formatTime } from '../hooks/timeFormatter';
import '../styles/TimerDisplay.css';

const TimerDisplay = ({ time, status, mode, isActive }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  const getModeDuration = (mode) => {
    switch (mode) {
      case 'Focus': return 25 * 60;
      case 'Short Break': return 5 * 60;
      case 'Long Break': return 15 * 60;
      default: return 25 * 60;
    }
  };

  const totalTime = getModeDuration(mode);
  const progress = ((totalTime - time) / totalTime) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getStatusColor = () => {
    if (status === 'Focusing') return '#5F7355';
    if (status === 'Break') return '#9A6B2E';
    return '#6757A3';
  };

  const getStatusBackground = () => {
    if (status === 'Focusing') return '#E6EBE0';
    if (status === 'Break') return '#F5E8CF';
    return '#EFEAF7';
  };

  return (
    <div className="timer-display">
      <div className="timer-display__header">
        
        <span 
          className="timer-display__status"
          style={{
            backgroundColor: getStatusBackground(),
            color: getStatusColor()
          }}
        >
          {status}
        </span>
      </div>

      <div className="timer-display__circle-container">
        <svg className="timer-display__circle" width="200" height="200" viewBox="0 0 200 200">
          <circle
            className="timer-display__background"
            cx="100"
            cy="100"
            r={radius}
          />
          <circle
            className="timer-display__progress"
            cx="100"
            cy="100"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset
            }}
          />
        </svg>
        <div className="timer-display__content">
          <div className="timer-display__time">{formatTime(time)}</div>
          <div className="timer-display__mode-label">{mode}</div>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
