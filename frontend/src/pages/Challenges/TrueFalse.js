import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Challenges/TrueFalse.css";

function TrueFalse() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(""); // "correct" or "wrong"
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`process.env.REACT_APP_API_URL/api/questions/truefalse`);
        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, []);

  const resetGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setAnswered(false);
    setFeedback("");
    setShowCongrats(false);
  };

  const handleAnswer = (userAnswer) => {
    if (answered) return;

    const correctAnswer = questions[currentIndex].answer;
    if (userAnswer === correctAnswer) {
      const newScore = score + 1;
      setScore(newScore);
      setFeedback("correct");

      if (newScore >= 5) {
        setShowCongrats(true);

        // Automatically reset after 2 seconds
        setTimeout(() => {
          resetGame();
        }, 2000);

        return; // Stop further processing
      }
    } else {
      setFeedback("wrong");
    }

    setAnswered(true);

    setTimeout(() => {
      setAnswered(false);
      setFeedback("");
      setCurrentIndex((prev) => prev + 1);
    }, 1000);
  };

  if (questions.length === 0) {
    return <p className="loading">Loading questions...</p>;
  }

  return (
    <div className="true-false-game">
      <h1 className="title">True / False Challenge</h1>
      <p className="score">Score: {score}</p>

      {showCongrats && (
        <div className="congrats-popup">
          🎉 Congratulations! You reached 5 points! 🎉
        </div>
      )}

      {currentIndex < questions.length && !showCongrats && (
        <>
          <div className={`question-card ${feedback}`}>
            <h2>{questions[currentIndex].question}</h2>
          </div>

          <div className="answer-buttons">
            <button className="btn-true" onClick={() => handleAnswer(true)}>True ✅</button>
            <button className="btn-false" onClick={() => handleAnswer(false)}>False ❌</button>
          </div>
        </>
      )}

      {currentIndex >= questions.length && !showCongrats && (
        <div className="true-false-game-over">
          <h2>Game Over 🎮</h2>
          <p>Your score: {score} / {questions.length}</p>
          <button className="restart-button" onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default TrueFalse;
