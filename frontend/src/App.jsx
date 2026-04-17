import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import SymptomForm from './components/SymptomForm';
import Results from './components/Results';
import Info from './components/Info';
import Tracker from './components/Tracker';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const [assessmentResult, setAssessmentResult] = useState(null);
  const navigate = useNavigate();

  const handleSymptomSubmit = (result) => {
    setAssessmentResult(result);
    navigate('/results');
  };

  const handleGoHome = () => {
    setAssessmentResult(null);
    navigate('/');
  };

  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected and public routes */}
      <Route
        path="/*"
        element={
          <div className="app">
            <Navigation onGoHome={handleGoHome} />
            
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/symptom-form" element={<SymptomForm onSubmit={handleSymptomSubmit} />} />
                <Route path="/results" element={
                  assessmentResult ? (
                    <Results result={assessmentResult} onGoHome={handleGoHome} />
                  ) : (
                    <Navigate to="/symptom-form" replace />
                  )
                } />
                <Route path="/info" element={<Info onGoHome={handleGoHome} />} />
                <Route path="/tracker" element={
                  <ProtectedRoute>
                    <Tracker onGoHome={handleGoHome} />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
