import React, { useState, useEffect } from 'react';

/**
 * AdminAnalytics - Platform analytics and reporting
 * Shows platform usage trends and guardian engagement
 */
function AdminAnalytics({ stats }) {
  const [analyticsData, setAnalyticsData] = useState({
    dailyAssessments: [],
    guardianGrowth: [],
    assessmentTrends: []
  });

  useEffect(() => {
    // Generate sample analytics data
    generateAnalyticsData();
  }, []);

  const generateAnalyticsData = () => {
    // Generate last 7 days of data
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        assessments: Math.floor(Math.random() * 10) + 2,
        newGuardians: Math.floor(Math.random() * 3)
      });
    }

    setAnalyticsData({
      dailyAssessments: days,
      guardianGrowth: days,
      assessmentTrends: [
        { category: 'Normal Observations', count: 8, percentage: 57 },
        { category: 'Monitor/Manage at Home', count: 4, percentage: 29 },
        { category: 'Referral Needed', count: 2, percentage: 14 }
      ]
    });
  };

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>Analytics & Reporting</h1>
          <p>Platform usage trends and engagement metrics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="analytics-metrics">
        <div className="metric-box">
          <h3>Avg Daily Assessments</h3>
          <p className="metric-large">
            {analyticsData.dailyAssessments.length > 0
              ? (analyticsData.dailyAssessments.reduce((sum, d) => sum + d.assessments, 0) / 7).toFixed(1)
              : '0'}
          </p>
          <p className="metric-small">Last 7 days</p>
        </div>

        <div className="metric-box">
          <h3>New Guardians This Week</h3>
          <p className="metric-large">
            {analyticsData.guardianGrowth.length > 0
              ? analyticsData.guardianGrowth.reduce((sum, d) => sum + d.newGuardians, 0)
              : '0'}
          </p>
          <p className="metric-small">Growth rate</p>
        </div>

        <div className="metric-box">
          <h3>Guardian Engagement</h3>
          <p className="metric-large">
            {stats && stats.total_users > 0
              ? ((stats.users_with_assessments / stats.total_users) * 100).toFixed(0)
              : '0'}
            %
          </p>
          <p className="metric-small">Active users</p>
        </div>

        <div className="metric-box">
          <h3>Avg Assessments/Guardian</h3>
          <p className="metric-large">
            {stats && stats.total_users > 0 && stats.total_assessments > 0
              ? (stats.total_assessments / stats.total_users).toFixed(1)
              : '0'}
          </p>
          <p className="metric-small">Per active guardian</p>
        </div>
      </div>

      {/* Daily Assessments Chart */}
      <div className="chart-section">
        <h2>Daily Assessments (Last 7 Days)</h2>
        <div className="chart-container">
          <div className="simple-chart">
            {analyticsData.dailyAssessments.map((day, index) => (
              <div key={index} className="chart-bar">
                <div className="bar-value">{day.assessments}</div>
                <div
                  className="bar"
                  style={{ height: `${(day.assessments / 15) * 100}%` }}
                ></div>
                <div className="bar-label">{day.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment Results Distribution */}
      <div className="chart-section">
        <h2>Assessment Outcomes Distribution</h2>
        <div className="distribution-chart">
          {analyticsData.assessmentTrends.map((item, index) => (
            <div key={index} className="distribution-item">
              <div className="distribution-header">
                <h4>{item.category}</h4>
                <span className="distribution-count">{item.count} assessments ({item.percentage}%)</span>
              </div>
              <div className="progress-bar-large">
                <div
                  className="progress-fill"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: index === 0 ? '#28a745' : index === 1 ? '#ffc107' : '#dc3545'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guardian Growth Chart */}
      <div className="chart-section">
        <h2>Guardian Growth (Last 7 Days)</h2>
        <div className="chart-container">
          <div className="simple-chart">
            {analyticsData.guardianGrowth.map((day, index) => (
              <div key={index} className="chart-bar">
                <div className="bar-value">{day.newGuardians}</div>
                <div
                  className="bar"
                  style={{
                    height: `${(day.newGuardians / 5) * 100}%`,
                    backgroundColor: '#6f42c1'
                  }}
                ></div>
                <div className="bar-label">{day.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="summary-section">
        <h2>Summary</h2>
        {stats && (
          <div className="summary-table">
            <div className="summary-row">
              <span>Total Guardians</span>
              <strong>{stats.total_users}</strong>
            </div>
            <div className="summary-row">
              <span>Active Users</span>
              <strong>{stats.active_users}</strong>
            </div>
            <div className="summary-row">
              <span>Total Assessments</span>
              <strong>{stats.total_assessments}</strong>
            </div>
            <div className="summary-row">
              <span>Engaged Guardians</span>
              <strong>{stats.users_with_assessments}</strong>
            </div>
            <div className="summary-row">
              <span>Recent Activity (7 days)</span>
              <strong>{stats.recent_assessments}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAnalytics;
