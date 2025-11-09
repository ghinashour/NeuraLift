import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Challenges/DevQuestions.css";
import Swal from 'sweetalert2';

function DevQuestions() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);

  // Fetch questions from backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/devquestions`) // ✅ fixed URL
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("❌ Fetch error:", err));
  }, []);

  const handleSubmit = () => {
    if (!selectedOption) return;

    const currentQuestion = questions[currentIndex];
    const chosenAnswer = currentQuestion.choices.find(
      (c) => c.text === selectedOption
    );

    if (chosenAnswer && chosenAnswer.isCorrect) {
      setScore((prev) => prev + 1);
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOption("");
  };

  // Reset when score reaches 10
  useEffect(() => {
    if (score === 10) {
      Swal.fire({
        icon: 'success',
        title: '🎉 Congratulations!',
        text: 'You scored 10 points!',
        confirmButtonColor: '#3C83F6'
      });
      setScore(0);
      setCurrentIndex(0);
    }
  }, [score]);

  if (questions.length === 0) {
    return <p className="text-center mt-10">Loading questions...</p>;
  }

  if (currentIndex >= questions.length) {
    return (
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-2xl font-bold">You finished all questions 🎯</h2>
        <p className="mt-2">Final Score: {score}</p>
        <button
          onClick={() => {
            setScore(0);
            setCurrentIndex(0);
          }}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Restart
        </button>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="dev-questions-container">
      <div className="dev-question-card">
        <h2 className="dev-question-title">
          Q{currentIndex + 1}: {question.question}
        </h2>

        {/* Code snippet */}
        {question.snippet && (
          <pre className="dev-code-snippet">
            {question.snippet}
          </pre>
        )}

        {/* Choices */}
        <div className="dev-choice">
          {question.choices.map((choice, idx) => (
            <label
              key={idx}
              className="dev-choice-label"
            >
              <input
                type="radio"
                name="answer"
                value={choice.text}
                checked={selectedOption === choice.text}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="dev-choice-input"
              />
              {choice.text}
            </label>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className="dev-btn"
        >
          Submit
        </button>

        <p className="dev-score">Score: {score}</p>
      </div>
    </div>
  );
}

export default DevQuestions;
