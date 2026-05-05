import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AdminList.css';

/**
 * AdminList - Component to display all admin users
 * Shows who has admin access on the platform
 */
function AdminList() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/admins', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const data = await response.json();
      setAdmins(data.admins);
    } catch (err) {
      console.error('Error loading admins:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Not logged in';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const remainingMins = diffMins % 60;
    const remainingHours = diffHours % 24;

    if (diffMins < 60) {
      return `active ${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      if (remainingMins > 0) {
        return `active ${remainingHours} hour${remainingHours !== 1 ? 's' : ''} and ${remainingMins} minute${remainingMins !== 1 ? 's' : ''} ago`;
      }
      return `active ${remainingHours} hour${remainingHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      if (remainingHours > 0) {
        return `active ${diffDays} day${diffDays !== 1 ? 's' : ''} and ${remainingHours} hour${remainingHours !== 1 ? 's' : ''} ago`;
      }
      return `active ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return formatDateTime(dateString);
    }
  };

  const getLastActiveDisplay = (lastLogin) => {
    return getRelativeTime(lastLogin);
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 'active' : 'inactive';
  };

  // Only show to admins
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-list-section">
      <h2>Admin Users</h2>
      <p className="section-description">
        See all users with admin access on the platform
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <p>Loading admins...</p>
        </div>
      ) : admins.length === 0 ? (
        <div className="empty-state">
          <p>No admin users found</p>
        </div>
      ) : (
        <div className="admin-list-wrapper">
          <div className="admin-list-header">
            <p className="admin-count">
              Total Admins: <strong>{admins.length}</strong>
            </p>
            <button className="btn-refresh" onClick={fetchAdmins}>
              Refresh
            </button>
          </div>

          <div className="admin-cards-grid">
            {admins.map(admin => (
              <div key={admin.id} className="admin-card">
                <div className="admin-card-header">
                  <div className="admin-info">
                    <h3 className="admin-username">{admin.username}</h3>
                    <span className={`status-badge status-${getStatusBadge(admin.is_active)}`}>
                      {admin.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="admin-card-body">
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{admin.email}</span>
                  </div>

                  {admin.guardianname && (
                    <div className="info-row">
                      <span className="info-label">Name:</span>
                      <span className="info-value">{admin.guardianname}</span>
                    </div>
                  )}

                  {admin.phone && (
                    <div className="info-row">
                      <span className="info-label">Phone:</span>
                      <span className="info-value">{admin.phone}</span>
                    </div>
                  )}

                  <div className="info-row">
                    <span className="info-label">Joined:</span>
                    <span className="info-value">{formatDate(admin.created_at)}</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Last Active:</span>
                    <span className={`info-value ${!admin.last_login ? 'info-never' : ''}`}>
                      {getLastActiveDisplay(admin.last_login)}
                    </span>
                  </div>
                </div>

                {admin.id === user.id && (
                  <div className="admin-card-footer">
                    <span className="you-badge">You</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminList;
