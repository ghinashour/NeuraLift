// src/components/PostCard.js
import React, { useState } from "react";
import ReplyCard from "./ReplyCard";
import { FaHeart, FaRegComment } from "react-icons/fa";
import "../../styles/Collaborate.css";

export default function PostCard({ post, onReply, onLikesChange }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [showReplies, setShowReplies] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleLike = () => {
    const newLiked = !liked;
    const newCount = newLiked ? likes + 1 : Math.max(0, likes - 1);
    setLiked(newLiked);
    setLikes(newCount);
    onLikesChange(post.id, newCount);
  };

  const submitReply = () => {
    if (!replyText.trim()) return;
    const newReply = {
      id: "r" + Date.now(),
      name: "You",
      avatar: null,
      date: new Date().toISOString(),
      text: replyText.trim(),
      likes: 0,
    };
    onReply(post.id, newReply);
    setReplyText("");
    setShowReplies(true);
    setReplyMode(false);
  };

  return (
    <article className="post-card">
      <header className="post-header">
        <div className="left">
          <div className="avatar">{post.avatar || post.name?.[0]}</div>
          <div className="meta">
            <div className="name">{post.name}</div>
          </div>
        </div>
        <div className="post-date">{new Date(post.date).toLocaleString()}</div>
      </header>

      <div className="post-body">
        <p className="post-content">{post.content}</p>
      </div>

      <footer className="post-footer">
        <div
          className="view-replies"
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? "Hide replies" : `View replies (${post.replies.length})`}
        </div>

        <div className="post-actions">
          <button
            className={`icon-action like-btn ${liked ? "liked" : ""}`}
            onClick={handleLike}
          >
            <FaHeart /> <span className="action-count">{likes}</span>
          </button>

          <button
            className="icon-action reply-btn"
            onClick={() => setReplyMode(!replyMode)}
          >
            <FaRegComment /> <span className="action-count">{post.replies.length}</span>
          </button>
        </div>
      </footer>

      {showReplies &&
        post.replies.map((reply) => <ReplyCard key={reply.id} reply={reply} />)}

      {replyMode && (
        <div className="reply-input-row">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button className="btn-reply" onClick={submitReply}>
            Reply
          </button>
        </div>
      )}
    </article>
  );
}