import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AdminInvitePanel.css';

/**
 * AdminInvitePanel - Component for admins to create and manage invitations
 * Allows existing admins to send invitations to others to join as admins
 */
function AdminInvitePanel() {
  const { user } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch invites on mount
  useEffect(() => {
    fetchInvites();
  }, [filterStatus]);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:5000/api/admin/invites?status=${filterStatus}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }

      const data = await response.json();
      setInvites(data.invites);
    } catch (err) {
      console.error('Error loading invites:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateInvite = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('http://localhost:5000/api/admin/invites/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create invitation');
      }

      setSuccess(`Invitation sent to ${formData.email}. They can accept it within 7 days.`);
      setFormData({ email: '', name: '' });
      
      // Refresh list
      setTimeout(() => fetchInvites(), 500);
    } catch (err) {
      console.error('Error creating invite:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeInvite = async (inviteId) => {
    if (!window.confirm('Are you sure you want to revoke this invitation?')) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`http://localhost:5000/api/admin/invites/${inviteId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to revoke invitation');
      }

      setSuccess('Invitation revoked');
      fetchInvites();
    } catch (err) {
      console.error('Error revoking invite:', err);
      setError(err.message);
    }
  };

  const copyInviteLink = (token) => {
    const link = `http://localhost:3000/accept-invite/${token}`;
    navigator.clipboard.writeText(link).then(() => {
      setSuccess('Invite link copied to clipboard!');
      setTimeout(() => setSuccess(null), 3000);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  // Only show to admins
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-invite-panel">
      <div className="invite-section">
        <h2>Invite New Admin</h2>
        <p className="section-description">Send an invitation to someone to join as an admin</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleCreateInvite} className="invite-form">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="person@example.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name (optional)</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              disabled={isSubmitting}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary-invite"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Send Invitation'}
          </button>
        </form>
      </div>

      <div className="invites-list-section">
        <h2>Manage Invitations</h2>
        
        <div className="filter-tabs">
          <button 
            className={`tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button 
            className={`tab ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
          <button 
            className={`tab ${filterStatus === 'accepted' ? 'active' : ''}`}
            onClick={() => setFilterStatus('accepted')}
          >
            Accepted
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading invitations...</p>
          </div>
        ) : invites.length === 0 ? (
          <div className="empty-state">
            <p>No {filterStatus !== 'all' ? filterStatus : ''} invitations</p>
          </div>
        ) : (
          <div className="invites-table-wrapper">
            <table className="invites-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invites.map(invite => (
                  <tr key={invite.id} className={`invite-row ${invite.status}`}>
                    <td className="email-cell">{invite.invited_email}</td>
                    <td>{invite.invited_name || '-'}</td>
                    <td>
                      <span className={`status-badge status-${invite.status}`}>
                        {invite.status}
                      </span>
                    </td>
                    <td>{formatDate(invite.created_at)}</td>
                    <td>{formatDate(invite.expires_at)}</td>
                    <td className="actions-cell">
                      {invite.status === 'pending' && (
                        <>
                          <button 
                            className="btn-small btn-copy"
                            onClick={() => copyInviteLink(invite.token)}
                            title="Copy invite link"
                          >
                            Copy Link
                          </button>
                          <button 
                            className="btn-small btn-revoke"
                            onClick={() => handleRevokeInvite(invite.id)}
                            title="Revoke invitation"
                          >
                            Revoke
                          </button>
                        </>
                      )}
                      {invite.status === 'accepted' && (
                        <span className="accepted-by">
                          Accepted by {invite.accepted_by}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInvitePanel;
