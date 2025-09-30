/**
 * Daily Inspiration section:
 * - Centered title (heart icon + "Daily Inspiration")
 * - Quote box (718x77) from Quotable (motivational tags)
 * - Centered "New quote" button with an icon
 */
import React from "react";
import { FaHeart, FaSyncAlt } from "react-icons/fa";
import useInspiration from "../hooks/useInspiration";
import QuoteCard from "./QuoteCard";
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
          <QuoteCard quote={quote} loading={loading} />
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