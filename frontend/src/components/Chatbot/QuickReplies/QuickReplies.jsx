import React from 'react';
import './QuickReplies.css';
import { useSuggestions } from '../../../hooks/useSuggestions';

const QuickReplies = ({ onSelect }) => {
  const { suggestions } = useSuggestions();

  return (
    <div className="quick-replies">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="quick-reply-btn"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;