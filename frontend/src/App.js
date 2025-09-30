import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Context
import { TaskProvider } from "./context/TaskContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Sections
import Home from "./sections/Home";
import Features from "./sections/features";
import AboutSection from "./sections/AboutSection";
import SuccessStories from "./sections/SuccessStories";
import Contact from "./sections/Contact";

// Layout
import Layout from "./layouts/Layout";

// Pages
import TaskManagerPage from "./pages/TaskManager/TaskManager";
import StressRelief from "./pages/StressReliefSpace/StressReliefSpace";
import FocusTimer from "./pages/FocusTimer/FocusTimer";
import Collaborate from "./pages/Collaborate";
import MyTasks from "./pages/MyTasks";
import TaskDetails from "./pages/TaskDetails";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <TaskProvider>
        <Routes>
          {/* Landing Page (with Navbar + Footer inline) */}
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

          {/* Dashboard → full screen (no Navbar + Footer) */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Other pages → wrapped in Layout (with Navbar + Footer) */}
          <Route element={<Layout />}>
            <Route path="taskmanager" element={<TaskManagerPage />} />
            <Route path="stressrelief" element={<StressRelief />} />
            <Route path="focustimer" element={<FocusTimer />} />
            <Route path="collaborate" element={<Collaborate />} />
            <Route path="mytasks" element={<MyTasks />} />
            <Route path="task/:id" element={<TaskDetails />} />
          </Route>
        </Routes>
      </TaskProvider>
    </Router>
  );
}

export default App;