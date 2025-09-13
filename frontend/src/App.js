import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SuccessStories from './sections/SuccessStories';
import Features from "./sections/features";
import Contact from './sections/Contact';
import AboutSection from './sections/AboutSection';
import Home from './sections/Home';
import FocusTimer from './pages/FocusTimer/FocusTimer'; // Add this import

// Create a HomePage component with all your current sections
const HomePage = () => {
  return (
    <>
      <Home/>
      <Features />
      <AboutSection />
      <SuccessStories />
      <Contact />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home route with all your current sections */}
          <Route path="/" element={<HomePage />} />
          
          {/* Focus Timer route */}
          <Route path="/focus-timer" element={<FocusTimer />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;