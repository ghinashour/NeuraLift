import React from 'react';
import MoodEntryItem from './MoodEntryItem';

const RecentEntries = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="recent-entries">
        <p>No entries yet. Your mood entries will appear here.</p>
      </div>
    );
  }

  return (
    <div className="recent-entries">
      {entries.map(entry => (
        <MoodEntryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default RecentEntries;