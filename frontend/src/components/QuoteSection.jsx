import React, { useEffect } from 'react';
import '../styles/QuoteSection.css';

const QuoteSection = ({ quote, onNewQuote, isLoading }) => {
  useEffect(() => {
    // Generate a new quote every 30 seconds
    const interval = setInterval(() => {
      onNewQuote();
    }, 15000); // 15000 ms = 15 seconds

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, [onNewQuote]);

  return (
    <div className="quote-section">
      <div className="quote-section__content">
        {isLoading ? (
          <p className="quote-section__text">Loading inspirational quote...</p>
        ) : (
          <>
            <p className="quote-section__text">
              {quote ? `"${quote.text}"` : "Stay focused and productive! 🌟"}
            </p>
            {quote && quote.author && (
              <p className="quote-section__author">— {quote.author}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuoteSection;
