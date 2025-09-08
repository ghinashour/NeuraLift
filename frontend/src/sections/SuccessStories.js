import React from 'react';
import '../styles/SuccessStories.css';
import quoteIcon from '../assets/quote.png';

const SuccessStories = () => {
  return (
    <div className="success-stories">
      <h1>Success Stories</h1>
      <p className="section-description">
        Real people, real transformations. Discover how NeuraLift has helped thousands of users improve their mental health and achieve their goals.
      </p>
      
      <div className="divider"></div>
      
      <div className="stories-grid">
        {/* Jessica M. */}
        <div className="story-card">
         <div className="quote-icon">
                <img src={quoteIcon} alt="Quote icon" />
          </div>
          <div className="rating-stars">★★★★★</div>
          <div className="testimonial-text">
            "NeuraLift helped me overcome anxiety and boost my productivity. The combination of task management and mindfulness tools changed my entire approach to work-life balance."
          </div>
          {/*the space between the text as a line*/}
          <div className="divider-small"></div>
        
          <div className="user-info">
            <div className="user-stats">Reduced stress by 70%</div>
            <h3>Jessica M.</h3>
            <p className="user-title">Marketing Professional</p>
          </div>
       
        </div>

        {/* David L. */}
        <div className="story-card">
          <div className="quote-icon">
            <img src={quoteIcon} alt="Quote icon" />
        </div>
          <div className="rating-stars">★★★★★</div>
          <div className="testimonial-text">
            "As a student dealing with depression, Neural It's community support and daily motivation gave me the strength to continue. I'm now thriving academically and personally."
          </div>
          <div className="divider-small"></div>
          <div className="user-info">
            <p className="user-stats">Improved mood by 65%</p>
            <h3>David L.</h3>
            <p className="user-title">College Student</p>
          </div>
        </div>

        {/* Maria S. */}
        <div className="story-card">
              <div className="quote-icon">
            <img src={quoteIcon} alt="Quote icon" />
        </div>
          <div className="rating-stars">★★★★★</div>
          <div className="testimonial-text">
            "The creative canvas feature became my daily stress relief ritual. Drawing while listening to guided meditations helped me process difficult emotions and find clarity."
          </div>
          <div className="divider-small"></div>
          <div className="user-info">
         <p className="user-stats">Sleep enhanced</p>
            <h3>Maria S.</h3>
            <p className="user-title">Small Business Owner</p>
          </div>
        </div>

        {/* Robert K. */}
        <div className="story-card">
              <div className="quote-icon">
            <img src={quoteIcon} alt="Quote icon" />
        </div>
          <div className="rating-stars">★★★★★</div>
          <div className="testimonial-text">
            "Working in healthcare during tough times, Neural It's health tracking and wellness tools helped me maintain my own wellbeing while caring for others."
          </div>
          <div className="divider-small"></div>
          <div className="user-info">
            <p className="user-stats">75% less Anxiety</p>
            <h3>Robert K.</h3>
            <p className="user-title">Healthcare Worker</p>
          </div>
        </div>

        {/* Aisha T. */}
        <div className="story-card">
              <div className="quote-icon">
            <img src={quoteIcon} alt="Quote icon" />
        </div>
          <div className="rating-stars">★★★★★</div>
          <div className="testimonial-text">
            "Between work and parenting, I felt overwhelmed. Neural It's gentle reminders and quick meditation sessions fit perfectly into my busy schedule."
          </div>
          <div className="divider-small"></div>
          <div className="user-info">
            <p className="user-stats">Productivity increased </p>
            <h3>Aisha T.</h3>
            <p className="user-title">New Parent</p>
          </div>
        </div>

        {/* Chris W. */}
        <div className="story-card">
              <div className="quote-icon">
            <img src={quoteIcon} alt="Quote icon" />
        </div>
          <div className="rating-stars">★★★★★</div>
          <div className="testimonial-text">
            "After retiring, I felt lost and disconnected. Neural It's community features helped me find new purpose and connect with like-minded individuals on similar journeys."
          </div>
          <div className="divider-small"></div>
          <div className="user-info">
           <p className="user-stats">New social connections</p>
            <h3>Chris W.</h3>
            <p className="user-title">Retired Teacher</p>
          </div>
        </div>
      </div>
      
      <div className="stats-section">
        <h2>Join thousands of others transforming their lives</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Reported Improvement</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.9/5</div>
            <div className="stat-label">User Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Lives Changed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">30 Days</div>
            <div className="stat-label">See Results</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;