
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TaskManagerPage from './pages/TaskManager/TaskManager';
import { TaskProvider } from './context/TaskContext';
import HomePage  from './landingPage/thehome';



function App() {
  return (
    <>    
      
      <TaskProvider>
            <Router>
                    <Routes>
                        <Route path="/" element={<HomePage/>} />
                        <Route path="/taskmanager" element={<TaskManagerPage />} />
                    </Routes>
            </Router>
        </TaskProvider>
    </>

  );
}

export default App;
