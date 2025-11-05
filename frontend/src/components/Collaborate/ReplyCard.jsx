// src/components/ReplyCard.js
import React, { useState } from "react";
import "../../styles/Collaborate.css";
import { FaHeart } from "react-icons/fa";

export default function ReplyCard({ reply }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(typeof reply.likes === "number" ? reply.likes : 0);

  const handleLike = () => {
    const newLiked = !liked;
    const newCount = newLiked ? likes + 1 : Math.max(0, likes - 1);
    setLiked(newLiked);
    setLikes(newCount);
  };

  return (
    <div className="reply-card">
      <header className="reply-header">
        <div className="left">
          <div className="reply-avatar">
            {reply.avatar || (reply.name ? reply.name[0] : "?")}
          </div>
          <div className="reply-name">{reply.name}</div>
        </div>
        <div className="reply-date">
          {new Date(reply.date).toLocaleString()}
        </div>
      </header>

      <div className="reply-body">
        {reply.text || reply.content}
      </div>

      <footer className="reply-footer">
        <div className="reply-actions">
          <button
            className={`icon-action like-btn ${liked ? "liked" : ""}`}
            onClick={handleLike}
            aria-pressed={liked}
          >
            <FaHeart />
            <span className="action-count">{likes}</span>
          </button>
        </div>
      </footer>
    </div>
  );
}