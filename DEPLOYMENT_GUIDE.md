# Pneumtofy - Deployment and Project Guide

**Version**: 1.2  
**Status**: Local development ready, deployment-ready with environment configuration  
**Last updated**: May 6, 2026

## Current App

Pneumtofy is a React and Flask website for childhood pneumonia symptom assessment, education, and personal tracking. It is designed for caregivers to enter symptoms, receive structured guidance based on the current decision logic, and save assessment history after logging in.

The site currently includes:
- A responsive home and assessment experience
- Authentication with registration, login, logout, profile data, and session cookies
- A protected tracker page backed by SQLite through SQLAlchemy
- A full-width, article-style Health Information Hub
- Desktop navigation and a mobile hamburger navigation menu

## Frontend

**Location**: `frontend/`  
**Stack**: React 18, React Router, Axios, CSS modules by component area

Key files:

| File | Purpose |
|------|---------|
| `src/App.jsx` | Routes and shared page layout |
| `src/components/Navigation.jsx` | Desktop and mobile navigation with auth actions |
| `src/components/SymptomForm.jsx` | Symptom input form |
| `src/components/Results.jsx` | Assessment result display and tracker save workflow |
| `src/components/Tracker.jsx` | Protected assessment history with current filters |
| `src/components/Info.jsx` | Article-style Health Information Hub |
| `src/contexts/AuthContext.jsx` | Global authentication state |
| `src/utils/dateFormatter.js` | Local timezone date/time formatting |
| `src/styles/*.css` | Component and page styling |

The frontend development server runs at `http://localhost:3000`.

## Backend

**Location**: `backend/`  
**Stack**: Flask, Flask-CORS, Flask-Login, Flask-SQLAlchemy, Werkzeug password hashing

Key files:

| File | Purpose |
|------|---------|
| `app.py` | Flask app, auth routes, assessment route, tracker routes |
| `decision_logic.py` | Current symptom decision logic |
| `database.py` | SQLAlchemy initialization |
| `models_auth.py` | `User` and `TrackedAssessment` database models |
| `models.py` | Legacy/supporting content model code |
| `requirements.txt` | Python dependencies |

The backend development server runs at `http://localhost:5000`.

## Database

Development uses SQLite through SQLAlchemy. The active database is created under the backend instance/database path when the Flask app starts.

Current important tables:
- `user`: registered caregivers and login data
- `tracked_assessment`: saved assessments linked to each user

Production can be adapted to PostgreSQL by configuring the SQLAlchemy database URL and deploying behind a proper WSGI server.

## Current Decision Logic

The current backend returns one of four practical outcomes:

| Condition | Outcome |
|-----------|---------|
| Any danger sign | `SEEK IMMEDIATE MEDICAL CARE` |
| Cough plus age-based fast breathing | `PNEUMONIA - Treat with Amoxicillin` |
| Uncomplicated cough/cold symptoms | `SIMPLE COUGH or COLD` |
| Mild symptoms without pneumonia indicators | `OBSERVE & MANAGE AT HOME` |

Danger signs include chest indrawing, high fever above 40.6 C, dyspnea/difficulty breathing, stridor, lethargy, inability to drink, convulsions, cyanosis, and unconsciousness.

Age-based fast breathing thresholds:
- 2 to under 12 months: 50 breaths/min or more
- 12 to under 60 months: 40 breaths/min or more

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/assess` | Assess symptoms and return guidance |
| `POST` | `/api/auth/register` | Create a user account |
| `POST` | `/api/auth/login` | Log in with username/email and password |
| `POST` | `/api/auth/logout` | Log out current user |
| `GET` | `/api/auth/me` | Get current user session |
| `PUT` | `/api/auth/update` | Update profile or password |
| `GET` | `/api/tracker` | Get saved assessments for the logged-in user |
| `POST` | `/api/tracker` | Save an assessment for the logged-in user |
| `DELETE` | `/api/tracker/<id>` | Delete one saved assessment |
| `GET` | `/health` | Backend health check |

## Tracker

The tracker is protected by login and shows saved assessments with local date/time formatting. It currently filters entries by:
- All Assessments
- Seek Immediate Care
- Pneumonia / Amoxicillin
- Simple Cough or Cold
- Observe & Manage

## Health Information Hub

The Info Hub is now a full-width educational page rather than a set of repeated symptom cards. It includes a "What is Pneumonia?" section, global childhood pneumonia burden information, and article sections based on WHO/UNICEF/CDC-style educational content about access to care, community response, treatment, and prevention.

## Running Locally

Backend:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Frontend:

```bash
cd frontend
npm install
npm start
```

For local desktop development, open `http://localhost:3000`.

For phone testing on the same Wi-Fi network, the frontend can be opened through the computer's LAN IP, but the backend must also be reachable from the phone. The current hardcoded localhost API setup is suitable for desktop local use; LAN/mobile testing needs host and API URL configuration.

## Build Notes

`npm run build` creates an optimized production bundle in `frontend/build`. It does not edit source files, but it writes build output files. The user has chosen to run builds manually.

## Deployment Checklist

- [ ] Install backend dependencies
- [ ] Install frontend dependencies
- [ ] Configure production database URL if not using SQLite
- [ ] Configure session secret securely
- [ ] Configure frontend API base URL for the deployed backend
- [ ] Serve the React build through a static host or web server
- [ ] Run Flask through a production WSGI server
- [ ] Verify auth, assessment, tracker save/delete, Info Hub, and mobile navigation
- [ ] Confirm medical disclaimers and source references are visible
