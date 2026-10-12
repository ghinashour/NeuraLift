import React, { useState, useEffect } from "react";
import { getMoods, addMood } from "../../api/axios";
import WeeklyInsights from "../../components/MoodComponents/WeeklyInsights";
import MoodSelector from "../../components/MoodComponents/MoodSelector";
import StressSelector from "../../components/MoodComponents/StressSelector";
import NoteInput from "../../components/MoodComponents/NoteInput";
import SubmitButton from "../../components/MoodComponents/SubmitButton";
import RecentEntries from "../../components/MoodComponents/RecentEntries";
import AILogo from '../../components/AiLogo';

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
      const raw = (process.env.REACT_APP_API_URL || "http://localhost:4000").replace(/\/$/, "");
      const apiBase = raw.endsWith("/api") ? raw : `${raw}/api`;
      const res = await fetch(`${apiBase}/moods/${id}`, {
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
    <div className="nl-page mood-page">
      <div className="nl-hero">
        <div className="nl-hero-copy">
          <p className="nl-eyebrow">Mood Tracker</p>
          <h1 className="nl-title">
            Check in with
            <br />
            <em>yourself</em> today.
          </h1>
          <p className="nl-lede">
            Track your emotional wellness and build healthy habits — one honest
            check-in at a time.
          </p>
        </div>
        <p className="nl-hero-quote">“Feelings are just visitors. Let them come and go.”</p>
      </div>

      <div className="mood-stack">
        <section className="nl-card" aria-label="Weekly insights">
          <h2 className="mood-card-title">This Week&apos;s Insights</h2>
          <WeeklyInsights entries={moodEntries} />
          {error && <p className="error-message">{error}</p>}
        </section>

        <section className="nl-card" aria-label="Log your mood">
          <h2 className="mood-card-title">How are you feeling today?</h2>
          <MoodSelector selectedMood={currentMood} onMoodChange={setCurrentMood} />

          <div className="stress-question">
            <h3 className="mood-sub">Are you feeling stressed?</h3>
            <StressSelector isStressed={isStressed} onStressChange={setIsStressed} />
          </div>

          <NoteInput noteText={noteText} onNoteChange={setNoteText} />
          <SubmitButton isDisabled={!currentMood} onSubmit={handleSubmit} />
        </section>

        <section className="nl-card" aria-label="Recent entries">
          <h2 className="mood-card-title">Recent Entries</h2>
          <RecentEntries
            entries={moodEntries}
            loading={loading}
            error={error}
            onDelete={handleDeleteMood}
          />
        </section>
      </div>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <AILogo />
      </div>
    </div>
  );
}
