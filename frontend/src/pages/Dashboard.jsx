import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

import Greeting from "../components/Greetings";
import InspirationSection from "../components/InspirationSection";
import ActionButton from "../components/ActionButton";
import DashboardStats from "../components/DashboardStats";
import useDashboardData from "../hooks/useDashboardData";
import { getCurrentUser } from "../api/axios";
import AILogo from '../components/AiLogo';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user
  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        if (mounted) setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();
    return () => { mounted = false; };
  }, []);

  // use dashboard data (streak, notifications)
  const { streak, notifications } = useDashboardData(user?._id);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-page">
      {/* Header: Greeting + Notifications */}
      <header className="dashboard-header" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid #e0e0e0",
      }}>
        {user && <Greeting name={user.username} userId={user._id} />}
      </header>

    {/* Daily Inspiration (Quote) */}
    <InspirationSection />

    {/* Action Buttons */}
      <section className="action-grid">
        <ActionButton
          title="Focus Timer"
          subtitle="Start a productive session"
          gradient="linear-gradient(90deg, #3C83F6, #6DA2F8)"
          icon="timer"
          href="/focusTimer"
        />
        <ActionButton
          title="Tasks"
          subtitle="Manage your goals"
          gradient="linear-gradient(90deg, #16A249, #1CCE5E)"
          icon="tasks"
          href="/taskManager"
        />
        <ActionButton
          title="Mood Tracker"
          subtitle="Track your wellness"
          gradient="linear-gradient(90deg, #7C3BED, #9B6AF1)"
          icon="brain"
          href="/moodTracker"
        />
        
      </section>
      {/* Statistics (placed after action buttons for better flow on desktop) */}
      <div style={{ width: '100%', maxWidth: 1120, margin: '28px auto', padding: '0 12px' }}>
        <DashboardStats streak={streak} unread={(notifications && notifications.length) || 0} />
      </div>

      {/* Floating AI Assistant */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <AILogo />
      </div>
    </div>
  );
}

export default Dashboard;
