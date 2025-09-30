import React from "react";
import AssemblyGameComponent from "../../components/Challenges/AssemblyGame1"; // Make sure this import matches your file structure

function AssemblyGame() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Assembly Programming Challenge</h1>
      <p>Welcome to the Assembly challenge! Guess the programming language before all languages disappear! 🎮</p>
      <AssemblyGameComponent />
    </div>
  );
}

export default AssemblyGame;