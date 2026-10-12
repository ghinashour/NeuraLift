// src/pages/Collaborate.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Collaborate.css";

import Sidebar from "../components/Collaborate/SidebarCollab";
import PostCard from "../components/Collaborate/PostCard";
import { useSocket } from "../context/SocketProvider";

import InvitePopup from "../components/Popups/InvitePopup";
import CreateGroupPopup from "../components/Popups/CreateGroupPopup";
import AddMemberPopup from "../components/Popups/AddMemberPopup";
import AssignTaskPopup from "../components/Popups/AssignTaskPopup";
import CreatePostPopup from "../components/Popups/CreatePostPopup";

// Axios configuration — tolerate REACT_APP_API_URL with or without trailing /api
const RAW_BASE = (process.env.REACT_APP_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
const API_BASE_URL = RAW_BASE.endsWith("/api") ? RAW_BASE : `${RAW_BASE}/api`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function Collaborate() {
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useSocket();

  // Sample posts fallback
  const getSamplePosts = useCallback(
    () => [
      {
        _id: "p1",
        user: { name: "Sarah Johnson", avatar: null },
        createdAt: "2025-06-12T10:00:00Z",
        content:
          "I'm designing a Laravel app but I got a lot of issues in the code review. Recommend a course I can master it with?",
        likes: 3,
        replies: [
          {
            _id: "r1",
            user: { name: "Emily Rodriguez", avatar: null },
            createdAt: "2025-06-12T11:00:00Z",
            text: "Laracasts is great. Also build small real-world features and read the docs frequently.",
            likes: 1,
          },
        ],
      },
      {
        _id: "p2",
        user: { name: "Omar Ali", avatar: null },
        createdAt: "2025-08-02T09:20:00Z",
        content: "What's your favorite productivity tip?",
        likes: 1,
        replies: [],
      },
    ],
    []
  );

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/collaborate/posts");
      const data = Array.isArray(response.data) ? response.data : response.data?.posts ?? [];
      setPosts(Array.isArray(data) ? data : []);
      if (!Array.isArray(data) || data.length === 0) {
        // empty is valid — no error banner
        setPosts([]);
      }
    } catch (err) {
      const status = err?.response?.status;
      console.error("Error fetching posts:", err?.response?.data || err.message);
      if (status === 401) {
        setError("Please log in again to see community posts.");
        setPosts([]);
      } else if (status === 404) {
        setError("Posts endpoint not found — check API base URL (must end in /api).");
        setPosts(getSamplePosts());
      } else {
        setError("Couldn't reach the server. Showing cached examples — Retry when online.");
        setPosts(getSamplePosts());
      }
    } finally {
      setLoading(false);
    }
  }, [getSamplePosts]);

  // Fetch groups
  const fetchGroups = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/collaborate/groups");
      setGroups(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  }, []);

  // Listen for socket notifications
  useEffect(() => {
    fetchPosts();
    fetchGroups();

    const handleNotif = (notif) => {
      if (!notif) return;
      if (notif.type === "reply") {
        if (notif.postId && notif.reply) {
          setPosts((prev) =>
            prev.map((p) =>
              p._id === notif.postId
                ? { ...p, replies: [...(p.replies || []), notif.reply] }
                : p
            )
          );
        } else {
          fetchPosts();
        }
      }
    };

    if (socket) socket.on("newNotification", handleNotif);
    return () => {
      if (socket) socket.off("newNotification", handleNotif);
    };
  }, [socket, fetchPosts, fetchGroups]);

  // Add reply
  const handleAddReply = async (postId, reply) => {
    try {
      const resp = await axiosInstance.post(`/collaborate/posts/${postId}/replies`, {
        text: reply.text,
      });
      const created = resp.data;
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, replies: [...(p.replies || []), created] }
            : p
        )
      );
    } catch (err) {
      console.error("Error adding reply:", err);
      alert("Failed to add reply. Please try again.");
    }
  };

  // Update likes
  const handleUpdateLikes = async (postId, newLikes) => {
    try {
      const response = await axiosInstance.put(`/collaborate/posts/${postId}/likes`, {
        likes: newLikes,
      });
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? response.data : p))
      );
    } catch (err) {
      console.error("Error updating likes:", err);
      alert("Failed to update likes. Please try again.");
    }
  };

  // Create post
  const handleCreatePost = async (postData) => {
    try {
      const response = await axiosInstance.post("/collaborate/posts", {
        content: postData.content,
      });
      setPosts((prev) => [response.data, ...prev]);
      setActivePopup(null);
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post. Please try again.");
    }
  };

  // Create group
  const handleCreateGroup = async (groupData) => {
    try {
      const response = await axiosInstance.post("/collaborate/groups", {
        name: groupData.name,
        description: groupData.description,
        isPublic: groupData.isPublic ?? true,
      });
      setGroups((prev) => [response.data, ...prev]);
      setActivePopup(null);
      alert("Group created successfully!");
    } catch (err) {
      console.error("Error creating group:", err);
      alert("Failed to create group. Please try again.");
    }
  };

  // Assign task
  const handleAssignTask = async (taskData) => {
    try {
      await axiosInstance.post("/collaborate/tasks", taskData);
      setActivePopup(null);
      alert("Task assigned successfully!");
    } catch (err) {
      console.error("Error assigning task:", err);
    }
  };

  // Add member
  const handleAddMember = async (memberData) => {
    try {
      await axiosInstance.post("/collaborate/invite/member", memberData);
      setActivePopup(null);
      alert("Member added successfully!");
      fetchGroups(); // refresh groups
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };

  const handleInvite = (inviteData) => {
    setSelectedGroup(inviteData.group);
    setActivePopup("invite");
  };

  // Navigate to a group's chat
  const handleGroupClick = (group) => {
    navigate("/ChattingCollab", {
      state: {
        groupId: group._id,
        groupName: group.name,
      },
    });
  };

  const getDisplayName = (u) => u?.name || u?.username || "Unknown User";

  const formatPostForCard = (post) => ({
    id: post._id,
    name: getDisplayName(post.user),
    avatar: post.user?.avatar || post.user?.profilePhoto || null,
    date: post.createdAt,
    content: post.content,
    likes: post.likes ?? 0,
    replies: (post.replies || []).map((reply) => ({
      id: reply._id,
      name: getDisplayName(reply.user),
      avatar: reply.user?.avatar || reply.user?.profilePhoto || null,
      date: reply.createdAt,
      text: reply.text,
      likes: reply.likes ?? 0,
    })),
  });

  if (loading) {
    return (
      <div className="nl-page collaborate-page">
        <div className="nl-hero">
          <div className="nl-hero-copy">
            <p className="nl-eyebrow">Collaborate</p>
            <h1 className="nl-title">
              Grow <em>together</em>.
            </h1>
            <p className="nl-lede">
              Find people you know, share ideas, and support each other.
            </p>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nl-page collaborate-page">
      <div className="nl-hero">
        <div className="nl-hero-copy">
          <p className="nl-eyebrow">Collaborate</p>
          <h1 className="nl-title">
            Grow <em>together</em>.
          </h1>
          <p className="nl-lede">
            Find people you know, share ideas, and support each other —
            community makes every goal lighter.
          </p>
        </div>
        <p className="nl-hero-quote">“Alone we go fast. Together we go far.”</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={fetchPosts} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      <div className="collaborate-container">
        <section className="collaborate-posts" role="main">
          <div className="panel-top">
            <h2>Recently posted</h2>
            <p className="panel-sub">Drop your thoughts</p>
          </div>

          <div className="posts-list">
            {posts.length === 0 ? (
              <div className="no-posts">
                <p>No posts yet. Be the first to share something!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={formatPostForCard(post)}
                  onReply={handleAddReply}
                  onLikesChange={handleUpdateLikes}
                />
              ))
            )}
          </div>
        </section>

        <Sidebar
          onOpenPopup={setActivePopup}
          groups={groups}
          onInviteGroup={handleInvite}
          onGroupClick={handleGroupClick}
        />
      </div>

      {activePopup === "invite" && (
        <InvitePopup
          onClose={() => {
            setActivePopup(null);
            setSelectedGroup(null);
          }}
          group={selectedGroup}
        />
      )}
      {activePopup === "createGroup" && (
        <CreateGroupPopup
          onClose={() => setActivePopup(null)}
          onSubmit={handleCreateGroup}
        />
      )}
      {activePopup === "addMember" && (
        <AddMemberPopup
          onClose={() => setActivePopup(null)}
          onSubmit={handleAddMember}
          groups={groups}
        />
      )}
      {activePopup === "assignTask" && (
        <AssignTaskPopup
          onClose={() => setActivePopup(null)}
          onSubmit={handleAssignTask}
          groups={groups}
        />
      )}
      {activePopup === "createPost" && (
        <CreatePostPopup
          onClose={() => setActivePopup(null)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
}
