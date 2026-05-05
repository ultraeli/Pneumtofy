import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardMetrics from './DashboardMetrics';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartTracking = () => {
    navigate('/symptom-form');
  };

  const handleLearnMore = () => {
    navigate('/info');
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-tag">
          </div>
          
          <h1 className="hero-title">
            Track. Monitor.<br />
            Protect. <span className="highlight">Your Child's<br />Respiratory Health.</span>
          </h1>
          
          <p className="hero-description">
            Pneumtofy helps caregivers monitor pneumonia symptoms, access safe home care tips, and know when to seek medical attention all guided by IMCI standards. <b>However,
             this app is NOT a substitute for professional medical advice.</b>
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary-home" onClick={handleStartTracking}>
              Start Tracking
            </button>
            <button className="btn-secondary-home" onClick={handleLearnMore}>
              Learn More
            </button>
          </div>
          

        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Everything You Need</h2>
          <p className="features-subtitle">Simple, reliable tools designed for caregivers — not clinicians.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M10 6H22C23.1 6 24 6.9 24 8V24H10C8.9 24 8 23.1 8 22V8C8 6.9 8.9 6 10 6Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M22 8H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 12H20M12 16H20M12 20H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Symptom Form</h3>
              <p className="feature-description">Log your child's respiratory symptoms with an easy guided form and the system will assess your child's symptoms.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 24H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 20V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 12V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M22 8V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Tracker Page</h3>
              <p className="feature-description">Record your child's symptom entries for easier tracking and analysis.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M8 6H24C25.1 6 26 6.9 26 8V24C26 25.1 25.1 26 24 26H8C6.9 26 6 25.1 6 24V8C6 6.9 6.9 6 8 6Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M16 6V26" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="16" cy="14" r="1.2" fill="currentColor"/>
                  <circle cx="16" cy="20" r="1.2" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="feature-title">Health Information Hub</h3>
              <p className="feature-description">Access information from WHO, UNICEF and CDC on what is pneumonia and the world's response to one of the most life threatening infections to children.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L10 8V14C10 20 16 26 16 26C16 26 22 20 22 14V8L16 4Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M14 15L16 17L20 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Evidence-Based</h3>
              <p className="feature-description">All recommendations follow established medical guidelines for childhood pneumonia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Monitoring?</h2>
          <p className="cta-description">
            Begin tracking your child's symptoms now. It only takes a minute.
          </p>
          <button className="btn-cta-home" onClick={handleStartTracking}>
            Go to Symptom Form

          </button>
        </div>
      </section>

      {/* Dashboard Metrics Section */}
      <DashboardMetrics />
    </div>
  );
}

export default Home;
