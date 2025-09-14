import React from 'react';
import '../styles/StatsDisplay.css';

const StatsDisplay = ({ completedSessions, streak, minutes }) => {
  return (
    <div className="stats-display">
      <div className="stats-display__item">
        <div className="stats-display__number stats-display__number--blue">
          {completedSessions}
        </div>
        <div className="stats-display__label">Sessions</div>
      </div>

      <div className="stats-display__item">
        <div className="stats-display__number stats-display__number--green">
          {streak}
        </div>
        <div className="stats-display__label">Streak</div>
      </div>

      <div className="stats-display__item">
        <div className="stats-display__number stats-display__number--purple">
          {minutes}
        </div>
        <div className="stats-display__label">Minutes</div>
      </div>
    </div>
  );
};

export default StatsDisplay;
