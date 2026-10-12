import React from 'react';
import './QuickReplies.css';
import { useSuggestions } from '../../../hooks/useSuggestions';

const QuickReplies = ({ onSelect, disabled }) => {
  const { suggestions } = useSuggestions();

  return (
    <div className="quick-replies" role="group" aria-label="Suggested prompts">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="quick-reply-btn"
          disabled={disabled}
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
