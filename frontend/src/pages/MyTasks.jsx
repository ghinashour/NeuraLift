/* eslint-disable react-hooks/exhaustive-deps */


// src/pages/MyTaskPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyTaskPage.css";

export default function MyTaskPage() {
  const navigate = useNavigate();

  const tasks = [
    {
      id: 1,
      admin: "Ghinaa Shour",
      avatar: null,
      title: "Fix UI issue in Dashboard",
      date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
    {
      id: 2,
      admin: "Ali Hassan",
      avatar: null,
      title: "Prepare weekly report",
      date: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 day ago
    },
    {
      id: 3,
      admin: "Nour Fares",
      avatar: null,
      title: "Review merge request #45",
      date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    },
    {
      id: 4,
      admin: "Sarah Johnson",
      avatar: null,
      title: "Optimize database queries",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40), // 40 days ago
    },
  ];

  const groupTasks = () => {
    const now = new Date();
    const grouped = { Today: [], Yesterday: [], "Last Month": [], Older: [] };

    tasks.forEach((task) => {
      const diffHours = (now - task.date) / (1000 * 60 * 60);
      if (diffHours < 24) grouped.Today.push(task);
      else if (diffHours < 48) grouped.Yesterday.push(task);
      else if (diffHours < 24 * 30) grouped["Last Month"].push(task);
      else grouped.Older.push(task);
    });

    return grouped;
  };

  const groupedTasks = groupTasks();

  const getDateLabel = (date) => {
    const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1d";
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return "A week ago";
    return date.toLocaleDateString("en-GB").slice(0, 8);
  };

  return (
    <div className="nl-page mytask-page">
      <div className="nl-hero">
        <div className="nl-hero-copy">
          <p className="nl-eyebrow">Assigned Tasks</p>
          <h1 className="nl-title">
            Tasks assigned
            <br />
            to <em>you</em>.
          </h1>
          <p className="nl-lede">Here are the tasks your team shared with you recently.</p>
        </div>
        <p className="nl-hero-quote">“Teamwork makes the dream work.”</p>
      </div>
      <div className="mytask-container">

        {Object.entries(groupedTasks).map(([section, sectionTasks]) =>
          sectionTasks.length > 0 ? (
            <div key={section} className="task-section">
              <h2>{section}</h2>
              <div className="task-list">
                {sectionTasks.map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    onClick={() => navigate(`/mytasks/${task.id}`)}
                  >
                    <div className="task-avatar">
                      {task.avatar ? (
                        <img src={task.avatar} alt={task.admin} />
                      ) : (
                        <span>{task.admin.charAt(0)}</span>
                      )}
                    </div>
                    <div className="task-info">
                      <p className="task-admin">
                        {task.admin} assigned you a task
                      </p>
                      <p className="task-title">{task.title}</p>
                    </div>
                    <span className="task-date">{getDateLabel(task.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}