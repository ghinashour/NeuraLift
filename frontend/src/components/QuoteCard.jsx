/**
 * Presentational quote card (content + author).
 * Centers text both vertically and horizontally.
 */
import React from "react";
import "../styles/Dashboard.css";

export default function QuoteCard({ quote, loading }) {
  if (loading) {
    return (
      <div className="quote-card">
        <p className="quote-loading">Loading...</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="quote-card">
        <p className="quote-loading">No quote available</p>
      </div>
    );
  }

  return (
    <div className="quote-card">
      <p className="quote-text">“{quote.content}”</p>
      {quote.author ? <p className="quote-author">— {quote.author}</p> : null}
    </div>
  );
}