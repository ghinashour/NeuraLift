import React from 'react';
import Button from './Button';
import '../styles/TimerControls.css';

const TimerControls = ({ onStart, onPause, onReset, onSkip, isActive, status }) => {
  const handleMainButton = () => {
    if (isActive) onPause();
    else onStart();
  };

  const getMainButtonText = () => {
    if (isActive) return ' ⏸Pause';
    if (status === 'Ready') return '▶ Start';
    return '▶ Resume';
  };

  return (
    <div className="timer-controls">
      <Button
        onClick={handleMainButton}
        variant="primary"
        className="timer-controls__main-button"
      >
         {getMainButtonText()}
      </Button>

      <Button
        onClick={onReset}
        variant="secondary"
        className="timer-controls__reset-button"
      >
        ↻ Reset
      </Button>

      <Button
        onClick={onSkip}
        variant="secondary"
        className="timer-controls__skip-button"
      >
        ⏭ Skip
      </Button>
    </div>
  );
};

export default TimerControls;
