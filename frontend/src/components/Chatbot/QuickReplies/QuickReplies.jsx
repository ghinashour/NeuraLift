import React from 'react';
import './QuickReplies.css';

const QuickReplies = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="quick-replies">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          onClick={() => onSelect(suggestion.text)}
          className="quick-reply-button"
        >
          {suggestion.text}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
