import React, { useState, useEffect } from 'react';

/**
 * GuardianManagement - View and manage guardian/parent users
 * Displays all registered guardians with their activity and assessments
 */
function GuardianManagement() {
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit] = useState(10);

  useEffect(() => {
    fetchGuardians();
  }, [page, search]);

  const fetchGuardians = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit,
        search
      });
      const response = await fetch(`http://localhost:5000/api/admin/users?${params}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch guardians');
      const data = await response.json();
      setGuardians(data.users || []);
    } catch (error) {
      console.error('Error loading guardians:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this guardian?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to deactivate guardian');
      fetchGuardians();
    } catch (error) {
      console.error('Error deactivating guardian:', error);
      alert('Failed to deactivate guardian');
    }
  };

  return (
    <div className="page-section">
      <div className="page-header">
        <h1>Guardians Management</h1>
        <p>Monitor and manage all registered guardians/parents</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, or username..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">
          <p>Loading guardians...</p>
        </div>
      ) : guardians.length === 0 ? (
        <div className="empty-state">
          <p>No guardians found</p>
        </div>
      ) : (
        <>
          {/* Guardians Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Assessments</th>
                  <th>Registered</th>
                  <th>Last Active</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {guardians.map(guardian => (
                  <tr key={guardian.id}>
                    <td>#{guardian.id}</td>
                    <td><strong>{guardian.username}</strong></td>
                    <td>{guardian.guardianname || '-'}</td>
                    <td>{guardian.email}</td>
                    <td>{guardian.phone || '-'}</td>
                    <td>{guardian.assessment_count || 0}</td>
                    <td>{guardian.created_at ? new Date(guardian.created_at).toLocaleDateString() : '-'}</td>
                    <td>{guardian.last_login ? new Date(guardian.last_login).toLocaleDateString() : 'Never'}</td>
                    <td>
                      <span className={`status-badge ${guardian.is_active ? 'active' : 'inactive'}`}>
                        {guardian.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => handleDeactivate(guardian.id)}
                        disabled={!guardian.is_active}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
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

export default GuardianManagement;
