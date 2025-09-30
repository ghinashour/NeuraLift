// src/components/collaborate/PostCard.js
import React, { useState } from "react";
import "../../styles/Collaborate.css";
import ReplyCard from "./ReplyCard";
import { FaRegHeart, FaReply } from "react-icons/fa";
import usePosts from "../../hooks/usePosts";
import useUserData from "../../hooks/useUserData";

/**
 * Gradient post card; replies inside.
 * Clicking reply icon toggles a small inline reply form (handled in ReplyCard).
 */
export default function PostCard({ post }) {
  const [showReplies, setShowReplies] = useState(false);
  const { addReply, toggleLike } = usePosts();
  const { name, avatar } = useUserData();

  const onReply = (text) => {
    addReply(post.id, {
      id: "r-" + Date.now(),
      content: text,
      author: name,
      avatar,
      date: new Date().toISOString(),
    });
  };

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="user-left">
          <img className="avatar" src={post.avatar || "/avatar.png"} alt="avatar" />
          <div className="meta">
            <div className="username">{post.author}</div>
            <div className="post-time">{new Date(post.date).toLocaleString()}</div>
          </div>
        </div>
        <div className="post-date">{new Date(post.date).toLocaleDateString()}</div>
      </div>

      <div className="post-content">{post.content}</div>

      <div className="post-footer">
        <button className="view-replies" onClick={() => setShowReplies((s) => !s)}>
          {showReplies ? "Hide replies" : `View replies (${post.replies?.length || 0})`}
        </button>

        <div className="post-actions">
          <button className="icon-btn" onClick={() => toggleLike(post.id)}>
            <FaRegHeart />
            <span className="count">{post.likes || 0}</span>
          </button>
          <button className="icon-btn" onClick={() => setShowReplies(true)}>
            <FaReply />
          </button>
        </div>
      </div>

      {showReplies && (
        <div className="replies">
          {(post.replies || []).map((r) => (
            <ReplyCard key={r.id} reply={r} />
          ))}
          <ReplyCard inline onReply={onReply} />
        </div>
      )}
    </article>
  );
}