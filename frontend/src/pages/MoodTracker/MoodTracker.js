import React, { useState, useEffect } from 'react';
import Header from '../../components/MoodComponents/Header';
import WeeklyInsights from '../../components/MoodComponents/WeeklyInsights';
import MoodSelector from '../../components/MoodComponents/MoodSelector';
import StressSelector from '../../components/MoodComponents/StressSelector';
import NoteInput from '../../components/MoodComponents/NoteInput';
import SubmitButton from '../../components/MoodComponents/SubmitButton';
import RecentEntries from '../../components/MoodComponents/RecentEntries';
import Divider from '../../components/MoodComponents/Divider';
import "../../styles/MoodTracker.css"
export default function MoodTracker(){
  const [moodEntries, setMoodEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [isStressed, setIsStressed] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save data to localStorage whenever moodEntries changes
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  const handleMoodChange = (mood) => {
    setCurrentMood(mood);
  };

  const handleStressChange = (stressed) => {
    setIsStressed(stressed);
  };

  const handleNoteChange = (text) => {
    setNoteText(text);
  };

  const handleSubmit = () => {
    if (currentMood === null) return;

    const newEntry = {
      id: Date.now(),
      date: new Date(),
      mood: currentMood,
      isStressed: isStressed,
      note: noteText
    };

    setMoodEntries([newEntry, ...moodEntries]);
    setCurrentMood(null);
    setIsStressed(null);
    setNoteText('');
  };

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        <section className="insights-section">
          <h2>This Week's Insights</h2>
          <WeeklyInsights entries={moodEntries} />
        </section>

        <Divider />

        <section className="mood-tracker-section">
          <h3>How are you feeling today?</h3>
          <p>Select your mood:</p>
          
          <MoodSelector 
            selectedMood={currentMood} 
            onMoodChange={handleMoodChange} 
          />
          
          <div className="stress-question">
            <h4>Are you feeling stressed?</h4>
            <StressSelector 
              isStressed={isStressed} 
              onStressChange={handleStressChange} 
            />
          </div>
          
          <NoteInput 
            noteText={noteText} 
            onNoteChange={handleNoteChange} 
          />
          
          <SubmitButton 
            isDisabled={currentMood === null} 
            onSubmit={handleSubmit} 
          />
        </section>

        <Divider />

        <section className="recent-entries-section">
          <h3>Recent Entries</h3>
          <RecentEntries entries={moodEntries} />
        </section>
      </main>

    </div>
  );
}