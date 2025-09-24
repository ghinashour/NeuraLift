import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import TaskManagerPage from "./pages/TaskManager/TaskManager";
import { TaskProvider } from "./context/TaskContext";
import Footer from "./components/Footer";
import SuccessStories from "./sections/SuccessStories";
import Features from "./sections/features";
import Contact from "./sections/Contact";
import AboutSection from "./sections/AboutSection";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import MyStory from './pages/SuccessStories/MyStory';
import SuccessStory from './pages/SuccessStories/SuccessStory';
import Layout from "./layouts/Layout";
import StressRelief from "./pages/StressReliefSpace/StressReliefSpace";
import FocusTimer from "./pages/FocusTimer/FocusTimer";
import MoodTracker from "./pages/MoodTracker/MoodTracker";
import MedicineHealth from "./components/MedicineHealth/Medicine";
import { MedicineProvider } from "./context/MedicineContext";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Profile from "./pages/Auth/Profile";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Challenges from "./pages/Challenges/Challenges";

function App() {
  return (
    <Router>
      <TaskProvider>
        <MedicineProvider>
          <Routes>
            {/* Landing page */}
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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
               <Route path="/verify/:token" element={<VerifyEmail />} />

            {/* Other pages inside Layout */}
            <Route element={<Layout />}>
              <Route path="taskManager" element={<TaskManagerPage />} />
              <Route path="stressRelief" element={<StressRelief />} />
              <Route path="focustimer" element={<FocusTimer />} />
              <Route path="medicineHealth" element={<MedicineHealth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/success-stories" element={<SuccessStory />} />
              <Route path="/success-stories/my-story" element={<MyStory />} />
               <Route path="/Challenges" element={<Challenges />} />

            </Route>
          </Routes>
        </MedicineProvider>
      </TaskProvider>
    </Router>
  );
}

export default App;
