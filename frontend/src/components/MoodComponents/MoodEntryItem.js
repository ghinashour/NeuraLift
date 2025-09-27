import React from "react";

const MoodEntryItem = ({entry})=>{

    //formatting the recieved date 
    const formatDate = (date) =>{
        return new Date(date).toLocaleDateString('en-US', {
            year:'numeric',
            month:'2-digit',
            day:'2-digit',
            hour:'2-digit',
            minute:'2-digit'
        });  
    };

    //getting the emogy of the user's mood
    const getMoodEmoji = (mood) =>{
        const emojies = {
            excellent: '😄',
            good: '😊',
            okay: '😐',
            poor: '😕',
            terrible: '😢'
        };
        return emojies[mood] || '❓';
    };
    return(
         <div className="mood-entry-item">
      <div className="entry-header">
        <span className="entry-date">{formatDate(entry.date)}</span>
        <span className="entry-mood">
          {getMoodEmoji(entry.mood)} {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
        </span>
        <span className="entry-stress">
          {entry.isStressed !== null && 
            ` Stressed: ${entry.isStressed ? 'Yes' : 'No'}`}
        </span>
      </div>
      {entry.note && <p className="entry-note">"{entry.note}"</p>}
    </div>
    );
};

export default MoodEntryItem;