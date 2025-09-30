// src/components/collaborate/ReplyCard.js
import React, { useState } from "react";
import "../../styles/Collaborate.css";
import useUserData from "../../hooks/useUserData";

/**
 * If "inline" prop is passed, ReplyCard renders a small input to post a reply (onReply callback).
 * Otherwise, it renders an existing reply (white card).
 */
export default function ReplyCard({ reply, inline = false, onReply }) {
  const [text, setText] = useState("");
  const user = useUserData();

  if (inline) {
    return (
      <div className="reply-inline">
        <img src={user.avatar || "/avatar.png"} alt="me" className="avatar small" />
        <div className="reply-input-wrap">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply..." />
          <div className="reply-controls">
            <button onClick={() => { onReply(text); setText(""); }}>Reply</button>
            <button onClick={() => setText("")}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reply-card">
      <div className="reply-top">
        <img className="avatar small" src={reply.avatar || "/avatar.png"} alt="avatar" />
        <div className="reply-meta">
          <div className="username">{reply.author}</div>
          <div className="reply-time">{new Date(reply.date).toLocaleString()}</div>
        </div>
      </div>
      <div className="reply-content">{reply.content}</div>
    </div>
  );
}