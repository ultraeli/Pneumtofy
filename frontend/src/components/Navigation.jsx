import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navigation.css';

export default function Navigation({ onGoHome }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getPageName = (path) => {
    if (path === '/') return 'home';
    if (path === '/symptom-form' || path === '/results') return 'symptom-form';
    if (path === '/info') return 'info';
    if (path === '/tracker') return 'tracker';
    return '';
  };

  const currentPage = getPageName(location.pathname);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleStartTracking = () => {
    navigate('/symptom-form');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={handleHomeClick}>
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#17a2b8" opacity="0.16" />
                <path d="M12 6V12L15 14.5" stroke="#17a2b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="brand-text">Pneumtofy</span>
          </div>
        </div>
        <ul className="nav-menu">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/symptom-form" 
              className={`nav-link ${currentPage === 'symptom-form' ? 'active' : ''}`}
            >
              Symptom Form
            </Link>
          </li>
          <li>
            <Link 
              to="/tracker" 
              className={`nav-link ${currentPage === 'tracker' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/info" 
              className={`nav-link ${currentPage === 'info' ? 'active' : ''}`}
            >
              Info Hub
            </Link>
          </li>
        </ul>

        <div className="nav-auth">
          {isAuthenticated && user ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-icon">👤</span>
                <span className="username">{user.username}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-email">{user.email}</p>
                  </div>
                  <button 
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="auth-buttons">
                <Link to="/login" className="nav-link login-link">Login</Link>
                <Link to="/register" className="nav-link register-link">Register</Link>
              </div>
              <button className="btn-start-tracking" onClick={handleStartTracking}>
                Start Tracking
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
