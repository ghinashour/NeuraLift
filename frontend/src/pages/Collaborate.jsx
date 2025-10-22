// src/pages/Collaborate.js
import React, { useState } from "react";
import "../styles/Collaborate.css";

import Sidebar from "../components/Collaborate/SidebarCollab";
import PostCard from "../components/Collaborate/PostCard";

import InvitePopup from "../components/Popups/InvitePopup";
import CreateGroupPopup from "../components/Popups/CreateGroupPopup";
import AddMemberPopup from "../components/Popups/AddMemberPopup";
import AssignTaskPopup from "../components/Popups/AssignTaskPopup";
import CreatePostPopup from "../components/Popups/CreatePostPopup";

import { FaUsers } from "react-icons/fa";

export default function Collaborate() {
  const [activePopup, setActivePopup] = useState(null);

  const [posts, setPosts] = useState([
    {
      id: "p1",
      name: "Sarah Johnson",
      avatar: null,
      date: "2025-06-12T10:00:00Z",
      content:
        "I'm designing a Laravel app but I got a lot of issues in the code review. Recommend a course I can master it with?",
      likes: 3,
      replies: [
        {
          id: "r1",
          name: "Emily Rodriguez",
          avatar: null,
          date: "2025-06-12T11:00:00Z",
          text:
            "Laracasts is great. Also build small real-world features and read the docs frequently.",
          likes: 1,
        },
      ],
    },
    {
      id: "p2",
      name: "Omar Ali",
      avatar: null,
      date: "2025-08-02T09:20:00Z",
      content: "What's your favorite productivity tip?",
      likes: 1,
      replies: [],
    },
  ]);

  const handleAddReply = (postId, reply) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
      )
    );
  };

  const handleUpdateLikes = (postId, newLikes) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: newLikes } : p))
    );
  };

  return (
    <div className="collaborate-page">
      {/* Header */}
      <header className="collaborate-header">
        <div className="header-inner">
          <h1 className="collab-title">
            <FaUsers className="header-icon" /> Collaborate
          </h1>
          <p className="collab-sub">Find people who you know and message them!</p>
        </div>
      </header>

      <div className="collaborate-container">
        {/* Main posts */}
        <section className="collaborate-posts" role="main">
          <div className="panel-top">
            <h2>Recently posted</h2>
            <p className="panel-sub">Drop your thoughts</p>
          </div>

          <div className="posts-list">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onReply={handleAddReply}
                onLikesChange={handleUpdateLikes}
              />
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <Sidebar onOpenPopup={(name) => setActivePopup(name)} />
      </div>

      {/* Popups */}
      {activePopup === "invite" && <InvitePopup onClose={() => setActivePopup(null)} />}
      {activePopup === "createGroup" && <CreateGroupPopup onClose={() => setActivePopup(null)} />}
      {activePopup === "addMember" && <AddMemberPopup onClose={() => setActivePopup(null)} />}
      {activePopup === "assignTask" && <AssignTaskPopup onClose={() => setActivePopup(null)} />}
      {activePopup === "createPost" && <CreatePostPopup onClose={() => setActivePopup(null)} />}
    </div>
  );
}