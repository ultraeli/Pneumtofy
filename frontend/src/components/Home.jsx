import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

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
            <svg className="tag-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>Pneumonia Awareness Platform</span>
          </div>
          
          <h1 className="hero-title">
            Track. Monitor.<br />
            Protect. <span className="highlight">Your Child's<br />Respiratory Health.</span>
          </h1>
          
          <p className="hero-description">
            Pneumtofy helps caregivers monitor pneumonia symptoms, access safe home care tips, and know when to seek medical attention — all guided by WHO IMCI standards.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleStartTracking}>
              Start Tracking
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 10H13M13 10L10 7M13 10L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn-secondary" onClick={handleLearnMore}>
              Learn More
            </button>
          </div>
          
          <div className="hero-icons">
            <div className="icon-item">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16 10V16L19 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="icon-item">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 8V24M8 16H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="icon-item">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="16" cy="20" r="2" fill="currentColor"/>
              </svg>
            </div>
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
              <h3 className="feature-title">Symptom Tracking</h3>
              <p className="feature-description">Log and monitor your child's respiratory symptoms with an easy guided form.</p>
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
              <h3 className="feature-title">Progress Dashboard</h3>
              <p className="feature-description">Visualize symptom trends over time to spot improvements or concerns early.</p>
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
              <h3 className="feature-title">Health Info Hub</h3>
              <p className="feature-description">Access WHO IMCI-based guidance on pneumonia prevention, care, and safe remedies.</p>
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
          <button className="btn btn-cta" onClick={handleStartTracking}>
            Open Symptom Tracker
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 10H13M13 10L10 7M13 10L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-mark" aria-hidden="true">🫁</span>
              <span className="footer-logo-text">Pneumtofy</span>
            </div>
            <p className="footer-description">
              Helping caregivers track, monitor, and protect children's respiratory health with evidence-based guidance following WHO IMCI guidelines.
            </p>
            <p className="footer-made-with">Made with ♡ for children's health</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-heading">Platform</h4>
              <button className="footer-link" type="button" onClick={() => navigate('/symptom-form')}>Symptom Tracker</button>
              <button className="footer-link" type="button" onClick={() => navigate('/tracker')}>Dashboard</button>
              <button className="footer-link" type="button" onClick={() => navigate('/info')}>Info Hub</button>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <a className="footer-link" href="https://www.who.int/publications/i/item/9789241549799" target="_blank" rel="noreferrer">
                WHO IMCI Guidelines
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-disclaimer">
            This app is NOT a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
