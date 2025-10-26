// src/pages/ChattingCollab.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarChatCollab from "../components/SidebarChatCollab";
import ChatArea from "../components/ChatArea";
import RightChatCollab from "../components/RightChatCollab";
import CreateGroupPopup from "../components/Popups/CreateGroupPopup";
import "../styles/ChattingCollab.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export default function ChattingCollab() {
  const location = useLocation();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [mobileView, setMobileView] = useState('sidebar'); // 'sidebar', 'chat', 'tasks'
  const messagesIntervalRef = useRef();

  // Get task data from navigation if coming from task details
  const taskData = location.state;

  useEffect(() => {
    fetchUserGroups();
    
    // Set up real-time updates (polling every 5 seconds)
    messagesIntervalRef.current = setInterval(() => {
      if (activeGroup && activeGroup._id) {
        fetchGroupMessages(activeGroup._id);
      }
    }, 5000);

    return () => {
      if (messagesIntervalRef.current) {
        clearInterval(messagesIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeGroup && activeGroup._id) {
      fetchGroupMessages(activeGroup._id);
      fetchGroupTasks(activeGroup._id);
    }
  }, [activeGroup]);

  const fetchUserGroups = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/collaborate/chat/groups`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(response.data);
      
      // Set active group based on task data or first group
      if (taskData?.groupId) {
        const taskGroup = response.data.find(g => g._id === taskData.groupId);
        setActiveGroup(taskGroup || response.data[0]);
      } else if (response.data.length > 0) {
        setActiveGroup(response.data[0]);
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMessages = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/collaborate/chat/groups/${groupId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const fetchGroupTasks = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/collaborate/chat/groups/${groupId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const postMessage = async (messageContent) => {
    if (!activeGroup || !activeGroup._id) {
      alert("No active group selected");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/collaborate/chat/groups/${activeGroup._id}/messages`,
        {
          content: messageContent,
          type: 'text'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessages(prev => [...prev, response.data]);
      
      // Refresh messages immediately after sending
      setTimeout(() => fetchGroupMessages(activeGroup._id), 100);
    } catch (err) {
      console.error("Error posting message:", err);
      alert("Failed to send message");
    }
  };

  const changeTaskStatus = async (taskId, newStatus, taskTitle) => {
    if (!activeGroup || !activeGroup._id) {
      alert("No active group selected");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Update task status
      await axios.put(
        `${API_BASE_URL}/collaborate/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Create system message for status change
      await axios.post(
        `${API_BASE_URL}/collaborate/chat/groups/${activeGroup._id}/task-update`,
        {
          taskId,
          taskTitle,
          oldStatus: tasks.find(t => t._id === taskId)?.status,
          newStatus
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh tasks and messages
      fetchGroupTasks(activeGroup._id);
      fetchGroupMessages(activeGroup._id);
      
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Failed to update task status");
    }
  };

  const createGroup = async (groupData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/collaborate/groups`,
        groupData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGroups(prev => [response.data, ...prev]);
      setActiveGroup(response.data);
      setShowCreateGroup(false);
      
      // Switch to chat view on mobile
      if (window.innerWidth <= 768) {
        setMobileView('chat');
      }
    } catch (err) {
      console.error("Error creating group:", err);
      alert("Failed to create group");
    }
  };

  const joinGroup = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/collaborate/groups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh groups
      fetchUserGroups();
    } catch (err) {
      console.error("Error joining group:", err);
      alert("Failed to join group");
    }
  };

  const handleGroupSelect = (group) => {
    setActiveGroup(group);
    if (window.innerWidth <= 768) {
      setMobileView('chat');
    }
  };

  const handleBackToGroups = () => {
    setMobileView('sidebar');
  };

  const handleShowTasks = () => {
    setMobileView('tasks');
  };

  const handleShowChat = () => {
    setMobileView('chat');
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your collaboration workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchUserGroups} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Mobile Navigation Header */}
      <div className="mobile-nav-header">
        {mobileView !== 'sidebar' && (
          <button className="back-btn" onClick={handleBackToGroups}>
            ← Groups
          </button>
        )}
        <div className="mobile-tabs">
          <button 
            className={`mobile-tab ${mobileView === 'chat' ? 'active' : ''}`}
            onClick={handleShowChat}
          >
            💬 Chat
          </button>
          <button 
            className={`mobile-tab ${mobileView === 'tasks' ? 'active' : ''}`}
            onClick={handleShowTasks}
          >
            📋 Tasks
          </button>
        </div>
      </div>

      {/* Sidebar - Hidden on mobile when in chat/tasks view */}
      <div className={`sidebar-container ${mobileView !== 'sidebar' ? 'mobile-hidden' : ''}`}>
        <SidebarChatCollab
          groups={groups}
          activeGroup={activeGroup}
          onSelectGroup={handleGroupSelect}
          onCreateGroup={() => setShowCreateGroup(true)}
          onJoinGroup={joinGroup}
          loading={loading}
        />
      </div>

      {/* Chat Area - Hidden on mobile when in sidebar/tasks view */}
      <div className={`chat-container ${mobileView !== 'chat' ? 'mobile-hidden' : ''}`}>
        <ChatArea
          group={activeGroup}
          messages={messages}
          onPostMessage={postMessage}
          loading={loading}
          onBackToGroups={handleBackToGroups}
        />
      </div>

      {/* Tasks Panel - Hidden on mobile when in sidebar/chat view */}
      <div className={`tasks-container ${mobileView !== 'tasks' ? 'mobile-hidden' : ''}`}>
        <RightChatCollab
          group={activeGroup}
          tasks={tasks}
          onChangeTaskStatus={changeTaskStatus}
          currentTask={taskData}
          loading={loading}
        />
      </div>

      {/* Create Group Popup */}
      {showCreateGroup && (
        <CreateGroupPopup
          onClose={() => setShowCreateGroup(false)}
          onSubmit={createGroup}
        />
      )}
    </div>
  );
}