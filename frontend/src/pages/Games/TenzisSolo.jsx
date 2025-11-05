import React, { useState } from 'react';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function TenzisSolo() {
  const [gameId, setGameId] = useState(null);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const start = async () => {
    setLoading(true);
    try {
      const res = await API.post('/games/tenzis/start');
      setGameId(res.data.gameId);
      setState(res.data.state);
    } catch (err) {
      console.error(err);
      alert('Failed to start game. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const roll = async () => {
    if (!gameId) return alert('Start a game first');
    try {
      const res = await API.post(`/games/tenzis/roll/${gameId}`);
      setState(res.data.state);
    } catch (err) {
      console.error(err);
      alert('Failed to roll. Make sure you are logged in.');
    }
  };

  return (
    <div className="App" style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>Tenzis (Solo)</h2>
      {!gameId ? (
        <button onClick={start} disabled={loading} className="submit-button">
          {loading ? 'Starting…' : 'Start Game (requires login)'}
        </button>
      ) : (
        <div style={{ marginTop: 20 }}>
          <div>
            <strong>Roll:</strong>
            <div style={{ marginTop: 10, fontSize: 20 }}>
              {state.roll.map((d, i) => (
                <span key={i} style={{ display: 'inline-block', width: 44, height: 44, lineHeight: '44px', borderRadius: 8, background: '#fff', marginRight: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>{d}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div>Score: <strong>{state.score}</strong></div>
            <div>Rolls left: {state.rollsLeft}</div>
            {state.finished && (
              <div style={{ marginTop: 8 }}>
                <strong>{state.result && state.result.won ? 'You won! 🎉' : 'Game finished'}</strong>
                <div>Final Score: {state.result && state.result.finalScore}</div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            <button onClick={roll} className="submit-button" disabled={state.finished || state.rollsLeft <= 0}>Roll</button>
          </div>
        </div>
      )}
    </div>
  );
}
