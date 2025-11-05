import React, { useState } from "react";
import "../styles/Contact.css";
import { FaEnvelope, FaComments, FaPhone, FaPaperPlane } from "react-icons/fa";
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api"; // Define backend API base URL

function Contact() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on submission

    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, {
        firstName,
        email,
        subject,
        message,
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message,
        confirmButtonColor: '#3C83F6'
      });

      // Clear form fields
      setFirstName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting contact form:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to send message. Please try again later.',
        confirmButtonColor: '#3C83F6'
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <section id="Contact" className="contact-section">
      {/* Title */}
      <h2 className="contact-title">Get in Touch</h2>
      <p className="contact-subtitle">
        Have questions about NeuraLift? We'd love to hear from you. Send us a
        message and we'll respond as quickly as possible.
      </p>

      <div className="contact-grid">
        {/* Contact Form */}
        <div className="contact-form">
          <h3 className="form-title">Send us a Message</h3>

          <form onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-form-group">
                <label className="contact-label">
                  First Name<span className="contact-required" style={{ color: "red" }}>* </span>
                </label>
                <input
                  className="contact-input contact-inputcolor"
                  type="text"
                  placeholder="Your full name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label className="contact-label">
                  Email Address<span className="contact-required" style={{ color: "red" }}>* </span>
                </label>
                <input
                  className="contact-input contact-inputcolor"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              {" "}
              <label className="contact-label">Subject</label>
              <input
                className="contact-input contact-inputcolor"
                type="text"
                placeholder="What's this about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <label className="contact-label">
                Message<span className="contact-required" style={{ color: "red" }}>* </span>
              </label>
              <textarea
                style={{ height: "170px", marginBottom: "20px" }}
                className="contact-textarea contact-inputcolor"
                placeholder="Tell us more about how we can help you"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-send-button" disabled={loading}> {/* Disable button when loading */}
              {loading ? 'Sending...' : <FaPaperPlane className="contact-button-icon" />} {/* Change text/icon based on loading state */}
              {loading ? '' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Other Ways to Reach Us */}
        <div className="contact-info">
          <h3 className="contact-info-title">Other ways to Reach Us</h3>
          <p className="contact-info-subtitle">
            We're here to help you on your wellness journey. Choose the method
            that works best for you to get in touch with our team.
          </p>

          {/* Card 1 - Email */}
          <div className="contact-info-card">
            <div className="contact-icon-box email">
              <FaEnvelope className="contact-icon" />
            </div>
            <div>
              <h4>Email Support</h4>
              <p>Reach us by email for any inquiries</p>
              <span className="contact-highlight">info.NeuraLift@gmail.com</span>
            </div>
          </div>

          {/* Card 2 - Live Chat */}
          <div className="contact-info-card">
            <div className="contact-icon-box chat">
              <FaComments className="contact-icon" />
            </div>
            <div>
              <h4>Live Chat</h4>
              <p>Chat with us in real-time</p>
              <span className="contact-highlight green">Available 24/7</span>
            </div>
          </div>

          {/* Card 3 - Phone */}
          <div className="contact-info-card">
            <div className="contact-icon-box phone">
              <FaPhone className="contact-icon" />
            </div>
            <div>
              <h4>Phone Support</h4>
              <p>Speak directly with our team</p>
              <span className="contact-highlight purple">+961 11111111</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
