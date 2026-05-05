import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navigation.css';
import plogo from '../img/plogo.png';

export default function Navigation({ onGoHome }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleHomeClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleStartTracking = () => {
    setIsMobileMenuOpen(false);
    navigate('/symptom-form');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={handleHomeClick}>
          <div className="brand">
            <img src={plogo} id="plogo" alt="Logo" />
            <span className="brand-text">neumtofy</span>
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
              Tracker
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
          {isAuthenticated && user && user.role === 'admin' && (
            <li>
              <Link 
                to="/admin" 
                className="nav-link admin-link"
              >
                Admin Panel
              </Link>
            </li>
          )}
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

        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-nav-panel">
          <Link to="/" className={`mobile-nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Home
          </Link>
          <Link to="/symptom-form" className={`mobile-nav-link ${currentPage === 'symptom-form' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Symptom Form
          </Link>
          <Link to="/tracker" className={`mobile-nav-link ${currentPage === 'tracker' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Tracker
          </Link>
          <Link to="/info" className={`mobile-nav-link ${currentPage === 'info' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Info Hub
          </Link>
          {isAuthenticated && user && user.role === 'admin' && (
            <Link to="/admin" className="mobile-nav-link admin-link" onClick={closeMobileMenu}>
              Admin Panel
            </Link>
          )}

          <div className="mobile-nav-auth">
            {isAuthenticated && user ? (
              <>
                <div className="mobile-user-summary">
                  <span>{user.username}</span>
                  <small>{user.email}</small>
                </div>
                <button className="mobile-logout-btn" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link mobile-auth-link" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="mobile-nav-link mobile-auth-link" onClick={closeMobileMenu}>
                  Register
                </Link>
                <button className="mobile-start-btn" type="button" onClick={handleStartTracking}>
                  Start Tracking
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
