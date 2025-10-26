import React from "react";
import { FaCalendarAlt, FaSmile, FaHeart } from "react-icons/fa";

const WeeklyInsights = ({ entries }) => {
  // Calculate insights
  const totalEntries = entries.length;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const lastWeekEntries = entries.filter(e => new Date(e.date) > weekAgo);

  const dominantMood = lastWeekEntries.length
    ? lastWeekEntries
      .map(e => e.mood)
      .sort(
        (a, b) =>
          lastWeekEntries.filter(i => i.mood === b).length -
          lastWeekEntries.filter(i => i.mood === a).length
      )[0]
    : "N/A";

  const weeklyConsistency = entries.length
    ? Math.round((lastWeekEntries.length / entries.length) * 100)
    : 0;
  const insightCards = [
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2V6" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16 2V6" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M3 10H21" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      ,
      value: lastWeekEntries.length,
      label: "Entries this week",
      bgColor: "#3498db", // Blue circle
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9 9H9.01" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15 9H15.01" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      ,
      value: dominantMood,
      label: "Dominant mood",
      bgColor: "#16A249",
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      ,
      value: `${weeklyConsistency}%`,
      label: "Weekly consistency",
      bgColor: "#7C3BED",
    },
  ];

  return (
    <div className="weekly-insights-cards">
      {insightCards.map((card, index) => (
        <div className="insight-card" key={index}>
          <div
            className="icon-circle"
            style={{ backgroundColor: card.bgColor }}
          >
            {card.icon}
          </div>
          <div className="value">{card.value}</div>
          <div className="label">{card.label}</div>
        </div>
      ))}
    </div>
  );



};

export default WeeklyInsights;
