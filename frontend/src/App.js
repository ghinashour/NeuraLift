import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Context Providers
import { TaskProvider } from "./context/TaskContext";
import { MedicineProvider } from "./context/MedicineContext";

// Layout Components
import Layout from "./layouts/Layout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Landing Page Sections
import Home from "./sections/Home";
import Features from "./sections/features";
import AboutSection from "./sections/AboutSection";
import SuccessStories from "./sections/SuccessStories";
import Contact from "./sections/Contact";

// Main Pages
import Dashboard from "./pages/Dashboard";
import TaskManagerPage from "./pages/TaskManager/TaskManager";
import StressRelief from "./pages/StressReliefSpace/StressReliefSpace";
import FocusTimer from "./pages/FocusTimer/FocusTimer";
import MedicineHealth from "./components/MedicineHealth/Medicine";
import Collaborate from "./pages/Collaborate";
import MyTasks from "./pages/MyTasks";
import TaskDetails from "./pages/TaskDetails";

// Authentication Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Profile from "./pages/Auth/Profile";
import VerifyEmail from "./pages/Auth/VerifyEmail";

// Success Stories Pages
import MyStory from "./pages/SuccessStories/MyStory";
import SuccessStory from "./pages/SuccessStories/SuccessStory";

// Challenges and Games Pages
import Challenges from "./pages/Challenges/Challenges";
import TrueFalse from "./pages/Challenges/TrueFalse";
import TenzisGame from "./pages/Challenges/TenzisGame";
import DevQuestions from "./pages/Challenges/DevQuestions";
import AssemblyGameComponent from "./pages/Challenges/AssemblyGame";

function App() {
  return (
    <Router>
      <TaskProvider>
        <MedicineProvider>
          <Routes>
            {/* Landing Page - Full page with integrated sections */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                  <Features />
                  <AboutSection />
                  <SuccessStories />
                  <Contact />
                  <Footer />
                </>
              }
            />

            {/* Authentication Routes - Standalone pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify/:token" element={<VerifyEmail />} />

            {/* Dashboard - Full screen (no Navbar/Footer) */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* App Pages - Wrapped in Layout (with Navbar/Footer) */}
            <Route element={<Layout />}>
              {/* Main Features */}
              <Route path="/taskmanager" element={<TaskManagerPage />} />
              <Route path="/stressrelief" element={<StressRelief />} />
              <Route path="/focustimer" element={<FocusTimer />} />
              <Route path="/medicinehealth" element={<MedicineHealth />} />
              
              {/* Task Management */}
              <Route path="/collaborate" element={<Collaborate />} />
              <Route path="/mytasks" element={<MyTasks />} />
              <Route path="/task/:id" element={<TaskDetails />} />
              
              {/* User Profile */}
              <Route path="/profile" element={<Profile />} />
              
              {/* Success Stories */}
              <Route path="/success-stories" element={<SuccessStory />} />
              <Route path="/success-stories/my-story" element={<MyStory />} />
              
              {/* Challenges & Games */}
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/challenges/true-false" element={<TrueFalse />} />
              <Route path="/challenges/tenzis-game" element={<TenzisGame />} />
              <Route path="/challenges/dev-questions" element={<DevQuestions />} />
              <Route path="/challenges/assembly-game" element={<AssemblyGameComponent />} />
            </Route>
          </Routes>
        </MedicineProvider>
      </TaskProvider>
    </Router>
  );
}

export default App;