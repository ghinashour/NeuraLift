import React from 'react';
import '../styles/ModeSelector.css'

const ModeSelector = ({ selectedMode, onModeChange, modes }) => {
  return (
    <div className="mode-selector">
      {modes.map((mode) => (
        <button
          key={mode.name}
          className={`mode-selector__tab ${
            selectedMode === mode.name ? 'mode-selector__tab--active' : ''
          }`}
          onClick={() => onModeChange(mode.name)}
        >
          {mode.name}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;