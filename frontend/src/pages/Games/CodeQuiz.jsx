import React, { useState } from 'react';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CodeQuiz() {
  const [gameId, setGameId] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startGame = async () => {
    setLoading(true);
    try {
      const res = await API.post('/games/code-quiz/start');
      setGameId(res.data.gameId);
      setQuestion(res.data.question);
      setAttempts([]);
    } catch (err) {
      console.error(err);
      alert('Failed to start quiz. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!gameId) return alert('Start a game first');
    try {
      const res = await API.post(`/games/code-quiz/submit/${gameId}`, { answer });
      setAttempts(res.data.attempts || []);
      if (res.data.correct) {
        alert('Correct! Nice job 🎉');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit. Make sure you are logged in.');
    }
  };

  return (
    <div className="App" style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>Code Quiz</h2>
      {!gameId ? (
        <button onClick={startGame} disabled={loading} className="submit-button">
          {loading ? 'Starting…' : 'Start Quiz (requires login)'}
        </button>
      ) : (
        <div>
          <div style={{ marginTop: 20 }}>
            <strong>Question</strong>
            <p>{question}</p>
          </div>

          <div style={{ marginTop: 12 }}>
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer"
              style={{ padding: 8, width: '100%', maxWidth: 480 }}
            />
            <div style={{ marginTop: 8 }}>
              <button onClick={submit} className="submit-button">Submit Answer</button>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <h4>Attempts</h4>
            {attempts.length === 0 && <p>No attempts yet</p>}
            <ul>
              {attempts.map((a, idx) => (
                <li key={idx}>{a.answer} — {a.correct ? '✅' : '❌'}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
