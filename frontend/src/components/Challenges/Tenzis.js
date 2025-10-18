import React, { useState, useEffect } from "react";
import Dice from "./dice";
import "../../styles/Challenges/tensizgame.css";

function Tenzies() {
  const generateDice = () => {
    return Array.from({ length: 10 }, () => ({
      // random number between 1-6
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: Math.random().toString(36).substr(2, 9),
    }));
  };

  const [dice, setDice] = useState(generateDice());
  const [rolls, setRolls] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const allHeld = dice.every(d => d.isHeld);
    const firstVal = dice[0].value;
    const allSame = dice.every(d => d.value === firstVal);

    if (allHeld && allSame) {
      setWon(true);
      saveGameResult(rolls); // send to backend
    }
  }, [dice]);

  const rollDice = () => {
    //resetting the game if won
    if (won) {
      setDice(generateDice());
      setRolls(0);
      setWon(false);
    } else {
      setDice(oldDice =>
        oldDice.map(d => (d.isHeld ? d : { ...d, value: Math.ceil(Math.random() * 6) }))
      );
      setRolls(r => r + 1);
    }
  };

  const toggleHold = (id) => {
    setDice(oldDice => oldDice.map(d => d.id === id ? { ...d, isHeld: !d.isHeld } : d));
  };

  const saveGameResult = async (rolls) => {
    try {
      await fetch("http://localhost:4000/api/tenzies/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rolls }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="tenzies">
      <h2>🎉 Welcome To The Game 🎉</h2>
      <p>Roll until all dice are the same. Click dice to hold.</p>
      <div className="dice-container">
        {dice.map(d => (
          <Dice key={d.id} value={d.value} isHeld={d.isHeld} toggleHold={() => toggleHold(d.id)} />
        ))}
      </div>
      <button className="roll-btn" onClick={rollDice}>
        {won ? "New Game" : "Roll"}
      </button>
      <p>Rolls: {rolls}</p>
      {won && <h3>🎉 You Won in {rolls} rolls!</h3>}
    </div>
  );
}

export default Tenzies;
