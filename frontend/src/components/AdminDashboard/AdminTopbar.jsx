import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * AdminTopbar - Professional top navigation bar
 * Provides menu toggle, search, and user profile dropdown
 */
function AdminTopbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/recent-assessments', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        // Get recent assessments from last 24 hours
        const recentCount = data.assessments ? data.assessments.slice(0, 5).length : 0;
        setNotificationCount(recentCount);
        
        // Format notifications
        if (data.assessments) {
          const notifs = data.assessments.slice(0, 5).map((assessment, index) => ({
            id: index,
            title: `New Assessment from ${assessment.guardian_username}`,
            message: `Child age ${assessment.age}: ${assessment.assessment_type}`,
            time: assessment.created_at,
            type: assessment.assessment_type.includes('SEVERE') ? 'critical' : 'info'
          }));
          setNotifications(notifs);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const clearNotifications = () => {
    setNotifications([]);
    setNotificationCount(0);
  };

  return (
    <div className="admin-topbar">
      {/* Menu Toggle (Mobile) */}
      <button className="topbar-menu-btn" onClick={onMenuClick}>
        <span className="menu-icon">≡</span>
      </button>


      {/* Right Section - Notifications & Profile */}
      <div className="topbar-right">
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button 
            className="topbar-icon-btn notifications-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <span className="topbar-icon">✉</span>
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>

          {notificationsOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              boxShadow: 'var(--shadow-lg)',
              minWidth: '300px',
              maxWidth: '400px',
              zIndex: 1001,
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <div style={{
                padding: 'var(--spacing-lg)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Notifications</h3>
                <button
                  onClick={clearNotifications}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--secondary-color)'
                  }}
                >
                  Clear All
                </button>
              </div>
              
              {notifications.length > 0 ? (
                <div>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: 'var(--spacing-md)',
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--light-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        fontWeight: 500,
                        color: notif.type === 'critical' ? 'var(--danger-color)' : 'var(--dark-text)'
                      }}>
                        {notif.title}
                      </p>
                      <p style={{
                        margin: '4px 0 0 0',
                        fontSize: '12px',
                        color: 'var(--secondary-color)'
                      }}>
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: 'var(--spacing-lg)',
                  textAlign: 'center',
                  color: 'var(--secondary-color)',
                  fontSize: '13px'
                }}>
                  No new notifications
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="profile-dropdown-wrapper">
          <button
            className="profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <span className="profile-initial">{user?.username?.charAt(0).toUpperCase() || 'A'}</span>
            <span className="profile-name">{user?.guardianname || user?.username || 'Admin'}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p className="dropdown-username">{user?.username}</p>
                <p className="dropdown-email">{user?.email}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => { setProfileOpen(false); }}>
                Profile Settings
              </button>
              <button className="dropdown-item" onClick={() => { setProfileOpen(false); }}>
                System Settings
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTopbar;
