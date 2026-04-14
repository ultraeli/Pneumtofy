import React, { useState, useEffect } from 'react';
import '../styles/Info.css';

export default function Info({ onGoHome }) {
  const [infoContent, setInfoContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInfoContent();
  }, []);

  const fetchInfoContent = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/info');
      const data = await response.json();
      setInfoContent(data);
    } catch (error) {
      console.error('Error fetching info:', error);
      setInfoContent(DEFAULT_INFO);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="info-container"><p>Loading...</p></div>;
  }

  return (
    <div className="info-container">
      <div className="info-card">
        <h2>Pneumonia Information</h2>
        <p className="intro">
          Learn about pneumonia, its symptoms, risk factors, and when to seek medical care.
        </p>

        {infoContent && (
          <>
            <section className="info-section">
              <h3>What is Pneumonia?</h3>
              <p>{infoContent.about}</p>
            </section>

            <section className="info-section">
              <h3>Symptoms in Children</h3>
              <ul className="symptom-list">
                {infoContent.symptoms && infoContent.symptoms.map((symptom, idx) => (
                  <li key={idx}>{symptom}</li>
                ))}
              </ul>
            </section>

            <section className="info-section">
              <h3>Risk Factors</h3>
              <ul className="risk-list">
                {infoContent.risk_factors && infoContent.risk_factors.map((factor, idx) => (
                  <li key={idx}>{factor}</li>
                ))}
              </ul>
            </section>

            <section className="info-section">
              <h3>When to Seek Medical Care</h3>
              <div className="warning-section">
                {infoContent.seek_medical_care && infoContent.seek_medical_care.map((warning, idx) => (
                  <div key={idx} className="warning-item">
                    ⚠️ {warning}
                  </div>
                ))}
              </div>
            </section>

            <section className="info-section">
              <h3>Prevention</h3>
              <ul className="prevention-list">
                {infoContent.prevention && infoContent.prevention.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="info-section sources">
              <h3>Information Sources</h3>
              <ul className="sources-list">
                <li>WHO - Integrated Management of Childhood Illness (IMCI)</li>
                <li>UNICEF Child Health Guidelines</li>
                <li>CHD and MCA Publications</li>
                <li>Management of Pneumonia in Community Settings</li>
              </ul>
            </section>
          </>
        )}

        <button className="back-btn" onClick={onGoHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

const DEFAULT_INFO = {
  about: 'Pneumonia is an infection that inflames the air sacs (alveoli) in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm or pus, fever, chills, and difficulty breathing. Pneumonia can be caused by bacteria, viruses, or fungi.',
  symptoms: [
    'Cough lasting more than 3 weeks or worsening',
    'Fever (often above 38.5°C)',
    'Fast breathing (tachypnea)',
    'Difficulty breathing',
    'Chest wall indrawing',
    'Flaring of nostrils',
    'Stridor (noisy breathing)',
    'Fatigue and weakness',
    'Refusal to eat or drink',
    'Vomiting',
  ],
  risk_factors: [
    'Age under 5 years',
    'Malnutrition',
    'Not exclusively breastfed (in infants)',
    'Incomplete immunization',
    'Exposure to air pollution',
    'Low birth weight',
    'Previous pneumonia episodes',
  ],
  seek_medical_care: [
    'Chest wall indrawing',
    'Stridor in calm child',
    'Severe respiratory distress',
    'Unable to drink',
    'Persistent high fever',
    'Signs of severe illness',
  ],
  prevention: [
    'Ensure exclusive breastfeeding for first 6 months',
    'Complete immunization schedule (including PCV vaccine)',
    'Proper nutrition and vitamin A supplementation',
    'Avoid exposure to air pollution and smoke',
    'Maintain good hygiene practices',
    'Ensure clean water and sanitation',
    'Regular handwashing',
  ],
};
