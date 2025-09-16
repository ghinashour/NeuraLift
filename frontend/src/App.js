import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import TaskManagerPage from "./pages/TaskManager/TaskManager";
import { TaskProvider } from "./context/TaskContext";
import MyStory from './pages/SuccessStories/MyStory';
import SuccessStories from './pages/SuccessStories/SuccessStories';
import Layout from "./layouts/Layout";
import StressRelief from "./pages/StressReliefSpace/StressReliefSpace";

function App() {
  return (
    <>
      {/* landing page
      <Navbar />
      <Home />
      <Features />
      <AboutSection />
      <SuccessStories />
      <Contact />
      <Footer /> */}

      <TaskProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/stressRelief" element={<StressRelief />} />
              <Route path="/taskmanager" element={<TaskManagerPage />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/success-stories/my-story" element={<MyStory />} />
            </Routes>
          </Layout>
        </Router>
      </TaskProvider>
    </>
  );
}

export default App;
