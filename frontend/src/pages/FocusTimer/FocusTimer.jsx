import React from 'react';
import { useTimer } from '../../hooks/useTimer';
import { useQuotes } from '../../hooks/useQuotes';
import TimerDisplay from '../../components/TimerDisplay';
import TimerControls from '../../components/TimerControls';
import ModeSelector from '../../components/ModeSelector';
import StatsDisplay from '../../components/StatsDisplay';
import QuoteSection from '../../components/QuoteSection';
import '../../styles/FocusTimer.css';
import AILogo from '../../components/AiLogo';

const PomodoroTimer = () => {
  const {
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
    setMode
  } = useTimer();

  const { quote, fetchNewQuote, isLoading } = useQuotes();

  const modes = [
    { name: 'Focus', duration: 25 * 60, color: '#3b82f6' },
    { name: 'Short Break', duration: 5 * 60, color: '#10b981' },
    { name: 'Long Break', duration: 15 * 60, color: '#8b5cf6' }
  ];

  return (
    <div className="pomodoro-timer">
      <div className="pomodoro-timer__header">
        <div className="pomodoro-timer__header-content">
          <h1 className="pomodoro-timer__title">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33331 1.66663H11.6666" stroke="#3b82f6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 11.6666L12.5 9.16663" stroke="#3b82f6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9.99998 18.3333C13.6819 18.3333 16.6666 15.3486 16.6666 11.6667C16.6666 7.98477 13.6819 5 9.99998 5C6.31808 5 3.33331 7.98477 3.33331 11.6667C3.33331 15.3486 6.31808 18.3333 9.99998 18.3333Z" stroke="#3b82f6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Pomodoro Focus Timer</h1>
          <p>Stay focused with the proven Pomodoro technique</p>
        </div>
      </div>

      <div className="pomodoro-timer__tabs">
        <ModeSelector
          selectedMode={mode}
          onModeChange={setMode}
          modes={modes}
        />
      </div>

      <div className="pomodoro-timer__main">
        <div className="pomodoro-timer__card">
          <TimerDisplay
            time={time}
            status={status}
            mode={mode}
            isActive={isActive}
          />

          <TimerControls
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetTimer}
            onSkip={skipSession}
            isActive={isActive}
            status={status}
          />

          <StatsDisplay
            completedSessions={completedSessions}
            streak={streak}
            minutes={Math.floor(completedSessions * 25)}
          />
        </div>
      </div>

      <div className="pomodoro-timer__footer">
        <QuoteSection
          quote={quote}
          onNewQuote={fetchNewQuote}
          isLoading={isLoading}
        />
      </div>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <AILogo />
      </div>
    </div>

  );
};

export default PomodoroTimer;
