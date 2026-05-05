import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Info.css';

import lungsImage from '../img/lungs.png';
import doctorChildImage from '../img/doctor-child1.png';

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

const articleSections = [
  {
    kicker: 'Access to Care',
    title: 'Why Children Still Die From Pneumonia',
    paragraphs: [
      'The WHO materials show that pneumonia is not deadly only because it is a serious infection. It becomes deadly when families cannot reach care quickly, when warning signs are missed, or when the health system is too far away to respond in time.',
      'Many children are first treated at home, through informal providers, or by traditional healers. Families may face long travel distances, transport costs, medicine costs, or uncertainty about whether a child is sick enough to need care. Children from poorer households are especially likely to miss timely treatment.',
      'This is why pneumonia education is not just about memorizing symptoms. It is about helping caregivers understand when delay becomes dangerous, where help can be found, and why early treatment changes outcomes.'
    ],
    callout: 'WHO/UNICEF emphasize that many sick children never reach appropriate health facilities, and poorer children are less likely to receive needed care.'
  },
  {
    kicker: 'Community Response',
    title: 'How WHO Community Care Works',
    paragraphs: [
      'The WHO community approach is built around a practical sequence: ask about the child’s problems, look for signs of severe illness, decide whether referral is needed, and support the caregiver with treatment or follow-up advice.',
      'Community health workers act as a bridge between households and health facilities. They can identify children who need urgent referral, support families who can safely continue care at home, and help solve practical barriers such as transport or understanding treatment instructions.',
      'The WHO/UNICEF joint statement also stresses that community treatment needs a system behind it. Training, supervision, referral links, medicine supply, monitoring, and clear national policy all matter if pneumonia care is going to be safe and reliable.'
    ],
    callout: 'Evidence reviewed by WHO and UNICEF supports prompt community treatment for uncomplicated pneumonia when workers are trained, supervised, and connected to health facilities.'
  },
  {
    kicker: 'Treatment',
    title: 'What Makes Treatment Effective',
    paragraphs: [
      'Effective pneumonia care is more than giving medicine. Treatment works best when the child is classified correctly, the caregiver understands exactly what to do, and there is a clear plan for returning if the child gets worse.',
      'When antibiotics are needed, the caregiver must know the dose, timing, duration, and importance of completing the full course. WHO training materials also emphasize checking understanding by asking caregivers to repeat or demonstrate instructions before they leave.',
      'Children may also have overlapping illnesses. Pneumonia can appear alongside diarrhoea, fever, malaria risk, or malnutrition, so care often needs to consider the whole child rather than one symptom at a time.'
    ],
    callout: 'The manuals warn that medicine should not be used when it is not needed, and that misuse can harm children and make medicines less effective.'
  },
  {
    kicker: 'Prevention',
    title: 'Preventing Pneumonia Deaths',
    paragraphs: [
      'Prevention is both a household responsibility and a health-system responsibility. Families need practical knowledge, but they also need reachable services, reliable vaccines, trained workers, and medicines that are available when needed.',
      'WHO guidance highlights vaccination, breastfeeding, good nutrition, continued feeding during illness, and micronutrients as ways to reduce the incidence and severity of respiratory infections. Routine vaccines help protect children from several infections linked with severe respiratory disease.',
      'The broader prevention strategy is to make care easier to seek before a child becomes critically ill. That includes caregiver education, strong first-level facilities, community health workers, referral pathways, and systems that help families complete treatment and return when symptoms worsen.'
    ],
    callout: 'The goal is not only to prevent infection, but also to prevent treatable illness from becoming fatal.'
  },
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

            </div>
            <h1 className="info-hero-title">
              Understanding Pneumonia <span>in Children</span>
            </h1>
            <p className="info-hero-description">
              Learn why childhood pneumonia remains deadly, how community care reduces delays, and what prevention requires.
            </p>
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
            <div className="info-impact-note">
              <h3>The Staggering Toll of Childhood Pneumonia</h3>
              <p>
                Pneumonia remains the deadliest infectious threat to children globally, taking the lives of more than
                700,000 children under the age of five each year. That is roughly 2,000 deaths every day, including
                190,000 newborns, despite nearly all of these deaths being preventable.
              </p>
              <h4>Global Impact and Hotspots</h4>
              <p>
                The disease affects about 1 out of every 71 children annually, with the burden falling most heavily on
                South Asia and West and Central Africa.
              </p>
              <ul>
                <li><strong>Global average:</strong> 1,400 cases per 100,000 children.</li>
                <li><strong>South Asia:</strong> 2,500 cases per 100,000 children.</li>
                <li><strong>West and Central Africa:</strong> 1,620 cases per 100,000 children.</li>
              </ul>
              <h4>A Lagging Recovery</h4>
              <p>
                Since 2000, child deaths from diarrhoea have fallen by 63%, while pneumonia deaths have fallen by 54%.
                Pneumonia still kills nearly twice as many children under five as diarrhoea, showing the need for
                stronger focus and resources against this respiratory threat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section info-section--blue">
        <div className="info-container">
          <div className="info-article">
            {articleSections.map((section) => (
              <article className="info-article-section" key={section.title}>
                <span className="info-article-kicker">{section.kicker}</span>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <div className="info-article-callout">
                  {section.callout}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-container">
          <div className="info-cta">

            <h2>Stay Safe, Stay Informed</h2>
            <p>Use Pneumtofy's assessment tool when you need structured guidance for a sick child.</p>
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
    </div>
  );
}

