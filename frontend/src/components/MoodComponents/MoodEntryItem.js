import React from 'react';

const MoodEntryItem = ({ entry }) => {
  const { mood, isStressed, note, date } = entry || {};
  const formattedDate = date ? new Date(date).toLocaleString() : '';

  return (
    <div className="mood-entry-item">
      <div className="mood-entry-header">
        <span className="mood-entry-mood">{mood}</span>
        {formattedDate && <span className="mood-entry-date">{formattedDate}</span>}
      </div>
      <div className="mood-entry-meta">
        <span className={`mood-entry-stress ${isStressed ? 'stressed' : 'calm'}`}>
          {isStressed ? 'Stressed' : 'Not stressed'}
        </span>
      </div>
      {note ? <div className="mood-entry-note">{note}</div> : null}
    </div>
  );
};

export default MoodEntryItem;
