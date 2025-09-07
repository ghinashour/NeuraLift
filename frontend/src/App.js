import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Features from "./sections/features";
import SuccessStories from "./sections/SuccessStories";
import Contact from "./sections/Contact"; // import Contact section

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* Features Section */}
      <Features />
      {/* Other components */}
      <SuccessStories />

      {/* Contact Section */}
      <Contact />

      <Footer />
    </div>
  );
}

export default App;
