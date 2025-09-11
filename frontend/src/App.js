
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TaskManagerPage from './pages/TaskManager/TaskManager';
import { TaskProvider } from './context/TaskContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SuccessStories from './sections/SuccessStories';
import Features from "./sections/features";
import Contact from './sections/Contact'; // import Contact section
import AboutSection from './sections/AboutSection'; // import About section
import Home from './sections/Home';



function App() {
  return (
    <> 
        {/*landing page*/}
        <Navbar />
        <Home/>
        <Features />
        <AboutSection />
        <SuccessStories />
        <Contact />
        <Footer />    
      
      <TaskProvider>
            <Router>
                    <Routes>
                        <Route path="/taskmanager" element={<TaskManagerPage />} />
                    </Routes>
            </Router>
        </TaskProvider>
    </>

  );
}

export default App;
