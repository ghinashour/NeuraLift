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

  // Fetch moods on mount
  useEffect(() => {
    const fetchMoods = async () => {
      setLoading(true);
      try {
        const res = await getMoods();
        setMoodEntries(Array.isArray(res) ? res : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch moods:", err);
        setError("Failed to load mood entries.");
        setMoodEntries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMoods();
  }, []);

  // Add new mood entry
  const handleSubmit = async () => {
    if (!currentMood) return;
    try {
      const res = await addMood({ mood: currentMood, isStressed, note: noteText }, token);
      setMoodEntries((prev) => [res, ...prev]);
      setCurrentMood(null);
      setIsStressed(false);
      setNoteText("");
    } catch (err) {
      console.error("Failed to add mood:", err);
      setError("Failed to save mood entry.");
    }
  };

  // Delete mood entry
  const handleDeleteMood = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/moods/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete mood");
      }

      // ✅ Update UI instantly
      setMoodEntries((prev) => prev.filter((entry) => entry._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete mood");
    }
  };

  return (
    <div className="App">
      <Header />

      <main className="main-content">
        <section className="insights-section">
          <h2>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M18.3333 5.8335L11.25 12.9168L7.08334 8.75016L1.66667 14.1668"
                stroke="#3C83F6"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.3333 5.8335H18.3333V10.8335"
                stroke="#3C83F6"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            This Week's Insights
          </h2>
          <WeeklyInsights entries={moodEntries} />
          {error && <p className="error-message">{error}</p>}
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
          <RecentEntries
            entries={moodEntries}
            loading={loading}
            error={error}
            onDelete={handleDeleteMood}
          />
        </section>
      </main>
    </div>
  );
}
