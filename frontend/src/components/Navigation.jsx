import React from 'react';
import './Navigation.css';

export default function Navigation({ currentPage, setCurrentPage, onGoHome }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={onGoHome}>
          <h1>🫁 Pneumtofy</h1>
        </div>
        <ul className="nav-menu">
          <li>
            <button 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={onGoHome}
            >
              Home
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentPage === 'info' ? 'active' : ''}`}
              onClick={() => setCurrentPage('info')}
            >
              Info
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentPage === 'tracker' ? 'active' : ''}`}
              onClick={() => setCurrentPage('tracker')}
            >
              Tracker
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
