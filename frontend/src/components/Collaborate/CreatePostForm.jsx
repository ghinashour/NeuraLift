// src/components/collaborate/CreatePostForm.js
import React, { useState } from "react";
import "../../styles/Collaborate.css";
import usePosts from "../../hooks/usePosts";
import useUserData from "../../hooks/useUserData";

/**
 * If inline prop is true, form renders a compact inline create UI,
 * otherwise it is a full popup form.
 */
export default function CreatePostForm({ inline = false, onClose }) {
  const { name, avatar } = useUserData();
  const { addPost } = usePosts();
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addPost({
      id: "p-" + Date.now(),
      author: name,
      avatar,
      content: text,
      date: new Date().toISOString(),
      replies: [],
      likes: 0,
    });
    setText("");
    onClose?.();
  };

  if (inline) {
    return (
      <form className="create-post-inline-form" onSubmit={submit}>
        <input placeholder="Share a thought..." value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Share</button>
      </form>
    );
  }

  return (
    <div className="create-post-popup">
      <h2>Create Post</h2>
      <p>Share something with your group</p>
      <form onSubmit={submit}>
        <label>Your thought</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} required />
        <div className="popup-actions">
          <button type="submit" className="primary">Share your question</button>
        </div>
      </form>
    </div>
  );
}