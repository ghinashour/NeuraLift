import React, { useEffect, useRef, useState } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { useQuotes } from '../../hooks/useQuotes';
import { formatTime } from '../../hooks/timeFormatter';
import StatsDisplay from '../../components/StatsDisplay';
import QuoteSection from '../../components/QuoteSection';
import '../../styles/FocusTimer.css';
import AILogo from '../../components/AiLogo';
import {
  Timer,
  Coffee,
  Moon,
  Volume2,
  VolumeX,
  BarChart3,
  Maximize,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  ChevronDown,
} from 'lucide-react';

const MODE_SECONDS = {
  Focus: 25 * 60,
  'Short Break': 5 * 60,
  'Long Break': 15 * 60,
};

const MODE_META = [
  { name: 'Focus', Icon: Timer, sub: '25 minutes' },
  { name: 'Short Break', Icon: Coffee, sub: '5 minutes' },
  { name: 'Long Break', Icon: Moon, sub: '15 minutes' },
];

const SESSION_LABEL = {
  Focus: 'DEEP WORK',
  'Short Break': 'SHORT BREAK',
  'Long Break': 'LONG BREAK',
};

// Gentle completion chime (WebAudio, no assets needed)
function playChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.22, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.55);
    });
    setTimeout(() => ctx.close(), 1600);
  } catch {
    // Audio not available — stay silent
  }
}

const RING_SIZE = 300;
const RING_STROKE = 11;

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
    setMode,
  } = useTimer();

  const { quote, fetchNewQuote, isLoading } = useQuotes();

  const [soundOn, setSoundOn] = useState(true);
  const panelRef = useRef(null);
  const chimedRef = useRef(false);

  const total = MODE_SECONDS[mode] ?? MODE_SECONDS.Focus;
  const progress = Math.min(1, Math.max(0, (total - time) / total));

  // Chime once when a session naturally reaches zero
  useEffect(() => {
    if (time === 0 && !chimedRef.current) {
      chimedRef.current = true;
      if (soundOn) playChime();
    }
    if (time > 0) chimedRef.current = false;
  }, [time, soundOn]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      panelRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const scrollToStats = () => {
    document
      .getElementById('focus-stats')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const radius = (RING_SIZE - RING_STROKE * 2 - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const startLabel = isActive ? 'Pause' : status === 'Ready' ? 'Start Session' : 'Resume';

  return (
    <div className="ft-page">
      <section
        className="ft-screen"
        ref={panelRef}
        data-mode={mode}
        aria-label="Focus timer"
      >
        <header className="ft-head">
          <div className="ft-title">
            <span className="ft-title-icon" aria-hidden="true">
              <Timer size={19} strokeWidth={1.9} />
            </span>
            <h1>Focus Timer</h1>
          </div>
          <div className="ft-head-actions">
            <span className="ft-mode-wrap">
              <select
                className="ft-mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                aria-label="Timer mode"
              >
                <option value="Focus">Focus Mode</option>
                <option value="Short Break">Short Break</option>
                <option value="Long Break">Long Break</option>
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </span>
            <button
              type="button"
              className="ft-icon-btn"
              onClick={() => setSoundOn((v) => !v)}
              aria-label={soundOn ? 'Mute sounds' : 'Unmute sounds'}
              aria-pressed={soundOn}
              title={soundOn ? 'Mute sounds' : 'Unmute sounds'}
            >
              {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
            <button
              type="button"
              className="ft-icon-btn"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
              title="Fullscreen"
            >
              <Maximize size={15} />
            </button>
            <button
              type="button"
              className="ft-icon-btn"
              onClick={scrollToStats}
              aria-label="View session stats"
              title="Stats"
            >
              <BarChart3 size={15} />
            </button>
          </div>
        </header>

        <div className="ft-ring-zone">
          <div className="ft-ring-wrap">
            <svg
              className="ft-ring"
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
              role="img"
              aria-label={`${formatTime(time)} remaining`}
            >
              <circle
                className="ft-ring__track"
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={radius}
              />
              <circle
                className="ft-ring__progress"
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={radius}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: circumference * (1 - progress),
                }}
              />
            </svg>
            <div className="ft-ring-center">
              <div className="ft-time">{formatTime(time)}</div>
              <div className="ft-status">{SESSION_LABEL[mode] ?? status.toUpperCase()}</div>
            </div>
          </div>

          <button
            type="button"
            className="ft-start"
            onClick={isActive ? pauseTimer : startTimer}
          >
            {isActive ? <Pause size={16} /> : <Play size={16} />}
            {startLabel}
          </button>

          <div className="ft-sub-actions">
            <button type="button" className="ft-ghost" onClick={resetTimer}>
              <RotateCcw size={13} />
              Reset
            </button>
            <button type="button" className="ft-ghost" onClick={skipSession}>
              <SkipForward size={13} />
              Skip
            </button>
          </div>
        </div>
      </section>

      <nav className="ft-modes" aria-label="Timer modes">
        {MODE_META.map(({ name, Icon, sub }) => (
          <button
            key={name}
            type="button"
            className={`ft-tab${mode === name ? ' ft-tab--active' : ''}`}
            onClick={() => setMode(name)}
            aria-pressed={mode === name}
          >
            <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
            <span className="ft-tab-name">{name}</span>
            <span className="ft-tab-sub">{sub}</span>
          </button>
        ))}
        <button
          type="button"
          className={`ft-tab${soundOn ? ' ft-tab--active' : ''}`}
          onClick={() => setSoundOn((v) => !v)}
          aria-pressed={soundOn}
          title="Toggle completion sounds"
        >
          {soundOn ? (
            <Volume2 size={21} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <VolumeX size={21} strokeWidth={1.8} aria-hidden="true" />
          )}
          <span className="ft-tab-name">Sounds</span>
          <span className="ft-tab-sub">Ambient audio</span>
        </button>
      </nav>

      <section className="ft-card ft-quote" aria-label="Daily inspiration">
        <QuoteSection
          quote={quote}
          onNewQuote={fetchNewQuote}
          isLoading={isLoading}
        />
      </section>

      <section className="ft-card" id="focus-stats" aria-label="Session statistics">
        <StatsDisplay
          completedSessions={completedSessions}
          streak={streak}
          minutes={Math.floor(completedSessions * 25)}
        />
      </section>

      <div
        className="focus-ai"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '16px',
          zIndex: 1000,
        }}
      >
        <AILogo />
      </div>
    </div>
  );
};

export default PomodoroTimer;
