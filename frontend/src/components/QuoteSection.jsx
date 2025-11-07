import React, { useEffect, useState } from 'react';
import '../styles/QuoteSection.css';

const QuoteSection = ({ quote, onNewQuote, isLoading }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Refresh quote automatically every 15 seconds
    const interval = setInterval(() => {
      onNewQuote();
    }, 15000);

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, [onNewQuote]);

  const handleNew = () => {
    if (!isLoading) onNewQuote();
  };

  const handleCopy = async () => {
    const text = quote ? `"${quote.text}" — ${quote.author || 'Unknown'}` : 'Stay focused and productive!';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      // fallback: select and prompt (very rare in modern browsers)
      setCopied(false);
    }
  };

  return (
    <div className="quote-section" aria-live="polite">
      <div className="quote-section__content">
        {isLoading ? (
          <p className="quote-section__text">Loading inspirational quote…</p>
        ) : (
          <>
            <p className="quote-section__text">
              {quote ? `"${quote.text}"` : 'Stay focused and productive! 🌟'}
            </p>

            {quote && quote.author && (
              <div className="quote-section__meta">
                <div className="quote-section__avatar" aria-hidden>
                  {quote.author
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <p className="quote-section__author">— {quote.author}</p>
              </div>
            )}

            <div className="quote-section__controls">
              <button
                className="quote-section__button"
                onClick={handleNew}
                aria-label="New quote"
                disabled={isLoading}
                title="Get a new quote"
              >
                New
              </button>

              <button
                className="quote-section__button quote-section__button--outline"
                onClick={handleCopy}
                aria-label="Copy quote"
                title="Copy quote"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuoteSection;
