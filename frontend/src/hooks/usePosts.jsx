// src/hooks/usePosts.js
import { useEffect, useState } from "react";

/**
 * usePosts - local posts state persisted to localStorage
 * Each post: { id, author, avatar, content, date, replies:[], likes }
 */
const STORAGE_KEY = "collab_posts_v1";

export default function usePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setPosts(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const addPost = (p) => setPosts((s) => [p, ...s]);
  const addReply = (postId, reply) =>
    setPosts((s) => s.map((p) => (p.id === postId ? { ...p, replies: [...(p.replies || []), reply] } : p)));
  const toggleLike = (postId) =>
    setPosts((s) => s.map((p) => (p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p)));

  return { posts, setPosts, addPost, addReply, toggleLike };
}