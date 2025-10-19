import React from 'react';
import Button from './Button';
import '../styles/QuoteSection.css';

const QuoteSection = ({ quote, onNewQuote, isLoading }) => {
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

      <Button
        onClick={onNewQuote}
        variant="quote"
        className="quote-section__refresh"
        disabled={isLoading}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.67737 2.00631 11.2874 2.66082 12.4933 3.82667L14 5.33333" stroke="#2B2F3B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 2V5.33333H10.6667" stroke="#2B2F3B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 8C14 9.5913 13.3679 11.1174 12.2426 12.2426C11.1174 13.3679 9.5913 14 8 14C6.32263 13.9937 4.71265 13.3392 3.50667 12.1733L2 10.6667" stroke="#2B2F3B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.33333 10.6667H2V14.0001" stroke="#2B2F3B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
   New Quote!
      </Button>
    </div>
  );
};

export default QuoteSection;
