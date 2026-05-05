import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Info.css';

import lungsImage from '../img/lungs-illustration.jpg';
import doctorChildImage from '../img/doctor-child.webp';

const icons = {
  alert: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 5L28 26H4L16 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="22" r="1.3" fill="currentColor" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 6H19C21.2 6 23 7.8 23 10V26H11C9.3 26 8 24.7 8 23V6Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11H19M12 16H19M12 21H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  breath: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 11H19C21 11 22.5 9.5 22.5 7.7C22.5 6 21.1 4.8 19.7 4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6 16H24C26 16 27.5 17.5 27.5 19.3C27.5 21 26.1 22.2 24.7 22.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10 22H18.5C20 22 21.2 23.2 21.2 24.7C21.2 26.1 20 27.2 18.7 27.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  care: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M10 14C8 11.7 8.3 8 11.4 7.2C13.4 6.7 15 8 16 9.3C17 8 18.6 6.7 20.6 7.2C23.7 8 24 11.7 22 14L16 21L10 14Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M6 22H11L15 25H26" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.7" />
      <path d="M11 16.5L14.5 20L22 12.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  clinic: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M7 13L16 6L25 13V26H7V13Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M16 13V22M11.5 17.5H20.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
  external: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 7H7C5.9 7 5 7.9 5 9V17C5 18.1 5.9 19 7 19H15C16.1 19 17 18.1 17 17V15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13 5H19V11M19 5L11 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const symptoms = [
  {
    icon: 'breath',
    label: 'Fast breathing',
    desc: 'More than 50 breaths/min (2-12 months) or 40/min (1-5 years)',
    severe: true,
  },
  {
    icon: 'alert',
    label: 'Chest indrawing',
    desc: 'Lower chest pulls in when breathing - a danger sign',
    severe: true,
  },
  {
    icon: 'clinic',
    label: 'Fever',
    desc: 'Often high, but may be absent in young infants',
    severe: false,
  },
  {
    icon: 'alert',
    label: 'Difficulty breathing',
    desc: 'Grunting, nasal flaring, noisy breathing, or stridor',
    severe: true,
  },
];

const risks = [
  { icon: 'care', label: 'Under 2 years old', desc: 'Young children have developing immune systems.' },
  { icon: 'breath', label: 'Indoor air pollution', desc: 'Smoke from cooking fuels or tobacco can irritate the lungs.' },
  { icon: 'care', label: 'Malnutrition', desc: "Weakens the body's ability to fight infection." },
  { icon: 'clinic', label: 'Missed vaccinations', desc: 'Pneumococcal and Hib vaccines help prevent severe disease.' },
  { icon: 'care', label: 'Not breastfed', desc: 'Breastmilk provides antibodies that help protect infants.' },
  { icon: 'breath', label: 'Crowded living', desc: 'Close contact increases exposure to respiratory infections.' },
];

const urgentSigns = [
  'Inability to breastfeed or drink anything',
  'Persistent chest indrawing or grunting',
  'Convulsions or unusual sleepiness',
  'Stridor when calm',
  'Bluish lips, tongue, or fingertips',
  "High fever that won't come down",
];

const prevention = [
  { icon: 'clinic', label: 'Vaccination', desc: 'Keep pneumococcal (PCV) and Hib vaccines on schedule.' },
  { icon: 'care', label: 'Breastfeeding', desc: 'Exclusive breastfeeding for the first 6 months supports immunity.' },
  { icon: 'check', label: 'Handwashing', desc: 'Frequent washing lowers the spread of respiratory infections.' },
  { icon: 'breath', label: 'Clean indoor air', desc: 'Keep children away from tobacco smoke and cooking smoke.' },
  { icon: 'care', label: 'Good nutrition', desc: 'Balanced meals help build stronger immune response.' },
  { icon: 'clinic', label: 'Routine checkups', desc: 'Early assessment helps caregivers act before symptoms worsen.' },
];

const sources = [
  { name: 'World Health Organization (WHO)', url: 'https://www.who.int/news-room/fact-sheets/detail/pneumonia' },
  { name: 'WHO IMCI Guidelines', url: 'https://www.who.int/publications/i/item/9241546441' },
  { name: 'UNICEF - Childhood Pneumonia', url: 'https://data.unicef.org/topic/child-health/pneumonia/' },
  { name: 'CDC - Pneumonia in Children', url: 'https://www.cdc.gov/pneumonia/' },
];

function InfoIcon({ name, className = '' }) {
  return <span className={`info-icon ${className}`}>{icons[name]}</span>;
}

export default function Info({ onGoHome }) {
  return (
    <div className="info-page">
      <section className="info-hero">
        <div className="info-container info-hero-grid">
          <div className="info-hero-copy">
            <div className="info-tag">
              <InfoIcon name="book" />
              Information Hub
            </div>
            <h1 className="info-hero-title">
              Understanding Pneumonia <span>in Children</span>
            </h1>
            <p className="info-hero-description">
              Learn the symptoms, risks, and prevention methods every caregiver should know, guided by WHO IMCI standards.
            </p>
            <div className="info-actions">
              <Link className="info-btn info-btn-primary" to="/symptom-form">
                Track Symptoms
              </Link>
              <a className="info-btn info-btn-secondary" href="#prevention">
                Prevention Tips
              </a>
            </div>
          </div>

          <div className="info-hero-visual">
            <img
              src={doctorChildImage}
              alt="Pediatrician examining a smiling child with a stethoscope"
              className="info-hero-image"
            />
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-container info-overview">
          <div className="info-image-card">
            <img src={lungsImage} alt="Illustration of human lungs" loading="lazy" />
          </div>
          <div className="info-panel">
            <h2>What is Pneumonia?</h2>
            <p>
              Pneumonia is an infection of the lungs caused by bacteria, viruses, or fungi. It inflames the small air sacs
              called alveoli, which can fill with fluid or pus and make breathing harder.
            </p>
            <p>
              It remains one of the leading infectious causes of death in children worldwide, but it is preventable and
              treatable when warning signs are recognized early.
            </p>
          </div>
        </div>
      </section>

      <section className="info-section info-section-muted">
        <div className="info-container">
          <div className="info-section-heading">
            <InfoIcon name="clinic" className="info-heading-icon" />
            <h2>Symptoms in Children</h2>
            <p>Recognize these key warning signs early.</p>
          </div>

          <div className="info-grid info-grid-two">
            {symptoms.map((symptom) => (
              <article className={`info-card info-card-row ${symptom.severe ? 'info-card-warning' : ''}`} key={symptom.label}>
                <InfoIcon name={symptom.icon} className={symptom.severe ? 'info-icon-warning' : 'info-icon-primary'} />
                <div>
                  <div className="info-card-title-row">
                    <h3>{symptom.label}</h3>
                    {symptom.severe && <span className="info-chip">Severe</span>}
                  </div>
                  <p>{symptom.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-container">
          <div className="info-section-heading">
            <InfoIcon name="alert" className="info-heading-icon info-heading-icon-warm" />
            <h2>Risk Factors</h2>
            <p>What makes a child more vulnerable to pneumonia.</p>
          </div>

          <div className="info-grid info-grid-three">
            {risks.map((risk) => (
              <article className="info-card info-card-feature" key={risk.label}>
                <InfoIcon name={risk.icon} className="info-icon-warm" />
                <h3>{risk.label}</h3>
                <p>{risk.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section info-section-tight">
        <div className="info-container">
          <div className="info-emergency">
            <InfoIcon name="alert" className="info-emergency-icon" />
            <div>
              <span className="info-kicker">Emergency</span>
              <h2>When to Seek Medical Care Immediately</h2>
              <p>
                Contact a healthcare provider or visit the nearest emergency facility right away if your child shows any of
                these signs:
              </p>
              <ul className="info-danger-list">
                {urgentSigns.map((sign) => (
                  <li key={sign}>
                    <InfoIcon name="alert" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
              <a className="info-btn info-btn-danger" href="tel:911">
                Call Emergency Services
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="prevention" className="info-section info-section-soft">
        <div className="info-container">
          <div className="info-section-heading">
            <InfoIcon name="check" className="info-heading-icon info-heading-icon-green" />
            <h2>Prevention</h2>
            <p>Simple, evidence-based steps that protect your child.</p>
          </div>

          <div className="info-grid info-grid-three">
            {prevention.map((item) => (
              <article className="info-card info-card-row" key={item.label}>
                <InfoIcon name={item.icon} className="info-icon-green" />
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-container">
          <div className="info-cta">
            <InfoIcon name="care" />
            <h2>Stay Safe, Stay Informed</h2>
            <p>Track your child's symptoms with Pneumtofy and get instant, evidence-based guidance.</p>
            <Link className="info-btn info-btn-light" to="/symptom-form">
              Start Tracking
            </Link>
          </div>
        </div>
      </section>

      <section className="info-sources">
        <div className="info-container">
          <h2>Information Sources</h2>
          <div className="info-source-grid">
            {sources.map((source) => (
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="info-source-link" key={source.name}>
                <span>{source.name}</span>
                <InfoIcon name="external" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {typeof onGoHome === 'function' && (
        <div className="info-container info-back-row">
          <button className="info-btn info-btn-secondary" onClick={onGoHome} type="button">
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

