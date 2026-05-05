import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminInvitePanel from './AdminInvitePanel';
import AdminList from './AdminList';

/**
 * AdminSettings - System configuration and admin settings
 * Allows admin users to manage platform settings
 */
function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    platformName: 'Pneumofy',
    notificationsEnabled: true,
    emailNotifications: true,
    dataRetention: 90,
    maintenanceMode: false,
    maxUploadSize: 5
  });
  
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setUnsavedChanges(true);
    setSaveStatus(null);
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      setSaveStatus('Settings saved successfully');
      setUnsavedChanges(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('Error saving settings');
    }
  };

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>System Settings</h1>
          <p>Configure platform settings and preferences</p>
        </div>
        {unsavedChanges && (
          <button className="btn-primary" onClick={handleSaveSettings}>
            Save Changes
          </button>
        )}
      </div>

      {saveStatus && (
        <div className={`status-message ${saveStatus.includes('Error') ? 'error' : 'success'}`}>
          {saveStatus}
        </div>
      )}

      {/* General Settings */}
      <div className="settings-section">
        <h2>General Settings</h2>
        
        <div className="setting-item">
          <div className="setting-label">
            <h3>Platform Name</h3>
            <p>The name displayed across the platform</p>
          </div>
          <input
            type="text"
            value={settings.platformName}
            onChange={(e) => handleSettingChange('platformName', e.target.value)}
            className="settings-input"
          />
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <h3>Data Retention Period (days)</h3>
            <p>How long to keep historical assessment data</p>
          </div>
          <input
            type="number"
            min="30"
            max="365"
            value={settings.dataRetention}
            onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
            className="settings-input"
          />
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <h3>Max Upload Size (MB)</h3>
            <p>Maximum file upload size limit</p>
          </div>
          <input
            type="number"
            min="1"
            max="50"
            value={settings.maxUploadSize}
            onChange={(e) => handleSettingChange('maxUploadSize', parseInt(e.target.value))}
            className="settings-input"
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="settings-section">
        <h2>Notification Settings</h2>
        
        <div className="setting-item">
          <div className="setting-label">
            <h3>Enable Notifications</h3>
            <p>Allow system-wide notifications</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <h3>Email Notifications</h3>
            <p>Send email alerts for important events</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* Maintenance Settings */}
      <div className="settings-section">
        <h2>Maintenance</h2>
        
        <div className="setting-item">
          <div className="setting-label">
            <h3>Maintenance Mode</h3>
            <p>Enable to show maintenance message to users</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* System Information */}
      <div className="settings-section">
        <h2>System Information</h2>
        
        <div className="system-info">
          <div className="info-item">
            <p className="info-label">Platform Version</p>
            <p className="info-value">1.0.0</p>
          </div>
          <div className="info-item">
            <p className="info-label">Administrator</p>
            <p className="info-value">{user?.username || 'Admin User'}</p>
          </div>
          <div className="info-item">
            <p className="info-label">Last Updated</p>
            <p className="info-value">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Admin Invite Panel */}
      <AdminInvitePanel />

      {/* Admin List */}
      <AdminList />
    </div>
  );
}

export default AdminSettings;
