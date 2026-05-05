import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/DashboardMetrics.css';

/**
 * DashboardMetrics - Standalone metrics dashboard component
 * Displays key platform statistics in a visually appealing card layout
 * Fetches data from the backend API and updates dynamically
 * Only visible to admin users
 */
function DashboardMetrics() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(response.status === 403 ? 'Admin access required' : 'Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if user is authenticated and is an admin
    if (!authLoading && user && user.role === 'admin') {
      fetchStats();
      // Refresh stats every 5 minutes
      const interval = setInterval(fetchStats, 5 * 60 * 1000);
      return () => clearInterval(interval);
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, fetchStats]);

  const handleRefresh = () => {
    fetchStats();
  };

  // Only show dashboard to admin users
  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading && !stats) {
    return (
      <div className="dashboard-metrics-container">
        <div className="loading-state">
          <p>Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="dashboard-metrics-container">
        <div className="error-state">
          <p>Error: {error}</p>
          <button className="btn-refresh" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'TOTAL GUARDIANS',
      value: stats?.total_users || 0,
      subtext: 'Registered parents/guardians',
      color: '#17a2b8'
    },
    {
      label: 'ACTIVE USERS',
      value: stats?.active_users || 0,
      subtext: 'Currently active accounts',
      color: '#28a745'
    },
    {
      label: 'TOTAL ASSESSMENTS',
      value: stats?.total_assessments || 0,
      subtext: 'Symptom assessments submitted',
      color: '#ffc107'
    },
    {
      label: 'ENGAGED GUARDIANS',
      value: stats?.users_with_assessments || 0,
      subtext: 'Guardians who have tracked symptoms',
      color: '#6f42c1'
    },
    {
      label: 'RECENT ACTIVITY',
      value: stats?.recent_assessments || 0,
      subtext: 'Assessments (last 7 days)',
      color: '#17a2b8'
    }
  ];

  const engagementPercentage = stats?.total_users > 0 
    ? Math.round((stats.users_with_assessments / stats.total_users) * 100) 
    : 0;

  const averageAssessmentsPerDay = stats?.recent_assessments > 0 
    ? (stats.recent_assessments / 7).toFixed(1) 
    : '0';

  return (
    <div className="dashboard-metrics-container">
      {/* Header */}
      <div className="metrics-header">
        <div>
          <h1>Dashboard</h1>
          <p>Platform overview and key metrics</p>
        </div>
        <button className="btn-refresh" onClick={handleRefresh}>
          Refresh
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="metric-card" 
            style={{ borderLeftColor: metric.color }}
          >
            <p className="metric-label">{metric.label}</p>
            <h2 className="metric-value">{metric.value}</h2>
            <p className="metric-subtext">{metric.subtext}</p>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <h2>Summary</h2>
        <div className="summary-grid">
          {/* Guardian Engagement */}
          <div className="summary-item">
            <h3>Guardian Engagement</h3>
            <p>
              {stats?.users_with_assessments || 0} out of {stats?.total_users || 0} guardians have submitted assessments
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${engagementPercentage}%` }}
              ></div>
            </div>
            <p className="engagement-percentage">{engagementPercentage}%</p>
          </div>

          {/* Recent Activity */}
          <div className="summary-item">
            <h3>Recent Activity</h3>
            <p>
              {stats?.recent_assessments || 0} assessments in the last 7 days
            </p>
            <p className="activity-average">
              Average: {averageAssessmentsPerDay} per day
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="metrics-footer">
        <p className="last-updated">
          Last updated: {stats?.timestamp ? new Date(stats.timestamp).toLocaleString() : 'Never'}
        </p>
      </div>
    </div>
  );
}

export default DashboardMetrics;
