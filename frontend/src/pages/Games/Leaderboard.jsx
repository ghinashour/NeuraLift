import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
  const [tenzis, setTenzis] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const t = await API.get('/games/leaderboard/tenzis-solo');
        setTenzis(t.data || []);
      } catch (err) {
        console.warn(err);
      }
      try {
        const q = await API.get('/games/leaderboard/code-quiz');
        setQuiz(q.data || []);
      } catch (err) {
        console.warn(err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="App" style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>Leaderboard</h2>

      <section style={{ marginTop: 16 }}>
        <h3>Tenzis (Top Scores)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', maxWidth: 900, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>#</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Player</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {tenzis.map((row, i) => (
                <tr key={row.userId} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{i + 1}</td>
                  <td style={{ padding: 8 }}>{row.username}</td>
                  <td style={{ padding: 8 }}>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Code Quiz (Top Scores)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', maxWidth: 900, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>#</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Player</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {quiz.map((row, i) => (
                <tr key={row.userId} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{i + 1}</td>
                  <td style={{ padding: 8 }}>{row.username}</td>
                  <td style={{ padding: 8 }}>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
