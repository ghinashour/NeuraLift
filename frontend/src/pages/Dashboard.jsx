import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

import Greeting from "../components/Greetings";
import InspirationSection from "../components/InspirationSection";
import ActionButton from "../components/ActionButton";
import { getCurrentUser } from "../api/axios";

function Dashboard() {
  const [name, setName] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser(); // Axios response
        if (mounted) {
          // Access only the username from res.data
          setName(res.data?.username || "User");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="dashboard-page">
      {/* Top: centered greeting + right icons */}
      <header className="dashboard-header">
        <Greeting name={name} loading={loading} />
      </header>

      {/* Middle: Daily Inspiration */}
      <InspirationSection />

      {/* Bottom: Four action cards */}
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
