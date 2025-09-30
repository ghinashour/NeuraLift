// src/pages/Collaborate.js
import React from "react";
import "../styles/Collaborate.css";
import Sidebar from "../components/Collaborate/sidebar-collab";
import PostCard from "../components/Collaborate/PostCard";
import usePosts from "../hooks/usePosts";
import CreatePostForm from "../components/Collaborate/CreatePostForm";

export default function Collaborate() {
  const { posts } = usePosts();

  return (
    <div className="collaborate-page">
      <header className="collaborate-header">
        <h1>Collaborate</h1>
        <p>Find people who you know and message them!</p>
      </header>

      <div className="collaborate-body">
        <main className="collaborate-main">
          <div className="collaborate-box">
            <div className="box-header">
              <div>
                <h2>Recently Posted</h2>
                <p className="drop-sub">Drop your thought</p>
              </div>
              <div className="create-post-inline">
                <CreatePostForm inline />
              </div>
            </div>

            <div className="posts-list">
              {posts.length === 0 ? (
                <div className="empty">No posts yet — create one!</div>
              ) : (
                posts.map((p) => <PostCard key={p.id} post={p} />)
              )}
            </div>
          </div>
        </main>

        <aside className="collaborate-sidebar-column">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}