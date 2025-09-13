import React from 'react';
import Button from './Button';
import '../styles//QuoteSection.css';

const QuoteSection = ({ quote, onNewQuote, isLoading }) => {
  return (
    <div className="quote-section">
      <div className="quote-section__text">
        {isLoading ? (
          "Loading inspirational quote..."
        ) : (
          quote ? `"${quote.text}"` : "Stay focused and productive! 🌟"
        )}
        {quote && quote.author && (
          <div className="quote-section__author">
            — {quote.author}
          </div>
        )}
      </div>
      
      <Button
        onClick={onNewQuote}
        variant="quote"
        className="quote-section__refresh"
        disabled={isLoading}
      >
        Generate a  New Quote!
      </Button>
    </div>
  );
};

export default QuoteSection;