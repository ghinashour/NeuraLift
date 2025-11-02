// src/pages/Collaborate.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this import
import "../styles/Collaborate.css";

import Sidebar from "../components/Collaborate/SidebarCollab";
import PostCard from "../components/Collaborate/PostCard";

import InvitePopup from "../components/Popups/InvitePopup";
import CreateGroupPopup from "../components/Popups/CreateGroupPopup";
import AddMemberPopup from "../components/Popups/AddMemberPopup";
import AssignTaskPopup from "../components/Popups/AssignTaskPopup";
import CreatePostPopup from "../components/Popups/CreatePostPopup";

import { FaUsers } from "react-icons/fa";

// Axios configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

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
  (error) => {
    return Promise.reject(error);
  }
);

export default function Collaborate() {
  const navigate = useNavigate(); // Add this hook
  const [activePopup, setActivePopup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts and groups on component mount
  useEffect(() => {
    fetchPosts();
    fetchGroups();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/collaborate/posts");
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
      setPosts(getSamplePosts());
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axiosInstance.get("/collaborate/groups");
      setGroups(response.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  // Add this function to handle group click
  const handleGroupClick = (group) => {
    navigate('/chatting-collab', { 
      state: { 
        groupId: group._id,
        groupName: group.name 
      } 
    });
  };

  // Sample data fallback
  const getSamplePosts = () => [
    {
      _id: "p1",
      user: {
        name: "Sarah Johnson",
        avatar: null,
      },
      createdAt: "2025-06-12T10:00:00Z",
      content:
        "I'm designing a Laravel app but I got a lot of issues in the code review. Recommend a course I can master it with?",
      likes: 3,
      replies: [
        {
          _id: "r1",
          user: {
            name: "Emily Rodriguez",
            avatar: null,
          },
          createdAt: "2025-06-12T11:00:00Z",
          text:
            "Laracasts is great. Also build small real-world features and read the docs frequently.",
          likes: 1,
        },
      ],
    },
    {
      _id: "p2",
      user: {
        name: "Omar Ali",
        avatar: null,
      },
      createdAt: "2025-08-02T09:20:00Z",
      content: "What's your favorite productivity tip?",
      likes: 1,
      replies: [],
    },
  ];

  const handleAddReply = async (postId, reply) => {
    try {
      const response = await axiosInstance.post(`/collaborate/posts/${postId}/replies`, {
        text: reply.text,
      });

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
              ...p,
              replies: [...p.replies, response.data]
            }
            : p
        )
      );
    } catch (err) {
      console.error("Error adding reply:", err);
      alert("Failed to add reply. Please try again.");
    }
  };

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

  const handleCreateGroup = async (groupData) => {
    try {
      const response = await axiosInstance.post("/collaborate/groups", {
        name: groupData.name,
        description: groupData.description,
        isPublic: groupData.isPublic || true,
      });

      setGroups(prev => [response.data, ...prev]);
      setActivePopup(null);
      alert("Group created successfully!");
    } catch (err) {
      console.error("Error creating group:", err);
      alert("Failed to create group. Please try again.");
    }
  };

  const handleAssignTask = async (taskData) => {
    try {
      const response = await axiosInstance.post("/collaborate/tasks", {
        title: taskData.title,
        description: taskData.description,
        assignedTo: taskData.assignedTo,
        groupId: taskData.groupId,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
      });

      setActivePopup(null);
      alert("Task assigned successfully!");
    } catch (err) {
      console.error("Error assigning task:", err);
      throw err; // This will be caught in the popup component
    }
  };

  const handleAddMember = async (memberData) => {
    try {
      const response = await axiosInstance.post("/collaborate/invite/member", {
        email: memberData.email,
        groupId: memberData.groupId,
        role: memberData.role
      });

      setActivePopup(null);
      alert("Member added successfully!");

      // Refresh groups to show new member
      fetchGroups();
    } catch (err) {
      console.error("Error adding member:", err);
      throw err; // This will be caught in the popup component
    }
  };

  const handleInvite = async (inviteData) => {
    try {
      // Store the selected group for the invite popup
      setSelectedGroup(inviteData.group);
      setActivePopup("invite");
    } catch (err) {
      console.error("Error preparing invitation:", err);
      alert("Failed to prepare invitation. Please try again.");
    }
  };


  // Format post data for PostCard component
  const formatPostForCard = (post) => ({
    id: post._id,
    name: post.user?.name || "Unknown User",
    avatar: post.user?.avatar || null,
    date: post.createdAt,
    content: post.content,
    likes: post.likes,
    replies: post.replies.map(reply => ({
      id: reply._id,
      name: reply.user?.name || "Unknown User",
      avatar: reply.user?.avatar || null,
      date: reply.createdAt,
      text: reply.text,
      likes: reply.likes,
    }))
  });

  if (loading) {
    return (
      <div className="collaborate-page">
        <header className="collaborate-header">
          <div className="header-inner">
            <h1 className="collab-title">
              <FaUsers className="header-icon" /> Collaborate
            </h1>
            <p className="collab-sub">Find people who you know and message them!</p>
          </div>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

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

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={fetchPosts} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      <div className="collaborate-container">
        {/* Main posts */}
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

        {/* Sidebar */}
        <Sidebar
          onOpenPopup={(name) => setActivePopup(name)}
          groups={groups}
          onInviteGroup={handleInvite}
          onGroupClick={handleGroupClick} // Add this prop
        />
      </div>

      {/* Popups */}
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