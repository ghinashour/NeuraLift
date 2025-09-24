
import React from 'react';

const NoteInput = ({ noteText, onNoteChange }) => {
  return (
    <div className="note-input">
      <h4>Add a note (optional)</h4>
      <textarea
        value={noteText}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="What's contributing to your mood today? Any insights or reflections..."
        rows={4}
      />
      <div className="char-count">{noteText.length}/500</div>
    </div>
  );
};

export default NoteInput;