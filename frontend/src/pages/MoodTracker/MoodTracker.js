import React, { useState, useEffect } from "react";
import { getMoods, addMood } from "../../api/axios";
import Header from "../../components/MoodComponents/Header";
import WeeklyInsights from "../../components/MoodComponents/WeeklyInsights";
import MoodSelector from "../../components/MoodComponents/MoodSelector";
import StressSelector from "../../components/MoodComponents/StressSelector";
import NoteInput from "../../components/MoodComponents/NoteInput";
import SubmitButton from "../../components/MoodComponents/SubmitButton";
import RecentEntries from "../../components/MoodComponents/RecentEntries";
import Divider from "../../components/MoodComponents/Divider";
import "../../styles/MoodTracker.css";

export default function MoodTracker({ token }) {
  const [moodEntries, setMoodEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [isStressed, setIsStressed] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch moods
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await getMoods();
        setMoodEntries(res);
      } catch (err) {
        console.error("Failed to fetch moods:", err);
        setError("Failed to load mood entries.");
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, []);

  const handleSubmit = async () => {
    if (!currentMood) return;
    try {
      const res = await addMood({ mood: currentMood, isStressed, note: noteText });
      setMoodEntries([res, ...moodEntries]);
      setCurrentMood(null);
      setIsStressed(false);
      setNoteText("");
    } catch (err) {
      console.error("Failed to add mood:", err);
      setError("Failed to save mood entry.");
    }
  };


  // Add test moods quickly
  const addTestMoods = async () => {
    const testMoods = [
      { mood: "Happy", isStressed: false, note: "Great day!" },
      { mood: "Sad", isStressed: true, note: "Had a rough day." },
      { mood: "Excited", isStressed: false, note: "Looking forward to the trip." },
    ];

    for (let m of testMoods) {
      try {
        const res = await addMood(m);
        setMoodEntries(prev => [res, ...prev]);
      } catch (err) {
        console.error("Failed to add test mood:", err.response || err);
      }
    }
  };

  return (
    <div className="App">
      <Header />

      <main className="main-content">
        <section className="insights-section">
          <h2>This Week's Insights</h2>
          {loading ? <p>Loading...</p> : <WeeklyInsights entries={moodEntries} />}
          {error && <p className="error-message">{error}</p>}
          {false && ( //for development mode only we will replace this line with {process.env.NODE_ENV !== 'production' && (
            <button onClick={addTestMoods}>Add Test Moods</button>
          )}
        </section>

        <Divider />

        <section className="mood-tracker-section">
          <h3>How are you feeling today?</h3>
          <MoodSelector selectedMood={currentMood} onMoodChange={setCurrentMood} />

          <div className="stress-question">
            <h4>Are you feeling stressed?</h4>
            <StressSelector isStressed={isStressed} onStressChange={setIsStressed} />
          </div>

          <NoteInput noteText={noteText} onNoteChange={setNoteText} />

          <SubmitButton isDisabled={!currentMood} onSubmit={handleSubmit} />
        </section>

        <Divider />

        <section className="recent-entries-section">
          <h3>Recent Entries</h3>
          {loading ? <p>Loading...</p> : <RecentEntries entries={moodEntries} />}
        </section>
      </main>
    </div>
  );
}
