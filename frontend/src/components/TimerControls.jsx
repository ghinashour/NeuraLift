import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import '../styles/TimerControls.css';

const TimerControls = ({ onStart, onPause, onReset, onSkip, isActive, status }) => {
  const handleMainButton = () => {
    if (isActive) onPause();
    else onStart();
  };

  const getMainButtonText = () => {
    if (isActive) return 'Pause';
    if (status === 'Ready') return 'Start';
    return 'Resume';
  };

  return (
    <div className="timer-controls">
      <button
        onClick={handleMainButton}
        className="btn-primary timer-controls__main-button"
      >
        {isActive ? <Pause size={16} /> : <Play size={16} />}
        {getMainButtonText()}
      </button>

      <button
        onClick={onReset}
        className="btn-outline timer-controls__reset-button"
        aria-label="Reset timer"
      >
        <RotateCcw size={15} />
        Reset
      </button>

      <button
        onClick={onSkip}
        className="btn-outline timer-controls__skip-button"
        aria-label="Skip session"
      >
        <SkipForward size={15} />
        Skip
      </button>
    </div>
  );
};

export default TimerControls;
