import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Context Providers
import { TaskProvider } from "./context/TaskContext";
import { MedicineProvider } from "./context/MedicineContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

// Layout Components
import Layout from "./layouts/Layout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/privateRoute";

// Landing Page Sections
import Home from "./sections/Home";
import Features from "./sections/features";
import AboutSection from "./sections/AboutSection";
import SuccessStories from "./sections/SuccessStories";
import Contact from "./sections/Contact";

// Pages
import Dashboard from "./pages/Dashboard";
import TaskManagerPage from "./pages/TaskManager/TaskManager";
import StressRelief from "./pages/StressReliefSpace/StressReliefSpace";
import FocusTimer from "./pages/FocusTimer/FocusTimer";
import MedicineHealth from "./components/MedicineHealth/Medicine";
import Collaborate from "./pages/Collaborate";
import MyTasks from "./pages/MyTasks";
import TaskDetails from "./pages/TaskDetails";
import Schedule from "./pages/SchedulePage/SchedulePage";
import MoodTracker from "./pages/MoodTracker/MoodTracker";
import ChatbotPage from "./pages/ChatbotPage/ChatbotPage";
import MyTaskPage from "./pages/MyTaskPage";
import MyTaskDetails from "./pages/MyTaskDetails";
import ChattingCollab from "./pages/ChattingCollab";
import AssignedTasksPage from "./pages/AssignedTasksPage";
// Auth pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Profile from "./pages/Auth/Profile";
import VerifyEmail from "./pages/Auth/VerifyEmail";

// Success Stories
import MyStory from "./pages/SuccessStories/MyStory";
import SuccessStory from "./pages/SuccessStories/SuccessStory";

// Challenges & Games
import Challenges from "./pages/Challenges/Challenges";
import TrueFalse from "./pages/Challenges/TrueFalse";
import TenzisGame from "./pages/Challenges/TenzisGame";
import DevQuestions from "./pages/Challenges/DevQuestions";
import AssemblyGameComponent from "./pages/Challenges/AssemblyGame";

// Admin
import AdminLogin from "./components/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import UsersManagement from "./components/admin/UsersManagement";
import AdminEvents from "./components/admin/AdminEvents";
import AdminNotes from "./components/admin/AdminNotes";
import AdminNoteAnalytics from "./components/admin/AdminNoteAnalytics";
//private route functionality
import AdminTasksPage from "./components/admin/AdminTasksPage";
import AdminSuccessStories from "./components/admin/AdminSucessStories";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <AdminAuthProvider>
      <TaskProvider>
        <MedicineProvider>
          <ChatProvider>
            <Router>
              <Routes>
                {/* Landing Page */}
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

                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify/:verificationToken" element={<VerifyEmail />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Main App Pages - Require Layout */}
                <Route element={<Layout />}>
                  {/* Core Features */}
                  <Route
                    path="dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="taskmanager"
                    element={
                      <PrivateRoute>
                        <TaskManagerPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="stressrelief"
                    element={
                      <PrivateRoute>
                        <StressRelief />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="focustimer"
                    element={
                      <PrivateRoute>
                        <FocusTimer />
                      </PrivateRoute>
                    }
                  />
                  <Route path="medicinehealth" element={<MedicineHealth />} />
                  <Route
                    path="collaborate"
                    element={
                      <PrivateRoute>
                        <Collaborate />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="mytasks"
                    element={
                      <PrivateRoute>
                        <MyTasks />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="task/:id"
                    element={
                      <PrivateRoute>
                        <TaskDetails />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="schedule"
                    element={
                      <PrivateRoute>
                        <Schedule />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="moodtracker"
                    element={
                      <PrivateRoute>
                        <MoodTracker />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="ai-assistant"
                    element={
                      <PrivateRoute>
                        <ChatbotPage />
                      </PrivateRoute>
                    }
                  />

                  {/* Success Stories */}
                  <Route path="success-stories" element={<SuccessStory />} />
                  <Route path="success-stories/my-story" element={<MyStory />} />

                {/* Challenges */}
                <Route path="challenges" element={<Challenges />} />
                <Route path="challenges/true-false" element={<TrueFalse />} />
                <Route path="challenges/tenzis-game" element={<TenzisGame />} />
                <Route path="challenges/dev-questions" element={<DevQuestions />} />
                <Route path="challenges/assembly-game" element={<AssemblyGameComponent />} />
              </Route>
             <Route path="/ChattingCollab" element={<ChattingCollab />} />
              <Route path="/my-tasks" element={<MyTaskPage />} />
              <Route path="/mytasks/:id" element={<MyTaskDetails />} />
              <Route path="/assigned-tasks" element={<AssignedTasksPage />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="moods" element={<div>Moods Management - Coming Soon</div>} />
                <Route path="events" element={<AdminEvents/>} />
                <Route path="notes" element={<AdminNotes/>} />
                <Route path="notes/analytics" element={<AdminNoteAnalytics/>} />
                <Route path="tasks" element={<AdminTasksPage/>} />
                <Route path="success-stories" element={<AdminSuccessStories/>} />
              </Route>

                {/* Redirects */}
                <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ChatProvider>
        </MedicineProvider>
      </TaskProvider>
    </AdminAuthProvider>
  );
}

export default App;
