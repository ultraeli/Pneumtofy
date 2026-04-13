# Pneumtofy - Deployment & Project Guide

**Version**: 1.1 (with Authentication & SQLite ORM)  
**Status**: Production Ready  
**Date**: Updated 2026  
**Team**: Group 10

---

## Quick Start

Pneumtofy is a **pneumonia monitoring and information platform** designed for caregivers (parents/guardians) to:
- **Track symptoms** of children with potential pneumonia
- **Get risk assessments** based on IMCI guidelines
- **Receive recommendations** for home management or medical care
- **Access reliable information** about pneumonia prevention

**Core Principles**:
- ✅ Non-invasive treatment focus (home remedies first)
- ✅ IMCI-based clinical decision-making (WHO standards)
- ✅ Child-focused (under 5 years priority)
- ✅ Caregiver-friendly interface
- ✅ Strong medical disclaimers throughout

---

## Built Architecture

### Frontend (React.js)
**Location**: `frontend/`  
**Technology**: React 18, CSS3, Axios  
**Key Components**:

| Component | Purpose |
|-----------|---------|
| `Navigation` | App navigation and branding |
| `SymptomForm` | Input child symptoms (main form) |
| `Results` | Display assessment & recommendations |
| `Info` | Educational pneumonia information |
| `Tracker` | View and manage assessment history |

**Styling**: Responsive CSS (mobile-first design)  
**Color Scheme**: Purple gradient primary, with risk-level color coding (red=critical, orange=moderate, green=mild)

### Backend (Python Flask)
**Location**: `backend/`  
**Core Files**:

| File | Purpose |
|------|---------|
| `app.py` | Flask API server & routes |
| `decision_logic.py` | IMCI assessment algorithm |
| `models.py` | Data models & information content |
| `requirements.txt` | Python dependencies |

**Data Storage**: SQLite with SQLAlchemy ORM (auto-created as `pneumtofy.db`)  
**Authentication**: Flask-Login with session management  
**Password Security**: Bcrypt hashing (Werkzeug)  
**Timestamps**: UTC with Intl.DateTimeFormat API for local display  
**Production Ready**: Can switch to PostgreSQL with DATABASE_URL environment variable

### Database (PostgreSQL - Ready for Integration)
**Location**: `database/schema.sql`  
**Tables**:
- `tracker_entries` - Stores all symptom assessments
- `information_content` - Stores medical information

---

## IMCI-Based Assessment Logic

### Critical Signs (Immediate Medical Referral)
When **ANY** of these are present → **SEEK IMMEDIATE MEDICAL CARE**:
1. ⚠️ **Chest wall indrawing**
2. ⚠️ **Stridor** in calm child
3. ⚠️ **Lethargy** (unusual sleepiness/weakness)
4. ⚠️ **Unable to drink** or breastfeed

### Pneumonia Indicators (Observation & Home Management)
When **ANY** of these are present → **OBSERVE & MANAGE AT HOME**:
- **Fast breathing** (age-based thresholds)
  - < 2 months: ≥50 breaths/min
  - 2-12 months: ≥40 breaths/min
  - >12 months: ≥30 breaths/min
- **Persistent cough** (≥7 days)
- **Difficulty breathing**
- **Fever** (any temperature above 37.5°C)

### Mild/No Symptoms
When symptoms don't match above → **OBSERVE & MANAGE AT HOME (Mild)**

---

## Key Features Built

### ✅ 1. Symptom Assessment Form
- Inputs: Age, cough duration, respiratory symptoms, fever, general symptoms
- Real-time form validation
- Medical terminology with tooltips
- IMCI-aligned symptom checklist

### ✅ 2. Instant Risk Assessment
- **Three-tier classification**: Mild → Moderate → Critical
- Color-coded results display
- Clear recommendation messaging
- Guidance steps for caregivers

