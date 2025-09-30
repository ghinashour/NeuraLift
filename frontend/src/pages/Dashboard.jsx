import React from "react";
import "../styles/Dashboard.css";

import Greeting from "../components/Greetings";
import InspirationSection from "../components/InspirationSection";
import ActionButton from "../components/ActionButton";

function Dashboard() {
  return (
    <div className="dashboard-page">
      {/* Top: centered greeting + right icons (inside Greeting) */}
      <header className="dashboard-header">
        <Greeting />
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
          href="/focus-timer"
        />
        <ActionButton
          title="Tasks"
          subtitle="Manage your goals"
          gradient="linear-gradient(90deg, #16A249, #1CCE5E)"
          icon="tasks"
          href="/tasks"
        />
        <ActionButton
          title="Mood Tracker"
          subtitle="Track your wellness"
          gradient="linear-gradient(90deg, #7C3BED, #9B6AF1)"
          icon="brain"
          href="/mood-tracker"
        />
        <ActionButton
          title="Wellness"
          subtitle="Stress-relief space"
          gradient="linear-gradient(90deg, #3C83F6, #16A249)"
          icon="heart"
          href="/wellness"
        />
      </section>
    </div>
  );
}

export default Dashboard;