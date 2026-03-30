import React, { useState } from 'react';
import axios from 'axios';
import './SymptomForm.css';

export default function SymptomForm({ onSubmit }) {
  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSymptoms({
      ...symptoms,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call backend API for assessment
      const response = await axios.post('http://localhost:5000/api/assess', symptoms, {
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

  return (
    <div className="symptom-form-container">
      <div className="symptom-form-card">
        <h2>Symptom Assessment</h2>
        <p className="disclaimer">
          ⚠️ This tool helps identify potential pneumonia symptoms. It is NOT a substitute for professional medical advice.
        </p>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-section">
            <h3>Child Information</h3>
            
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
          </div>

          <div className="form-section">
            <h3>Respiratory Symptoms</h3>
            
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

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="fast_breathing"
                  checked={symptoms.fast_breathing}
                  onChange={handleInputChange}
                />
                Fast breathing (tachypnea)
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="difficulty_breathing"
                  checked={symptoms.difficulty_breathing}
                  onChange={handleInputChange}
                />
                Difficulty breathing (dyspnea)
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="chest_indrawing"
                  checked={symptoms.chest_indrawing}
                  onChange={handleInputChange}
                />
                Chest wall indrawing
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="stridor"
                  checked={symptoms.stridor}
                  onChange={handleInputChange}
                />
                Stridor (noisy breathing)
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Fever Symptoms</h3>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="fever"
                  checked={symptoms.fever}
                  onChange={handleInputChange}
                />
                Has fever
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
          </div>

          <div className="form-section">
            <h3>General Symptoms</h3>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="lethargy"
                  checked={symptoms.lethargy}
                  onChange={handleInputChange}
                />
                Lethargy (unusual sleepiness/weakness)
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="unable_to_drink"
                  checked={symptoms.unable_to_drink}
                  onChange={handleInputChange}
                />
                Unable to drink
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="vomiting"
                  checked={symptoms.vomiting}
                  onChange={handleInputChange}
                />
                Vomiting
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="diarrhea"
                  checked={symptoms.diarrhea}
                  onChange={handleInputChange}
                />
                Diarrhea
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>History</h3>
            
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Assessing...' : 'Assess Symptoms'}
          </button>
        </form>
      </div>
    </div>
  );
}
