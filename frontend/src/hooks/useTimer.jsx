import { useState, useEffect, useRef } from 'react';

export const useTimer = () => {
  // Modes
  const MODES = {
    FOCUS: { name: 'Focus', duration: 25 * 60 },
    SHORT_BREAK: { name: 'Short Break', duration: 5 * 60 },
    LONG_BREAK: { name: 'Long Break', duration: 15 * 60 },
  };

  // State
  const [mode, setMode] = useState(MODES.FOCUS.name);
  const [time, setTime] = useState(MODES.FOCUS.duration);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready'); // 'Ready', 'Focusing', 'Break'
  const [completedSessions, setCompletedSessions] = useState(0);
  const [streak, setStreak] = useState(0);

  // Ref to store interval ID
  const intervalRef = useRef(null);

  // Start timer
  const startTimer = () => {
    if (intervalRef.current) return; // Prevent multiple intervals
    setIsActive(true);
    setStatus(mode === MODES.FOCUS.name ? 'Focusing' : 'Break');

    intervalRef.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          handleSessionEnd(); // move to next session
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Pause timer
  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsActive(false);
  };

  // Reset timer
  const resetTimer = () => {
    pauseTimer();
    switch (mode) {
      case MODES.FOCUS.name:
        setTime(MODES.FOCUS.duration);
        setStatus('Ready');
        break;
      case MODES.SHORT_BREAK.name:
        setTime(MODES.SHORT_BREAK.duration);
        setStatus('Break');
        break;
      case MODES.LONG_BREAK.name:
        setTime(MODES.LONG_BREAK.duration);
        setStatus('Break');
        break;
      default:
        setTime(MODES.FOCUS.duration);
        setStatus('Ready');
    }
  };

  // Skip current session
  const skipSession = () => {
    pauseTimer();
    handleSessionEnd();
  };

  // Handle switching between sessions
  const handleSessionEnd = () => {
    if (mode === MODES.FOCUS.name) {
      setCompletedSessions(prev => prev + 1);
      setStreak(prev => prev + 1);
      // Choose short or long break based on completed sessions
      if ((completedSessions + 1) % 4 === 0) {
        setMode(MODES.LONG_BREAK.name);
        setTime(MODES.LONG_BREAK.duration);
      } else {
        setMode(MODES.SHORT_BREAK.name);
        setTime(MODES.SHORT_BREAK.duration);
      }
      setStatus('Break');
    } else {
      // After break, go back to focus
      setMode(MODES.FOCUS.name);
      setTime(MODES.FOCUS.duration);
      setStatus('Focusing');
    }
    setIsActive(false); // paused by default
  };

  // Change mode manually
  const changeMode = (newMode) => {
    pauseTimer();
    setMode(newMode);
    switch (newMode) {
      case MODES.FOCUS.name:
        setTime(MODES.FOCUS.duration);
        setStatus('Ready');
        break;
      case MODES.SHORT_BREAK.name:
        setTime(MODES.SHORT_BREAK.duration);
        setStatus('Break');
        break;
      case MODES.LONG_BREAK.name:
        setTime(MODES.LONG_BREAK.duration);
        setStatus('Break');
        break;
      default:
        setTime(MODES.FOCUS.duration);
        setStatus('Ready');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return {
    time,
    isActive,
    mode,
    status,
    completedSessions,
    streak,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    setMode: changeMode,
  };
};
