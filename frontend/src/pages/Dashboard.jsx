import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

import Greeting from "../components/Greetings";
import InspirationSection from "../components/InspirationSection";
import ActionButton from "../components/ActionButton";
import API, { getCurrentUser } from "../api/axios";

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

  return (
    <div className="dashboard-page">
      {/* Header: Greeting (includes streak + notifications) */}
      <header className="dashboard-header">
        {user && <Greeting name={user.username} userId={user._id} />}
      </header>

      {/* Daily Inspiration */}
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
        <ActionButton
          title="Wellness"
          subtitle="Stress-relief space"
          gradient="linear-gradient(90deg, #3C83F6, #16A249)"
          icon="heart"
          href="/stressrelief"
        />
      </section>
    </div>
  );
}

export default Dashboard;
