# Pneumtofy - Project File Tree

This file reflects the current website structure as of May 6, 2026.

```text
Pneumtofy/
├── README.md
├── QUICK_START.md
├── ARCHITECTURE.md
├── DEPLOYMENT_GUIDE.md
├── TROUBLESHOOTING.md
├── VERIFICATION_CHECKLIST.md
├── AUTHENTICATION_COMPLETE.md
├── AUTH_SETUP.md
├── AUTH_QUICK_START.md
├── setup.bat
├── setup.sh
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── decision_logic.py
│   ├── models.py
│   ├── models_auth.py
│   ├── requirements.txt
│   └── instance/
│       └── pneumtofy.db
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx
        ├── index.jsx
        ├── components/
        │   ├── AdminDashboard/
        │   ├── Footer.jsx
        │   ├── Home.jsx
        │   ├── Info.jsx
        │   ├── Login.jsx
        │   ├── Navigation.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── Register.jsx
        │   ├── Results.jsx
        │   ├── SymptomForm.jsx
        │   └── Tracker.jsx
        ├── contexts/
        │   └── AuthContext.jsx
        ├── img/
        │   ├── babybg.png
        │   ├── doctor-child.png
        │   ├── doctor-child1.png
        │   ├── lungs.png
        │   └── plogo.png
        ├── styles/
        │   ├── App.css
        │   ├── Auth.css
        │   ├── Footer.css
        │   ├── Home.css
        │   ├── Info.css
        │   ├── Navigation.css
        │   ├── Results.css
        │   ├── SymptomForm.css
        │   └── Tracker.css
        └── utils/
            └── dateFormatter.js
```

## Main Frontend Responsibilities

| File | Current role |
|------|--------------|
| `frontend/src/App.jsx` | Defines routes and applies full-width layouts for Home and Info Hub |
| `frontend/src/components/Navigation.jsx` | Desktop navigation, mobile hamburger menu, auth actions |
| `frontend/src/components/Home.jsx` | Landing/assessment entry experience and centered feature cards |
| `frontend/src/components/SymptomForm.jsx` | Collects age, cough, breathing, fever, and danger-sign inputs |
| `frontend/src/components/Results.jsx` | Shows decision outcome, guidance, warnings, and save-to-tracker flow |
| `frontend/src/components/Tracker.jsx` | Protected history page with current outcome filters |
| `frontend/src/components/Info.jsx` | Full-width educational Health Information Hub article |
| `frontend/src/contexts/AuthContext.jsx` | Shared session/user state and auth methods |
| `frontend/src/utils/dateFormatter.js` | Converts stored timestamps to local date and time display |

## Main Backend Responsibilities

| File | Current role |
|------|--------------|
| `backend/app.py` | API routes for auth, assessment, tracker, and health check |
| `backend/decision_logic.py` | Current decision outcomes: immediate care, pneumonia/amoxicillin, simple cough/cold, observe/manage |
| `backend/models_auth.py` | SQLAlchemy `User` and `TrackedAssessment` models |
| `backend/database.py` | SQLAlchemy app/database initialization |
| `backend/models.py` | Supporting/legacy information content model code |

## Current User Flow

1. A caregiver opens the site at `http://localhost:3000`.
2. They complete the symptom form from the home page.
3. The frontend posts symptoms to `POST /api/assess`.
4. The backend returns the current decision outcome and guidance.
5. The Results page shows the recommendation and allows saving.
6. If the caregiver is not logged in, the pending assessment is preserved through login/register.
7. Saved assessments appear in the protected Tracker page with local date/time formatting.
8. The Info Hub provides full-width article-style education about pneumonia and care response.

