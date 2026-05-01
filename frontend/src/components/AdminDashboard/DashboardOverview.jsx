import React from 'react';

/**
 * DashboardOverview - Main dashboard showing key metrics and insights
 * Displays statistics pulled from the database
 */
function DashboardOverview({ stats, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="page-section">
        <div className="loading-state">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="page-section">
        <div className="error-state">
          <p>Unable to load dashboard data</p>
          <button className="btn-primary" onClick={onRefresh}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Guardians',
      value: stats.total_users || 0,
      subtext: 'Registered parents/guardians',
      color: '#17a2b8'
    },
    {
      label: 'Active Users',
      value: stats.active_users || 0,
      subtext: 'Currently active accounts',
      color: '#28a745'
    },
    {
      label: 'Total Assessments',
      value: stats.total_assessments || 0,
      subtext: 'Symptom assessments submitted',
      color: '#ffc107'
    },
    {
      label: 'Engaged Guardians',
      value: stats.users_with_assessments || 0,
      subtext: 'Guardians who have tracked symptoms',
      color: '#6f42c1'
    },
    {
      label: 'Recent Activity',
      value: stats.recent_assessments || 0,
      subtext: 'Assessments (last 7 days)',
      color: '#17a2b8'
    }
  ];

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Platform overview and key metrics</p>
        </div>
        <button className="btn-secondary" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card" style={{ borderLeftColor: metric.color }}>
            <div className="metric-content">
              <p className="metric-label">{metric.label}</p>
              <h2 className="metric-value">{metric.value}</h2>
              <p className="metric-subtext">{metric.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Summary */}
      <div className="summary-section">
        <h2>Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <h3>Guardian Engagement</h3>
            <p>
              {stats.users_with_assessments} out of {stats.total_users} guardians have submitted assessments
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${stats.total_users > 0 ? (stats.users_with_assessments / stats.total_users * 100) : 0}%`
                }}
              ></div>
            </div>
          </div>
          <div className="summary-item">
            <h3>Recent Activity</h3>
            <p>
              {stats.recent_assessments} assessments in the last 7 days
            </p>
            <p className="summary-detail">
              Average: {stats.recent_assessments > 0 ? (stats.recent_assessments / 7).toFixed(1) : 0} per day
            </p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="dashboard-footer">
        <p className="updated-time">
          Last updated: {stats.timestamp ? new Date(stats.timestamp).toLocaleString() : 'Unknown'}
        </p>
      </div>
    </div>
  );
}

export default DashboardOverview;
