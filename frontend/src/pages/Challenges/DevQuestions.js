import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DevCard from '../../components/Challenges/DevCard';

function DevQuestions() {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    axios.get('/api/devquestions')
      .then(res => setQuestions(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(prev => prev + 1);
  };

  const handleReset = () => {
    setScore(0);
    setQuestions([]); // optional: fetch again
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Developer Challenges</h1>
      <p className="mb-4 font-semibold">Score: {score}</p>

      {questions.map((q, index) => (
        <DevCard key={index} question={q} onAnswer={handleAnswer} />
      ))}

      {score === 10 && (
        <div className="mt-4 p-4 bg-green-200 rounded">
          <p className="font-bold">🎉 Congratulations! You scored 10!</p>
          <button
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default DevQuestions;
