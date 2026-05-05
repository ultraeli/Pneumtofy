import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AcceptInvite.css';

/**
 * AcceptInvite - Component for users to accept admin invitations
 * Users can only access this page via a unique invitation token
 */
function AcceptInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpgrade, setIsUpgrade] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Verify invite on mount
  useEffect(() => {
    verifyInvite();
  }, [token]);

  const verifyInvite = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `http://localhost:5000/api/admin/invites/${token}/verify`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid or expired invitation');
      }

      const data = await response.json();
      setInviteData(data);
      
      // Check if this is an upgrade by trying to detect if email already exists
      // This is a heuristic - if name is already set and empty username makes sense, it's likely an upgrade
      setIsUpgrade(!!data.name && data.name !== data.email);
    } catch (err) {
      console.error('Error verifying invite:', err);
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

  const validateForm = () => {
    // For new accounts, require username and password
    if (!isUpgrade) {
      if (!formData.username.trim()) {
        setError('Username is required');
        return false;
      }

      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters');
        return false;
      }
    }

    // Password is optional for upgrades but required for new accounts
    if (!isUpgrade) {
      if (!formData.password) {
        setError('Password is required');
        return false;
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    } else {
      // For upgrades, if password is provided, validate it
      if (formData.password && formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `http://localhost:5000/api/admin/invites/${token}/accept`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin account');
      }

      // Log them in
      login(data.user);
      setSuccess('Admin account created successfully!');
      
      // Redirect to admin dashboard
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      console.error('Error accepting invite:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="accept-invite-container">
        <div className="loading-state">
          <p>Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !inviteData) {
    return (
      <div className="accept-invite-container">
        <div className="error-card">
          <h2>Invitation Invalid</h2>
          <p>{error}</p>
          <button className="btn-back" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="accept-invite-container">
      <div className="accept-invite-card">
        <div className="invite-header">
          <h1>Create Admin Account</h1>
          <p>
            {isUpgrade 
              ? 'Your account has been promoted to admin. Set a new password or keep your existing one.'
              : 'You have been invited to become an administrator'}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="invite-info">
          <div className="info-item">
            <label>Email Address</label>
            <div className="info-value">{inviteData?.email}</div>
          </div>
          {inviteData?.name && (
            <div className="info-item">
              <label>Invited Name</label>
              <div className="info-value">{inviteData.name}</div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="accept-invite-form">
          {!isUpgrade && (
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose your username"
                minLength="3"
                required
                disabled={isSubmitting}
                autoComplete="username"
              />
              <small className="form-hint">At least 3 characters</small>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">
              Password {isUpgrade ? '(optional)' : '*'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={isUpgrade ? 'Leave blank to keep existing password' : 'Create a strong password'}
              minLength={formData.password ? "8" : undefined}
              required={!isUpgrade}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            <small className="form-hint">
              {isUpgrade 
                ? 'Leave blank to keep your current password, or enter at least 8 characters for a new one'
                : 'At least 8 characters'}
            </small>
          </div>

          {(formData.password || !isUpgrade) && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter your password"
                required={formData.password ? true : !isUpgrade}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn-create-admin"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Activating...' 
              : isUpgrade 
                ? 'Activate Admin Access' 
                : 'Create Admin Account'}
          </button>
        </form>

        <p className="info-text">
          {isUpgrade
            ? 'Your account will now have full admin access to the platform.'
            : "Once you create your account, you'll have full admin access to the platform."}
        </p>
      </div>
    </div>
  );
}

export default AcceptInvite;
