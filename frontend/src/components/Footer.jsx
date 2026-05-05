import React from 'react';
import { useNavigate } from 'react-router-dom';
import plogo from '../img/plogo.png';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="home-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={plogo} id="plogo" alt="Logo" />
          </div>
          <p className="footer-description">
            Helping parents, guardians and caregivers track, monitor, and protect children's respiratory health with evidence-based guidance following IMCI guidelines. No affiliation with World Health Organization (WHO).
          </p>
      
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4 className="footer-heading">Platform</h4>
            <button className="footer-link" type="button" onClick={() => navigate('')}>Home</button>
            <button className="footer-link" type="button" onClick={() => navigate('/symptom-form')}>Symptom Form</button>
            <button className="footer-link" type="button" onClick={() => navigate('/tracker')}>Tracker</button>
            <button className="footer-link" type="button" onClick={() => navigate('/info')}>Information</button>
          </div>

        <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <a className="footer-link" href="https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/child-health/integrated-management-of-childhood-illness" target="_blank" rel="noreferrer">
                    World Health Organization (WHO) and Integrated Management of Childhood Illness (IMCI)
            </a>
        </div>
       </div>
      </div>

     <div className="footer-bottom">
        <p className="footer-disclaimer">
          This app is NOT a substitute for professional medical advice.
        </p>
      </div>
    </footer>
  );
}