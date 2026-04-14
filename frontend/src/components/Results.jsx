import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserTimezone } from '../utils/dateFormatter';
import '../styles/Results.css';

export default function Results({ result, onGoHome }) {
  const [savedToTracker, setSavedToTracker] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSaveToTracker = async () => {
    // If not authenticated, store assessment and redirect to login
    if (!isAuthenticated) {
      localStorage.setItem('pendingAssessment', JSON.stringify({
        ...result,
        input_symptoms: result.input_symptoms
      }));
      alert('Please login or register to save your assessment to the tracker.');
      navigate('/login');
      return;
    }

    // User is authenticated, save to tracker
    try {
      // Use input_symptoms if available, otherwise use symptoms from result
      const symptoms = result.input_symptoms || result.symptoms || {};
      
      const response = await fetch('http://localhost:5000/api/tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          age_months: symptoms.age_months,
          cough_duration: symptoms.cough_duration,
          fast_breathing: symptoms.fast_breathing,
          fever: symptoms.fever,
          fever_temperature: symptoms.fever_temperature,
          difficulty_breathing: symptoms.difficulty_breathing,
          chest_indrawing: symptoms.chest_indrawing,
          stridor: symptoms.stridor,
          lethargy: symptoms.lethargy,
          unable_to_drink: symptoms.unable_to_drink,
          vomiting: symptoms.vomiting,
          diarrhea: symptoms.diarrhea,
          previous_episodes: symptoms.previous_episodes,
          assessment: result.assessment,
          recommendation: result.recommendation,
          guidance: result.guidance,
          home_remedies: result.home_remedies,
          timestamp: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        setSavedToTracker(true);
        setTimeout(() => {
          navigate('/tracker');
        }, 2000);
      } else {
        const error = await response.json();
        console.error('Error response:', error);
      }
    } catch (error) {
      console.error('Error saving to tracker:', error);
    }
  };

  const getRiskColor = (risk) => {
    if (risk.includes('critical') || risk.includes('SEEK')) return '#e74c3c';
    if (risk.includes('moderate')) return '#f39c12';
    if (risk.includes('mild') || risk.includes('OBSERVE')) return '#27ae60';
    return '#3498db';
  };

  return (
    <div className="results-container">
      <div className="results-card">
        <div className="results-header">
          <h2>Assessment Results</h2>
          <p className="timestamp">
            {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            <br />
            <span className="timezone-note">Timezone: {getUserTimezone()}</span>
          </p>
        </div>

        <div className="risk-badge" style={{ borderColor: getRiskColor(result.assessment) }}>
          <div className="risk-label">Risk Level</div>
          <div className="risk-value" style={{ color: getRiskColor(result.assessment) }}>
            {result.assessment}
          </div>
        </div>

        <div className="recommendation-section">
          <h3>Recommendation</h3>
          <div className="recommendation-box">
            {result.recommendation}
          </div>
        </div>

        <div className="guidance-section">
          <h3>Guidance</h3>
          <div className="guidance-content">
            {result.guidance && (
              <ul>
                {result.guidance.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {result.home_remedies && result.home_remedies.length > 0 && (
          <div className="remedies-section">
            <h3>Suggested Home Remedies</h3>
            <div className="remedies-grid">
              {result.home_remedies.map((remedy, idx) => (
                <div key={idx} className="remedy-card">
                  <div className="remedy-name">{remedy.name}</div>
                  <div className="remedy-description">{remedy.description}</div>
                  {remedy.dosage && (
                    <div className="remedy-dosage">
                      <strong>Dosage:</strong> {remedy.dosage}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="remedy-warning">
              ⚠️ Always consult a healthcare professional before administering any remedy to your child.
            </div>
          </div>
        )}

        {result.warning && (
          <div className="warning-box">
            <strong>⚠️ Warning:</strong> {result.warning}
          </div>
        )}

        <div className="action-buttons">
          <button className="save-btn" onClick={handleSaveToTracker}>
            {savedToTracker ? '✓ Saved to Tracker' : 'Save to Tracker'}
          </button>
          <button className="home-btn" onClick={onGoHome}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
