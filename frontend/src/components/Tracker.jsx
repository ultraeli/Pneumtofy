import React, { useState, useEffect } from 'react';
import { formatDate, formatTime} from '../utils/dateFormatter';
import '../styles/Tracker.css';

const trackerFilters = [
  { value: 'all', label: 'All Assessments' },
  { value: 'urgent', label: 'Seek Immediate Care' },
  { value: 'pneumonia', label: 'Pneumonia / Amoxicillin' },
  { value: 'simple-cough', label: 'Simple Cough or Cold' },
  { value: 'observe', label: 'Observe & Manage' },
];

const getAssessmentCategory = (assessment = '') => {
  const normalized = assessment.toUpperCase();

  if (normalized.includes('SEEK') || normalized.includes('CRITICAL')) {
    return 'urgent';
  }

  if (normalized.includes('PNEUMONIA') || normalized.includes('AMOXICILLIN') || normalized.includes('MODERATE')) {
    return 'pneumonia';
  }

  if (normalized.includes('SIMPLE COUGH') || normalized.includes('COLD')) {
    return 'simple-cough';
  }

  if (normalized.includes('OBSERVE') || normalized.includes('MANAGE AT HOME') || normalized.includes('MILD')) {
    return 'observe';
  }

  return 'other';
};

export default function Tracker({ onGoHome }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let mounted = true;

    const fetchTrackerData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tracker', {
          credentials: 'include'
        });
        const data = await response.json();
        if (!mounted) return;
        setEntries(data.entries || []);
      } catch (error) {
        console.error('Error fetching tracker data:', error);
        if (!mounted) return;
        setEntries([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchTrackerData();
    return () => { mounted = false; };
  }, []);

  const getStatusColor = (assessment) => {
    const category = getAssessmentCategory(assessment);

    if (category === 'urgent') return '#e74c3c';
    if (category === 'pneumonia') return '#f39c12';
    if (category === 'simple-cough') return '#17a2b8';
    return '#27ae60';
  };

  const deleteEntry = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tracker/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (filter === 'all') return true;
    return getAssessmentCategory(entry.assessment) === filter;
  });

  if (loading) {
    return <div className="tracker-container"><p>Loading...</p></div>;
  }

  return (
    <div className="tracker-container">
      <div className="tracker-card">
        <h2>Symptom Tracker</h2>
        <p className="tracker-intro">
          View and monitor symptom assessments over time
        </p>

        <div className="filter-section">
          <label htmlFor="filter">Filter by:</label>
          <select 
            id="filter"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            {trackerFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>


        {filteredEntries.length === 0 ? (
          <div className="empty-state">
            <p>No assessments recorded yet.</p>
            <p>Go to Home and submit symptoms to start tracking.</p>
          </div>
        ) : (
          <div className="entries-list">
            {filteredEntries.map((entry, idx) => (
              <div key={idx} className="entry-card">
                <div className="entry-header">
                  <div className="entry-datetime">
                    <span className="entry-date">{formatDate(entry.timestamp)}</span>
                    <span className="entry-time">{formatTime(entry.timestamp)}</span>
                  </div>

                  <div 
                    className="entry-status-badge"
                    style={{ backgroundColor: getStatusColor(entry.assessment) }}
                  >
                    {entry.assessment}
                  </div>
                </div>

                <div className="entry-content">
                  <h4>Symptoms</h4>
                  <ul className="symptoms-list">
                    {entry.symptoms && Object.entries(entry.symptoms).map(([key, value]) => 
                      (value === true || (typeof value === 'number' && value > 0)) && (
                        <li key={key}>
                          {key.replace(/_/g, ' ').toLowerCase()}
                          {typeof value === 'number' && value > 0 ? `: ${value}` : ''}
                        </li>
                      )
                    )}
                  </ul>

                  <h4>Recommendation</h4>
                  <p className="recommendation">{entry.recommendation}</p>

                  {entry.home_remedies && entry.home_remedies.length > 0 && (
                    <>
                      <h4>Suggested Home Remedies</h4>
                      <div className="remedies-grid-tracker">
                        {entry.home_remedies.map((remedy, remedyIdx) => (
                          <div key={remedyIdx} className="remedy-card-tracker">
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
                    </>
                  )}
                </div>

                <button 
                  className="delete-btn"
                  onClick={() => deleteEntry(entry.id)}
                  title="Delete this entry"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="back-btn" onClick={onGoHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
