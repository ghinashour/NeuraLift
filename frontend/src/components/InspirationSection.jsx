import React from "react";
import { FaHeart, FaSyncAlt } from "react-icons/fa";
import useInspiration from "../hooks/useInspiration";
import "../styles/Dashboard.css";

export default function InspirationSection() {
  const { quote, loading, fetchQuote } = useInspiration(60000);

  return (
    <section className="inspiration-section">
      <div className="inspiration-box">
        <div className="inspiration-header">
          <FaHeart className="heart-icon" />
          <h3 className="inspiration-title">Daily Inspiration</h3>
        </div>

        <div className="quote-wrapper">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="quote-text">{quote.text}</p>
              <p className="quote-author">— {quote.author}</p>
            </>
          )}
        </div>

        <div className="quote-actions">
          <button className="new-quote-btn" onClick={fetchQuote} type="button">
            <FaSyncAlt className="new-quote-ico" />
            <span>New Quote</span>
          </button>
        </div>
      </div>
    </section>
  );
}
