
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SuccessStories from './sections/SuccessStories';
import Features from "./sections/features";
import Contact from './sections/Contact'; // import Contact section
import AboutSection from './sections/AboutSection'; // import About section
import Home from './sections/Home';
import Sidebar from './layouts/Sidebar';
import TaskManagerPage from './pages/TaskManager/TaskManager';
import { TaskProvider } from './context/TaskContext';



function App() {
  return (
    <>    
      <div className="App">
        <Navbar />


        <Home/>
        <Features />
        
        {/* About Section */}
        <AboutSection />

        {/* Other components */}
        <SuccessStories />

        {/* Contact Section */}
        <Contact />

        <Footer />

      </div>

      <TaskProvider>
            <Router>
                <Sidebar>
                    <Routes>
                        <Route path="/taskmanager" element={<TaskManagerPage />} />
                    </Routes>
                </Sidebar>
            </Router>
        </TaskProvider>
    </>

  );
}

export default App;
