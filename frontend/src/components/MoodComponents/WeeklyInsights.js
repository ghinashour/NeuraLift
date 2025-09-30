// components/WeeklyInsights.js
import React from 'react';

const WeeklyInsights = ({ entries }) => {
  // Calculate insights based on recent entries
  const getWeeklyInsights = () => {
    if (entries.length === 0) {
      return [
        "No entries yet this week",
        "Start tracking to see insights",
        "Your patterns will appear here"
      ];
    }

    const lastWeekEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate > weekAgo;
    });

    if (lastWeekEntries.length === 0) {
      return [
        "No entries this week",
        "Check back after adding entries",
        "Weekly consistency is key"
      ];
    }

    const moodCounts = {
      excellent: 0,
      good: 0,
      okay: 0,
      poor: 0,
      terrible: 0
    };

    let stressCount = 0;

    lastWeekEntries.forEach(entry => {
      moodCounts[entry.mood]++;
      if (entry.isStressed) stressCount++;
    });

    const totalEntries = lastWeekEntries.length;
    const mostFrequentMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    const insights = [
      `You've logged ${totalEntries} mood${totalEntries !== 1 ? 's' : ''} this week`,
      `Your most frequent mood was ${mostFrequentMood}`,
      `You reported feeling stressed ${stressCount} time${stressCount !== 1 ? 's' : ''}`
    ];

    return insights;
  };

  const insights = getWeeklyInsights();

  return (
    <div className="weekly-insights">
      <ul>
        {insights.map((insight, index) => (
          <li key={index}>{insight}</li>
        ))}
      </ul>
    </div>
  );
};

export default WeeklyInsights;