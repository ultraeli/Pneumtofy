import React, { useState, useEffect } from 'react';
import { formatDate, formatTime} from '../utils/dateFormatter';
import './Tracker.css';

export default function Tracker({ onGoHome }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTrackerData();
  }, []);

  const fetchTrackerData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tracker', {
        credentials: 'include'
      });
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Error fetching tracker data:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (assessment) => {
    if (assessment.includes('SEEK CARE')) return '#e74c3c';
    if (assessment.includes('MODERATE')) return '#f39c12';
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
    return entry.assessment.includes(filter);
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
            <option value="all">All Assessments</option>
            <option value="OBSERVE">Observe & Manage</option>
            <option value="SEEK">Seek Medical Care</option>
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
                  <div className="entry-date">
                    {formatDate(entry.timestamp)}
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

                  <div className="entry-time">
                    {formatTime(entry.timestamp)}
                  </div>
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
