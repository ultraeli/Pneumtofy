import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SymptomForm.css';

export default function SymptomForm({ onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [symptoms, setSymptoms] = useState({
    age_months: '',
    cough_duration: '',
    fast_breathing: false,
    fever: false,
    fever_temperature: '',
    difficulty_breathing: false,
    chest_indrawing: false,
    stridor: false,
    lethargy: false,
    unable_to_drink: false,
    vomiting: false,
    diarrhea: false,
    previous_episodes: '',
  });

  const steps = [
    { number: 1, label: 'Child Info' },
    { number: 2, label: 'Respiratory' },
    { number: 3, label: 'Fever & General' },
    { number: 4, label: 'Review' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSymptoms({
      ...symptoms,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    // Validate required fields before moving to next step
    if (currentStep === 1) {
      if (!symptoms.age_months || symptoms.age_months === '') {
        alert('Please fill in the age of the child.');
        return;
      }
      if (!symptoms.cough_duration && symptoms.cough_duration !== 0) {
        alert('Please fill in the duration of cough.');
        return;
      }
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!symptoms.age_months || symptoms.age_months === '') {
      alert('Please fill in the age of the child.');
      setCurrentStep(1);
      return;
    }
    
    if (!symptoms.cough_duration && symptoms.cough_duration !== 0) {
      alert('Please fill in the duration of cough.');
      setCurrentStep(1);
      return;
    }

    setLoading(true);

    try {
      // Ensure numeric fields are properly converted
      const submissionData = {
        ...symptoms,
        age_months: parseInt(symptoms.age_months),
        cough_duration: parseInt(symptoms.cough_duration),
        previous_episodes: symptoms.previous_episodes ? parseInt(symptoms.previous_episodes) : 0,
        fever_temperature: symptoms.fever_temperature ? parseFloat(symptoms.fever_temperature) : 0,
      };

      // Call backend API for assessment
      const response = await axios.post('http://localhost:5000/api/assess', submissionData, {
        withCredentials: true
      });
      // Pass both the symptoms and the assessment result
      onSubmit({
        ...response.data,
        input_symptoms: symptoms
      });
    } catch (error) {
      alert('Error assessing symptoms. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section">
            <h2 className="step-title">Child Information</h2>
            <div className="form-group">
              <label htmlFor="age_months">Age of child (in months) *</label>
              <input
                type="number"
                id="age_months"
                name="age_months"
                min="0"
                max="180"
                value={symptoms.age_months}
                onChange={handleInputChange}
                required
                placeholder="e.g., 24"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cough_duration">Duration of cough (days) *</label>
              <input
                type="number"
                id="cough_duration"
                name="cough_duration"
                min="0"
                max="90"
                value={symptoms.cough_duration}
                onChange={handleInputChange}
                required
                placeholder="e.g., 7"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <h2 className="step-title">Respiratory Symptoms</h2>
            <div className="checkbox-card">
              <label className="checkbox-card-label">
                <input
                  type="checkbox"
                  name="fast_breathing"
                  checked={symptoms.fast_breathing}
                  onChange={handleInputChange}
                />
                <span className="icon">🫁</span>
                <span>Fast breathing (tachypnea)</span>
              </label>
            </div>
            <div className="checkbox-card">
              <label className="checkbox-card-label">
                <input
                  type="checkbox"
                  name="difficulty_breathing"
                  checked={symptoms.difficulty_breathing}
                  onChange={handleInputChange}
                />
                <span className="icon">🫁</span>
                <span>Difficulty breathing (dyspnea)</span>
              </label>
            </div>
            <div className="checkbox-card">
              <label className="checkbox-card-label">
                <input
                  type="checkbox"
                  name="chest_indrawing"
                  checked={symptoms.chest_indrawing}
                  onChange={handleInputChange}
                />
                <span className="icon">ℹ️</span>
                <span>Chest wall indrawing</span>
              </label>
            </div>
            <div className="checkbox-card">
              <label className="checkbox-card-label">
                <input
                  type="checkbox"
                  name="stridor"
                  checked={symptoms.stridor}
                  onChange={handleInputChange}
                />
                <span className="icon">ℹ️</span>
                <span>Stridor (noisy breathing)</span>
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-section">
            <h2 className="step-title">Fever & General Symptoms</h2>
            <div className="checkbox-card">
              <label className="checkbox-card-label">
                <input
                  type="checkbox"
                  name="fever"
                  checked={symptoms.fever}
                  onChange={handleInputChange}
                />
                <span className="icon">🌡️</span>
                <span>Has fever</span>
              </label>
            </div>
            {symptoms.fever && (
              <div className="form-group">
                <label htmlFor="fever_temperature">Temperature (°C)</label>
                <input
                  type="number"
                  id="fever_temperature"
                  name="fever_temperature"
                  step="0.1"
                  min="35"
                  max="42"
                  value={symptoms.fever_temperature}
                  onChange={handleInputChange}
                  placeholder="e.g., 38.5"
                />
              </div>
            )}
            <div className="checkbox-card">
              <label className="checkbox-card-label">
                <input
                  type="checkbox"
                  name="lethargy"
                  checked={symptoms.lethargy}
                  onChange={handleInputChange}
                />
                <span className="icon">😴</span>
                <span>Lethargy (unusual sleepiness/weakness)</span>
              </label>
            </div>
            <div className="checkbox-card">
              <label className="checkbox-card-label">
                <input
                  type="checkbox"
                  name="unable_to_drink"
                  checked={symptoms.unable_to_drink}
                  onChange={handleInputChange}
                />
                <span className="icon">🥛</span>
                <span>Unable to drink</span>
              </label>
            </div>
            <div className="checkbox-card">
              <label className="checkbox-card-label">
                <input
                  type="checkbox"
                  name="vomiting"
                  checked={symptoms.vomiting}
                  onChange={handleInputChange}
                />
                <span className="icon">🤢</span>
                <span>Vomiting</span>
              </label>
            </div>
            <div className="checkbox-card">
              <label className="checkbox-card-label">
                <input
                  type="checkbox"
                  name="diarrhea"
                  checked={symptoms.diarrhea}
                  onChange={handleInputChange}
                />
                <span className="icon">⚠️</span>
                <span>Diarrhea</span>
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="previous_episodes">Previous pneumonia episodes</label>
              <input
                type="number"
                id="previous_episodes"
                name="previous_episodes"
                min="0"
                value={symptoms.previous_episodes}
                onChange={handleInputChange}
                placeholder="e.g., 0"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-section">
            <h2 className="step-title">Review</h2>
            <div className="review-summary">
              <h3>Summary of Information</h3>
              <div className="summary-item">
                <span className="label">Age (months)</span>
                <span className="value">{symptoms.age_months}</span>
              </div>
              <div className="summary-item">
                <span className="label">Cough duration (days)</span>
                <span className="value">{symptoms.cough_duration}</span>
              </div>
              <div className="summary-item">
                <span className="label">Fever</span>
                <span className="value">{symptoms.fever ? `Yes (${symptoms.fever_temperature}°C)` : 'No'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Fast breathing</span>
                <span className="value">{symptoms.fast_breathing ? 'Yes' : 'No'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Difficulty breathing</span>
                <span className="value">{symptoms.difficulty_breathing ? 'Yes' : 'No'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Chest indrawing</span>
                <span className="value">{symptoms.chest_indrawing ? 'Yes' : 'No'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Previous episodes</span>
                <span className="value">{symptoms.previous_episodes}</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="symptom-form-container">
      <div className="symptom-form-card">
        <p className="disclaimer">
          ⚠️ Important: This tool provides general guidance only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
        </p>
        
        {/* Stepper */}
        <div className="stepper">
          {steps.map((step) => (
            <div key={step.number} className={`step ${step.number <= currentStep ? 'active' : ''} ${step.number < currentStep ? 'completed' : ''}`}>
              <div className="step-circle">{step.number}</div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
          <div className="step-progress">
            <div className="step-progress-bar" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form">
          {renderStepContent()}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-back"
              onClick={(e) => {
                e.preventDefault();
                handleBack(e);
              }}
              disabled={currentStep === 1}
            >
              ← Back
            </button>
            {currentStep === 4 ? (
              <button
                type="submit"
                className="btn btn-submit"
                disabled={loading}
              >
                {loading ? 'Assessing...' : 'Assess Symptoms'}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-next"
                onClick={(e) => {
                  e.preventDefault();
                  handleNext(e);
                }}
              >
                Next →
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
