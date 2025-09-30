import React from 'react';
import { useTimer } from '../../hooks/useTimer';
import { useQuotes } from '../../hooks/useQuotes';
import TimerDisplay from '../../components/TimerDisplay';
import TimerControls from '../../components/TimerControls';
import ModeSelector from '../../components/ModeSelector';
import StatsDisplay from '../../components/StatsDisplay';
import QuoteSection from '../../components/QuoteSection';
import '../../styles/FocusTimer.css';

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
          <h1 className="pomodoro-timer__title">Pomodoro Focus Timer</h1>
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
    </div>
  );
};

export default PomodoroTimer;
