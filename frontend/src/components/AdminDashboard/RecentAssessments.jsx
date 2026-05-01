import React, { useState, useEffect } from 'react';

/**
 * RecentAssessments - View all symptom assessments from guardians
 * Shows recent pneumonia assessments made by guardians for their children
 */
function RecentAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchAssessments();
  }, [page]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit });
      const response = await fetch(`http://localhost:5000/api/admin/assessments?${params}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch assessments');
      const data = await response.json();
      setAssessments(data.assessments || []);
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentColor = (assessment) => {
    if (assessment.includes('SEVERE') || assessment.includes('DANGER')) {
      return '#dc3545';
    }
    if (assessment.includes('PNEUMONIA')) {
      return '#ffc107';
    }
    return '#28a745';
  };

  return (
    <div className="page-section">
      <div className="page-header">
        <h1>Assessments</h1>
        <p>Recent symptom assessments submitted by guardians</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading assessments...</p>
        </div>
      ) : assessments.length === 0 ? (
        <div className="empty-state">
          <p>No assessments found</p>
        </div>
      ) : (
        <>
          {/* Assessments Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guardian</th>
                  <th>Child Age</th>
                  <th>Assessment</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map(assessment => {
                  const date = new Date(assessment.timestamp);
                  return (
                    <tr key={assessment.id}>
                      <td>#{assessment.id}</td>
                      <td>
                        <strong>{assessment.username}</strong>
                        <br />
                        <small>ID: {assessment.user_id}</small>
                      </td>
                      <td>{assessment.age_months} months</td>
                      <td>
                        <span
                          className="assessment-tag"
                          style={{ backgroundColor: getAssessmentColor(assessment.assessment) }}
                        >
                          {assessment.assessment}
                        </span>
                      </td>
                      <td>{date.toLocaleDateString()}</td>
                      <td>{date.toLocaleTimeString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="btn-pagination"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="page-info">Page {page}</span>
            <button
              className="btn-pagination"
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default RecentAssessments;
