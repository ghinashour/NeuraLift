// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SuccessStories from './sections/SuccessStories';
import Features from "./sections/features";
import Contact from './sections/Contact';
import AboutSection from './sections/AboutSection';
import Home from './sections/Home';
import Dashboard from './pages/Dashboard'; // Dashboard page

// AppWrapper is rendered inside the Router, so useLocation() works here.
function AppWrapper() {
  const location = useLocation();

  // Hide nav/footer for /dashboard and any nested routes like /dashboard/*:
  const hideNavFooter = location.pathname.startsWith("/dashboard");

  return (
    <div className="App">
      {/* Show Navbar unless we are on dashboard (or a dashboard sub-route) */}
      {!hideNavFooter && <Navbar />}

      <Routes>
        {/* Main sections (landing page composed of multiple sections) */}
        <Route path="/" element={
          <>
            <Home />
            <Features />
            <AboutSection />
            <SuccessStories />
            <Contact />
          </>
        } />

        {/* Dashboard page (and any nested dashboard routes if you add them) */}
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>

      {/* Show Footer unless we are on dashboard (or a dashboard sub-route) */}
      {!hideNavFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;