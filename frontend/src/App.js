import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SuccessStories from './sections/SuccessStories';
import Contact from './sections/Contact'; // import Contact section

function App() {
  return (
    <div className="App">
      <Navbar />

      {/* Other components */}
      <SuccessStories />

      {/* Contact Section */}
      <Contact />

      <Footer />
    </div>
  );
}

export default App;