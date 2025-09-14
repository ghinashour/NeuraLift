import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import TaskManagerPage from "./pages/TaskManager/TaskManager";
import { TaskProvider } from "./context/TaskContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SuccessStories from "./sections/SuccessStories";
import Features from "./sections/features";
import Contact from "./sections/Contact"; 
import AboutSection from "./sections/AboutSection"; 
import Home from "./sections/Home";
import Layout from "./layouts/Layout";
import StressRelief from "./pages/StressReliefSpace/StressReliefSpace";
import MoodTracker from "./pages/MoodTracker/MoodTracker";

function App() {
  return (
    <Router>
      <TaskProvider>
        <Routes>
          {/* Landing page */}
          <Route
            path="/"
            element={
              <>
               <Navbar/>
                <Home />
                <Features />
                <AboutSection />
                <SuccessStories />
                <Contact />
                <Footer />
              </>
            }
          />

          {/* Other pages inside Layout */}
          <Route element={<Layout/>}>
            <Route path="taskManager" element={<TaskManagerPage/>} />
            <Route path="stressRelief" element={<StressRelief/>} />
            <Route path="MoodTracker" element={<MoodTracker/>} />
          </Route>
        </Routes>
      </TaskProvider>
    </Router>
  );
}

export default App;
