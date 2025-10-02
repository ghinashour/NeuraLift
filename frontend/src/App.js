import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
//import the sections of the app
import Home from "./sections/Home"
import Navbar from "./components/Navbar"
import Features from "./sections/features"
import AboutSection from "./sections/AboutSection"
import SuccessStories from "./sections/SuccessStories"
import Contact from "./sections/Contact"
import Footer from  "./components/Footer"
import Layout from "./layouts/Layout"


// Importing pages
import MyStory from './pages/SuccessStories/MyStory';
import SuccessStory from './pages/SuccessStories/SuccessStory';
import StressRelief from "./pages/StressReliefSpace/StressReliefSpace";
import FocusTimer from "./pages/FocusTimer/FocusTimer";
import MedicineHealth from "./components/MedicineHealth/Medicine";
import { MedicineProvider } from "./context/MedicineContext";
import TaskManagerPage from "./pages/TaskManager/TaskManager";
import { TaskProvider } from "./context/TaskContext";
import Schedule from "./pages/SchedulePage/SchedulePage";
import MoodTracker from "./pages/MoodTracker/MoodTracker";
import Collaborate from "./pages/Collaborate";
import MyTasks from "./pages/MyTasks";
import TaskDetails from "./pages/TaskDetails";
import Dashboard from "./pages/Dashboard";

// Authentication pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Profile from "./pages/Auth/Profile";
import VerifyEmail from "./pages/Auth/VerifyEmail";

// Challenges and Games pages
import Challenges from "./pages/Challenges/Challenges";
import TrueFalse from "./pages/Challenges/TrueFalse";
import TenzisGame from "./pages/Challenges/TenzisGame";
import DevQuestions from "./pages/Challenges/DevQuestions";
import AssemblyGameComponent from './pages/Challenges/AssemblyGame';


function App() {
  return (
    <Router>
      <TaskProvider>
        <MedicineProvider>
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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
               <Route path="/verify/:token" element={<VerifyEmail />} />

            {/* Other pages inside Layout */}
              <Route element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="collaborate" element={<Collaborate />} />
              <Route path="mytasks" element={<MyTasks />} />
              <Route path="task/:id" element={<TaskDetails />} />
              <Route path="taskManager" element={<TaskManagerPage />} />
              <Route path="stressRelief" element={<StressRelief />} />
              <Route path="focustimer" element={<FocusTimer />} />
              <Route path="medicineHealth" element={<MedicineHealth />} />
              <Route path="/Schedule" element={<Schedule />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/moodTracker" element={<MoodTracker/>} />
              <Route path="/success-stories" element={<SuccessStory />} />
              <Route path="/success-stories/my-story" element={<MyStory />} />
              {/*challenges page route and it's sub pages*/}
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