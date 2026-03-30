import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    guardianname: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          guardianname: formData.guardianname,
          phone: formData.phone
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update auth context
        login(response.data.user);
        
        // Check if there's a pending assessment to save
        const hasPending = localStorage.getItem('pendingAssessment');
        if (hasPending) {
          const saved = await savePendingAssessment();
          if (saved) {
            navigate('/tracker');
            return;
          }
        }
        
        // Redirect to home
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const savePendingAssessment = async () => {
    try {
      const pendingData = localStorage.getItem('pendingAssessment');
      if (!pendingData) return false;

      const assessmentData = JSON.parse(pendingData);
      const symptoms = assessmentData.input_symptoms || assessmentData.symptoms || {};

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
          assessment: assessmentData.assessment,
          recommendation: assessmentData.recommendation,
          guidance: assessmentData.guidance,
          home_remedies: assessmentData.home_remedies,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        localStorage.removeItem('pendingAssessment');
        return true;
      }
    } catch (error) {
      console.error('Error saving pending assessment:', error);
    }
    return false;
  };

  return (
    <div className="auth-container">
      <div className="auth-box auth-box-register">
        <h1>Create Pneumtofy Account</h1>
        <p className="subtitle">Create an account to save and track assessments</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="guardianname">Guardian Name (Optional)</label>
            <input
              id="guardianname"
              type="text"
              name="guardianname"
              value={formData.guardianname}
              onChange={handleChange}
              placeholder="Your name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your contact number"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}
