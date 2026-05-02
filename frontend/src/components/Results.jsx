import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
          respiratory_rate: symptoms.respiratory_rate,
          fast_breathing: symptoms.fast_breathing,
          fever: symptoms.fever,
          fever_temperature: symptoms.fever_temperature,
          difficulty_breathing: symptoms.difficulty_breathing,
          chest_indrawing: symptoms.chest_indrawing,
          stridor: symptoms.stridor,
          convulsions: symptoms.convulsions,
          cyanosis: symptoms.cyanosis,
          unconscious: symptoms.unconscious,
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
    if (risk.includes('PNEUMONIA') || risk.includes('Amoxicillin')) return '#f39c12';
    if (risk.includes('moderate')) return '#f39c12';
    if (risk.includes('mild') || risk.includes('SIMPLE') || risk.includes('OBSERVE')) return '#27ae60';
    return '#3498db';
  };

  // Extract respiratory rate info from symptoms if available
  const hasRespiratoryRate = result.symptoms && result.symptoms.respiratory_rate;
  const respiratoryRate = result.symptoms?.respiratory_rate;
  const threshold = result.symptoms?.threshold;
  const hasFastBreathing = result.symptoms?.fast_breathing;

  return (
    <div className="results-container">
      <div className="results-card">
        <div className="results-header">
          <h2>Assessment Results</h2>
          <p className="timestamp">
            {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            <br />
          </p>
        </div>

        <div className="risk-badge" style={{ borderColor: getRiskColor(result.assessment) }}>
          <div className="risk-label">Risk Level</div>
          <div className="risk-value" style={{ color: getRiskColor(result.assessment) }}>
            {result.assessment}
          </div>
        </div>

        {/* Display respiratory rate assessment */}
        {hasRespiratoryRate && (
          <div className="respiratory-rate-section" style={{
            backgroundColor: hasFastBreathing ? '#ffe5e5' : '#e5f5e5',
            borderLeft: `4px solid ${hasFastBreathing ? '#f39c12' : '#27ae60'}`,
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '4px'
          }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Respiratory Rate Assessment</h4>
            <p style={{ margin: '4px 0' }}>
              <strong>Respiratory rate:</strong> {respiratoryRate} breaths per minute
            </p>
            <p style={{ margin: '4px 0' }}>
              <strong>Threshold:</strong> {threshold} breaths per minute
            </p>
            <p style={{ margin: '4px 0', fontWeight: hasFastBreathing ? 'bold' : 'normal', color: hasFastBreathing ? '#e74c3c' : '#27ae60' }}>
              {hasFastBreathing ? '⚠️ Fast breathing detected' : '✓ Normal breathing rate'}
            </p>
          </div>
        )}

        {/* Highlight amoxicillin recommendation */}
        {result.amoxicillin_recommended && (
          <div className="amoxicillin-section" style={{
            backgroundColor: '#fff3cd',
            borderLeft: '4px solid #f39c12',
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '4px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#856404' }}>💊 Amoxicillin Recommended</h4>
            <p style={{ margin: '4px 0', color: '#856404' }}>
              WHO IMCI: Cough with fast breathing is a sign of pneumonia. This child should be evaluated for amoxicillin treatment by a healthcare provider.
            </p>
            <p style={{ margin: '4px 0', color: '#856404', fontSize: '0.9em' }}>
              <strong>Note:</strong> Amoxicillin can often be safely given at home if there are no danger signs like chest indrawing, lethargy, or inability to drink.
            </p>
          </div>
        )}

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