### ✅ 3. Home Remedies Suggestions
For observation cases:
-  Honey (safe throat soother)
-  Warm fluids (hydration)
-  Steam inhalation (respiratory support)
-  Chest rubs (comfort)
-  Proper rest (healing)
-  OTC pain/fever reducers (with strong medical consultation warnings)

### ✅ 4. Pneumonia Information Hub
- What is pneumonia?
- Symptoms in children
- Risk factors
- When to seek medical care
- Prevention strategies
- WHO/UNICEF/CHD sources

### ✅ 5. Symptom Tracker
- Save all assessments to history
- View past entries with timestamps
- Filter by risk level
- Delete old entries
- Track progression over time

### ✅ 6. Medical Disclaimers
- Disclaimers on every page
- Non-substitute for professional care
- Clear when to seek medical attention
- Safe remedy warnings

---

## Assessment Test Results

| Test | Case | Expected | Result | Status |
|------|------|----------|--------|--------|
| 1 | Mild symptoms (2-day cough, no other signs) | MILD | MILD | ✅ PASS |
| 2 | Moderate (7-day cough, fast breathing, fever 38.5°C) | MODERATE | MODERATE | ✅ PASS |
| 3 | Critical (chest indrawing) | CRITICAL | CRITICAL | ✅ PASS |
| 4 | Critical (lethargy) | CRITICAL | CRITICAL | ✅ PASS |
| 5 | Critical (unable to drink) | CRITICAL | CRITICAL | ✅ PASS |

---

## How to Run

### Quick Setup (Windows)
```bash
cd Pneumtofy
setup.bat
```

### Quick Setup (macOS/Linux)
```bash
cd Pneumtofy
bash setup.sh
```

### Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

---

## API Endpoints

### POST `/api/assess`
Assesses symptoms and returns risk classification.

**Sample Request**:
```json
{
  "age_months": 24,
  "cough_duration": 7,
  "fast_breathing": true,
  "fever": true,
  "fever_temperature": 38.5,
  "difficulty_breathing": false,
  "chest_indrawing": false,
  "stridor": false,
  "lethargy": false,
  "unable_to_drink": false,
  "vomiting": false,
  "diarrhea": false,
  "previous_episodes": 0
}
```

**Sample Response**:
```json
{
  "assessment": "OBSERVE & MANAGE AT HOME",
  "risk_level": "MODERATE",
  "recommendation": "Suspected pneumonia - Careful observation recommended...",
  "guidance": ["Monitor breathing rate...", "Ensure child stays hydrated..."],
  "home_remedies": [
    {
      "name": "Honey",
      "description": "Natural throat soother...",
      "dosage": "5ml (1 tsp) as needed..."
    }
  ],
  "warning": "If symptoms worsen..."
}
```

### GET `/api/info`
Returns pneumonia information content.

### POST `/api/tracker`
Saves assessment to history.

### GET `/api/tracker`
Retrieves all assessments.

### DELETE `/api/tracker/<id>`
Removes assessment entry.

---

## Project Structure

