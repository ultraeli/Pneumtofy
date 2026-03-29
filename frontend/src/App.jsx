import React, { useState } from 'react';
import './App.css';
import SymptomForm from './components/SymptomForm';
import Results from './components/Results';
import Info from './components/Info';
import Tracker from './components/Tracker';
import Navigation from './components/Navigation';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [symptoms, setSymptoms] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const handleSymptomSubmit = (result) => {
    setAssessmentResult(result);
    setCurrentPage('results');
  };

  const handleGoHome = () => {
    setCurrentPage('home');
    setSymptoms(null);
    setAssessmentResult(null);
  };

  return (
    <div className="app">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} onGoHome={handleGoHome} />
      
      <main className="main-content">
        {currentPage === 'home' && (
          <SymptomForm onSubmit={handleSymptomSubmit} />
        )}
        {currentPage === 'results' && assessmentResult && (
          <Results result={assessmentResult} onGoHome={handleGoHome} />
        )}
        {currentPage === 'info' && (
          <Info onGoHome={handleGoHome} />
        )}
        {currentPage === 'tracker' && (
          <Tracker onGoHome={handleGoHome} />
        )}
      </main>
    </div>
  );
}
