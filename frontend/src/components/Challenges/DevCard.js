import React, { useState } from 'react';

function DevCard({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);

  const handleClick = (choice, index) => {
    setSelected(index);
    onAnswer(choice.isCorrect);
  };

  return (
    <div className="card p-4 shadow rounded bg-white mb-4">
      <p className="mb-2 font-semibold">{question.question}</p>
      {question.snippet && (
        <pre className="bg-gray-100 p-2 rounded mb-2">{question.snippet}</pre>
      )}
      <div className="flex gap-2">
        {question.choices.map((choice, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded ${
              selected === index ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleClick(choice, index)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DevCard;
