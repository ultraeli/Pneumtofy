import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

export default function Navigation({ onGoHome }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getPageName = (path) => {
    if (path === '/' || path === '/results') return 'home';
    if (path === '/info') return 'info';
    if (path === '/tracker') return 'tracker';
    return '';
  };

  const currentPage = getPageName(location.pathname);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const handleHomeClick = () => {
    onGoHome();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={handleHomeClick}>
          <h1>🫁 Pneumtofy</h1>
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
              to="/info" 
              className={`nav-link ${currentPage === 'info' ? 'active' : ''}`}
            >
              Info
            </Link>
          </li>
          <li>
            <Link 
              to="/tracker" 
              className={`nav-link ${currentPage === 'tracker' ? 'active' : ''}`}
            >
              Tracker
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
            <div className="auth-buttons">
              <Link to="/login" className="nav-link login-link">Login</Link>
              <Link to="/register" className="nav-link register-link">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