```
Pneumtofy/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx (updated with auth UI)
│   │   │   ├── Navigation.css (new)
│   │   │   ├── Login.jsx (new - login page)
│   │   │   ├── Register.jsx (new - registration page)
│   │   │   ├── ProtectedRoute.jsx (new - route protection)
│   │   │   ├── SymptomForm.jsx
│   │   │   ├── Results.jsx (updated with pending auto-save)
│   │   │   ├── Tracker.jsx (updated with timezone display)
│   │   │   ├── Info.jsx
│   │   │   ├── Auth.css (new)
│   │   │   ├── SymptomForm.css
│   │   │   ├── Results.css
│   │   │   ├── Info.css
│   │   │   └── Tracker.css
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx (new - global auth state)
│   │   ├── utils/
│   │   │   └── dateFormatter.js (new - timezone support)
│   │   ├── App.jsx (updated with React Router)
│   │   ├── App.css
│   │   └── index.jsx
│   └── package.json (updated with router, cross-env)
│
├── backend/
│   ├── app.py (updated with auth routes, 350+ lines)
│   ├── database.py (new - SQLAlchemy initialization)
│   ├── models_auth.py (new - User & TrackedAssessment models)
│   ├── models.py (existing - assessment IMCI logic)
│   ├── decision_logic.py (existing - assessment algorithm)
│   ├── requirements.txt (updated with auth dependencies)
│   ├── pneumtofy.db (auto-created SQLite database)
│   └── data/
│       └── [assessment info files]
│
├── database/
│   └── schema.sql (PostgreSQL schema - for production migration)
│
├── README.md (updated)
├── QUICK_START.md (updated)
├── AUTHENTICATION_COMPLETE.md (new)
├── AUTH_SETUP.md (new)
├── AUTH_QUICK_START.md (new)
├── ARCHITECTURE.md (updated)
├── VERIFICATION_CHECKLIST.md (updated)
├── TROUBLESHOOTING.md (updated)
├── PROJECT_FILE_TREE.md
├── DEPLOYMENT_GUIDE.md (this file)
└── [setup scripts]
```

---

## Safety & Compliance

### Medical Disclaimers ✅
- App is NOT a substitute for professional medical advice
- Cannot diagnose pneumonia
- Only observes symptoms
- All pages include mandatory disclaimers

### Information Sources ✅
- WHO Integrated Management of Childhood Illness (IMCI)
- UNICEF guidelines
- CHD & MCA publications
- Evidence-based remedies only

### Data Privacy ✅
- No user authentication (local testing)
- Data stored locally (JSON files)
- Ready for secure database integration
- No external data sharing

---

## 🔄 Next Steps & Future Enhancements

### Phase 2 (After Fast MVP):
1. **Database Integration**: Migrate from JSON to PostgreSQL
2. **User Accounts**: Parent/guardian authentication
3. **Multi-language**: Tagalog, English, other local languages
4. **Mobile App**: React Native or native iOS/Android
5. **Push Notifications**: Reminders for follow-up checks
6. **Admin Panel**: Update medical information, manage content
7. **Analytics**: Track usage patterns, identify high-risk areas
8. **Health System Integration**: Connect with local health facilities
9. **Offline Mode**: Work without internet connection
10. **Enhanced Security**: HIPAA/data protection compliance

### Code Quality Improvements:
- Unit tests (Jest for React, Pytest for Python)
- Integration tests
- E2E testing (Cypress/Selenium)
- Performance optimization
- Error tracking (Sentry)
- Code documentation (JSDoc/Docstrings)

---

## Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Backend won't connect
```bash
# Check Python version
python --version  # Should be 3.7+

# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # macOS/Linux
```

### CORS errors
- Make sure backend is running on `http://localhost:5000`
- Frontend should be on `http://localhost:3000`
- Check `.env` file in backend

---

## Notes for Team

1. **Code is Production-Ready**: All components are fully functional
2. **No Secrets in Code**: Sensitive configs in `.env`
3. **Scalable Structure**: Easy to add features
4. **API-First Design**: Frontend/backend are completely decoupled
5. **Mobile-Responsive**: All pages work on phones, tablets, desktops

---

## Checklist Before Deployment

- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Both servers running (backend on 5000, frontend on 3000)
- [ ] Assessment logic tests pass
- [ ] All 4 main pages working (Home, Info, Tracker, Results)
- [ ] No console errors in browser
- [ ] Tested with critical symptoms (chest indrawing, lethargy)
- [ ] Disclaimers visible on all pages
- [ ] Home remedies display correctly
- [ ] Tracker saves and retrieves entries

---

##  Support

For issues or questions:
1. Check the README.md in root folder
2. Review test_mvp.py for example cases
3. Check console/terminal for error messages
4. Verify all dependencies are installed

---

*Pneumonia shouldn't be a barrier to wellness - Pneumtofy makes care accessible.*

---

*Last Updated: April 13, 2026*
