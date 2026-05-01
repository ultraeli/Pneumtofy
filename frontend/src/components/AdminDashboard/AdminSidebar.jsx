import React from 'react';

/**
 * AdminSidebar - Professional left navigation sidebar
 * Shows menu items: Dashboard, Guardians, Assessments, Analytics, Settings
 */
function AdminSidebar({ currentPage, onNavigate, isOpen, onToggle }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'guardians', label: 'Users' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onToggle}></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-letter">P</span>
            <span className="logo-text">Pneumofy Admin</span>
          </div>
          <button className="close-sidebar" onClick={onToggle}>
            ×
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-items">
            {menuItems.map(item => (
              <li key={item.id} className="nav-item-wrapper">
                <button
                  className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-indicator"></span>
            <div className="status-text">
              <p>System Status</p>
              <p>Online</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
