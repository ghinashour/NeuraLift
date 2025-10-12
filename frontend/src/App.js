import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Sections
import Home from "./sections/Home";
import Navbar from "./components/Navbar";
import Features from "./sections/features";
import AboutSection from "./sections/AboutSection";
import SuccessStories from "./sections/SuccessStories";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";
import Layout from "./layouts/Layout";

// Pages
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

// Auth pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Profile from "./pages/Auth/Profile";
import VerifyEmail from "./pages/Auth/VerifyEmail";

// Challenges
import Challenges from "./pages/Challenges/Challenges";
import TrueFalse from "./pages/Challenges/TrueFalse";
import TenzisGame from "./pages/Challenges/TenzisGame";
import DevQuestions from "./pages/Challenges/DevQuestions";
import AssemblyGameComponent from './pages/Challenges/AssemblyGame';

// Admin
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminLogin from "./components/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import UsersManagement from "./components/admin/UsersManagement";
import AdminEvents from "./components/admin/AdminEvents"; 
import AdminNotes from "./components/admin/AdminNotes";
import AdminNoteAnalytics from "./components/admin/AdminNoteAnalytics";
//private route functionality
import PrivateRoute from "./components/privateRoute";
import AdminTasksPage from "./components/admin/AdminTasksPage";
import AdminSuccessStories from "./components/admin/AdminSucessStories";

function App() {
  return (
    <AdminAuthProvider>
      <TaskProvider>
        <MedicineProvider>
          <Router>
            <Routes>
              {/* Landing page(public) */}
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

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify" element={<VerifyEmail />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Main pages inside Layout */}
              <Route element={<Layout />}>
                <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="collaborate" element={<PrivateRoute><Collaborate /></PrivateRoute>} />
                <Route path="mytasks" element={<PrivateRoute><MyTasks /></PrivateRoute>} />
                <Route path="task/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
                <Route path="taskManager" element={<PrivateRoute><TaskManagerPage /></PrivateRoute>} />
                <Route path="stressRelief" element={<PrivateRoute><StressRelief /></PrivateRoute>} />
                <Route path="focustimer" element={<PrivateRoute><FocusTimer /></PrivateRoute>} />
                <Route path="medicineHealth" element={<MedicineHealth />} />
                <Route path="Schedule" element={<Schedule />} />
                <Route path="profile" element={<Profile />} />
                <Route path="moodTracker" element={<MoodTracker />} />
                <Route path="success-stories" element={<SuccessStory />} />
                <Route path="success-stories/my-story" element={<MyStory />} />

                {/* Challenges */}
                <Route path="challenges" element={<Challenges />} />
                <Route path="challenges/true-false" element={<TrueFalse />} />
                <Route path="challenges/tenzis-game" element={<TenzisGame />} />
                <Route path="challenges/dev-questions" element={<DevQuestions />} />
                <Route path="challenges/assembly-game" element={<AssemblyGameComponent />} />
              </Route>

              {/* Protected admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UsersManagement />} />
                {/* Add other admin routes here */}
                <Route path="moods" element={<div>Moods Management - Coming Soon</div>} />
                <Route path="events" element={<AdminEvents/>} />
                <Route path="notes" element={<AdminNotes/>} />
                <Route path="notes/analytics" element={<AdminNoteAnalytics/>} />
                <Route path="tasks" element={<AdminTasksPage/>} />
                <Route path="success-stories" element={<AdminSuccessStories/>} />
              </Route>
              
              {/* Redirect to admin login for unmatched admin routes */}
              <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </MedicineProvider>
      </TaskProvider>
    </AdminAuthProvider>
  );
}

export default App;