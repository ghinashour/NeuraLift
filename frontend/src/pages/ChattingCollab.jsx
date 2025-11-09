// src/pages/ChattingCollab.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SidebarChatCollab from "../components/SidebarChatCollab";
import ChatArea from "../components/ChatArea";
import RightChatCollab from "../components/RightChatCollab";
import CreateGroupPopup from "../components/Popups/CreateGroupPopup";
import AssignTaskPopup from "../components/Popups/AssignTaskPopup";
import "../styles/ChattingCollab.css";
import { useSocket } from "../context/SocketProvider";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export default function ChattingCollab() {
  const location = useLocation();
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [mobileView, setMobileView] = useState("sidebar");
  const messagesIntervalRef = useRef();
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [selectedGroupForTask, setSelectedGroupForTask] = useState(null);
  const taskData = location.state;
  const socket = useSocket();

  // ✅ Fetch User Groups
  const fetchUserGroups = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/collaborate/chat/groups`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGroups(response.data);

      // ✅ Select default or task-specific group
      if (taskData?.groupId) {
        const taskGroup = response.data.find(
          (g) => g._id === taskData.groupId
        );
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
  }, [taskData]);

  // ✅ Fetch Messages
  const fetchGroupMessages = useCallback(async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/collaborate/chat/groups/${groupId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, []);

  // ✅ Fetch Tasks
  const fetchGroupTasks = useCallback(async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/collaborate/chat/groups/${groupId}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }, []);

  // ✅ Real-time updates & socket events
  useEffect(() => {
    fetchUserGroups();

    messagesIntervalRef.current = setInterval(() => {
      if (activeGroup?._id) {
        fetchGroupMessages(activeGroup._id);
      }
    }, 5000);

    const handleNotif = (notif) => {
      if (!notif) return;

      if (notif.type === "message" && notif.groupId === activeGroup?._id) {
        fetchGroupMessages(activeGroup._id);
      }

      if (notif.type === "task" && notif.groupId === activeGroup?._id) {
        fetchGroupTasks(activeGroup._id);
      }

      if (notif.type === "group") {
        fetchUserGroups();
      }
    };

    if (socket) socket.on("newNotification", handleNotif);

    return () => {
      if (messagesIntervalRef.current)
        clearInterval(messagesIntervalRef.current);
      if (socket) socket.off("newNotification", handleNotif);
    };
  }, [socket, activeGroup, fetchUserGroups, fetchGroupMessages, fetchGroupTasks]);

  // ✅ Fetch messages/tasks when active group changes
  useEffect(() => {
    if (activeGroup?._id) {
      fetchGroupMessages(activeGroup._id);
      fetchGroupTasks(activeGroup._id);
    }
  }, [activeGroup, fetchGroupMessages, fetchGroupTasks]);

  // ✅ Join/leave socket room on group change
  const prevGroupRef = useRef(null);
  useEffect(() => {
    if (!socket) return;

    const prev = prevGroupRef.current;
    if (prev && socket.connected) {
      try {
        socket.emit("leaveGroup", prev);
      } catch {
        /* ignore */
      }
    }

    if (activeGroup?._id && socket.connected) {
      try {
        socket.emit("joinGroup", activeGroup._id);
      } catch {
        /* ignore */
      }
    }

    prevGroupRef.current = activeGroup ? activeGroup._id : null;
  }, [activeGroup, socket]);

  // ✅ Post Message
  const postMessage = useCallback(
    async (messageContent) => {
      if (!activeGroup?._id) {
        alert("No active group selected");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_BASE_URL}/collaborate/chat/groups/${activeGroup._id}/messages`,
          { content: messageContent, type: "text" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessages((prev) => [...prev, response.data]);
        setTimeout(() => fetchGroupMessages(activeGroup._id), 100);
      } catch (err) {
        console.error("Error posting message:", err);
        alert("Failed to send message");
      }
    },
    [activeGroup, fetchGroupMessages]
  );

  // ✅ Change Task Status
  const changeTaskStatus = useCallback(
    async (taskId, newStatus, taskTitle) => {
      if (!activeGroup?._id) {
        alert("No active group selected");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        await axios.put(
          `${API_BASE_URL}/collaborate/tasks/${taskId}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        await axios.post(
          `${API_BASE_URL}/collaborate/chat/groups/${activeGroup._id}/task-update`,
          {
            taskId,
            taskTitle,
            oldStatus: tasks.find((t) => t._id === taskId)?.status,
            newStatus,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        fetchGroupTasks(activeGroup._id);
        fetchGroupMessages(activeGroup._id);
      } catch (err) {
        console.error("Error updating task status:", err);
        alert("Failed to update task status");
      }
    },
    [activeGroup, tasks, fetchGroupTasks, fetchGroupMessages]
  );

  // ✅ Create Group
  const createGroup = useCallback(
    async (groupData) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_BASE_URL}/collaborate/groups`,
          groupData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setGroups((prev) => [response.data, ...prev]);
        setActiveGroup(response.data);
        setShowCreateGroup(false);

        if (window.innerWidth <= 768) setMobileView("chat");
      } catch (err) {
        console.error("Error creating group:", err);
        alert("Failed to create group");
      }
    },
    []
  );

  // ✅ Join Group
  const joinGroup = useCallback(async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/collaborate/groups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserGroups();
    } catch (err) {
      console.error("Error joining group:", err);
      alert("Failed to join group");
    }
  }, [fetchUserGroups]);

  // ✅ UI Handlers
  const handleGroupSelect = (group) => {
    setActiveGroup(group);
    if (socket?.connected) socket.emit("joinGroup", group._id);
    if (window.innerWidth <= 768) setMobileView("chat");
  };

  const handleBackToGroups = () => setMobileView("sidebar");
  const handleShowTasks = () => setMobileView("tasks");
  const handleShowChat = () => setMobileView("chat");

  // ✅ Task popup handlers
  const handleNewTask = (groupId) => {
    setSelectedGroupForTask(groupId);
    setShowAssignTask(true);
  };

  const handleTaskCreated = () => {
    setShowAssignTask(false);
    setSelectedGroupForTask(null);
    if (activeGroup?._id) fetchGroupTasks(activeGroup._id);
  };

  // ✅ Loading & Error States
  if (loading)
    return (
      <div className="chat-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your collaboration workspace...</p>
        </div>
      </div>
    );

  if (error)
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

  // ✅ Main Render
  return (
    <div className="chat-page">
      {/* Mobile Navigation Header */}
      <div className="mobile-nav-header">
        {mobileView !== "sidebar" && (
          <button className="back-btn" onClick={handleBackToGroups}>
            ← Groups
          </button>
        )}
        <div className="mobile-tabs">
          <button
            className={`mobile-tab ${
              mobileView === "chat" ? "active" : ""
            }`}
            onClick={handleShowChat}
          >
            💬 Chat
          </button>
          <button
            className={`mobile-tab ${
              mobileView === "tasks" ? "active" : ""
            }`}
            onClick={handleShowTasks}
          >
            📋 Tasks
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar-container ${
          mobileView !== "sidebar" ? "mobile-hidden" : ""
        }`}
      >
        <SidebarChatCollab
          groups={groups}
          activeGroup={activeGroup}
          onSelectGroup={handleGroupSelect}
          onCreateGroup={() => setShowCreateGroup(true)}
          onJoinGroup={joinGroup}
          loading={loading}
        />
      </div>

      {/* Chat Area */}
      <div
        className={`chat-container ${
          mobileView !== "chat" ? "mobile-hidden" : ""
        }`}
      >
        <ChatArea
          group={activeGroup}
          messages={messages}
          onPostMessage={postMessage}
          loading={loading}
          onBackToGroups={handleBackToGroups}
        />
      </div>

      {/* Tasks Panel */}
      <div
        className={`tasks-container ${
          mobileView !== "tasks" ? "mobile-hidden" : ""
        }`}
      >
        <RightChatCollab
          group={activeGroup}
          tasks={tasks || []}
          onChangeTaskStatus={changeTaskStatus}
          currentTask={taskData}
          loading={loading}
          onNewTask={handleNewTask}
          onFilterTasks={(filterType) =>
            console.log("Filtering by:", filterType)
          }
        />
      </div>

      {/* Create Group Popup */}
      {showCreateGroup && (
        <CreateGroupPopup
          onClose={() => setShowCreateGroup(false)}
          onSubmit={createGroup}
        />
      )}

      {/* Assign Task Popup */}
      {showAssignTask && (
        <AssignTaskPopup
          onClose={() => setShowAssignTask(false)}
          onSubmit={handleTaskCreated}
          groups={groups}
          defaultGroupId={selectedGroupForTask}
        />
      )}
    </div>
  );
}
