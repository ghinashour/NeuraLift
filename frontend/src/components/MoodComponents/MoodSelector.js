// components/MoodSelector.js
import React from 'react';

const MoodSelector = ({ selectedMood, onMoodChange }) => {
  const moods = [
    { value: 'excellent', label: 'Excellent', emoji: '😄' },
    { value: 'good', label: 'Good', emoji: '😊' },
    { value: 'okay', label: 'Okay', emoji: '😐' },
    { value: 'poor', label: 'Poor', emoji: '😕' },
    { value: 'terrible', label: 'Terrible', emoji: '😢' }
  ];

  return (
    <div className="mood-selector">
      <div className="mood-options">
        {moods.map(mood => (
          <button
            key={mood.value}
            className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`}
            onClick={() => onMoodChange(mood.value)}
            aria-label={mood.label}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;