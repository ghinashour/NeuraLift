
import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SuccessStories from './sections/SuccessStories';
import Features from "./sections/features";
import Contact from './sections/Contact'; // import Contact section
import AboutSection from './sections/AboutSection'; // import About section
import Home from './sections/Home';


function App() {
  return (
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
  );
}

export default App;
