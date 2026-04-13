# Pneumtofy Architecture & Data Flow

## System Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                   USER BROWSER (Port 3000)                        │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              React Frontend Application                      │ │
│  │  ┌──────────────────────────────────────────────────────┐    │ │
│  │  │ AuthProvider (AuthContext.jsx)                       │    │ │
│  │  │ - user, isAuthenticated, loading state               │    │ │
│  │  │ - login(), logout(), updateUser()                    │    │ │
│  │  │ - localStorage persistence                           │    │ │
│  │  └──────────┬───────────────────────────────────────────┘    │ │
│  │             │                                                │ │
│  │  ┌──────────▼───────────────────────────────────────────┐    │ │
│  │  │ React Router v6                                      │    │ │
│  │  │ - /: Home & SymptomForm                              │    │ │
│  │  │ - /results: Assessment results                       │    │ │
│  │  │ - /login: Login page                                 │    │ │
│  │  │ - /register: Registration page                       │    │ │
│  │  │ - /tracker: Protected Tracker (ProtectedRoute wrap)  │    │ │
│  │  └──────────┬───────────────────────────────────────────┘    │ │
│  │             │                                                │ │
│  │  ┌──────────▼───────────────────────────────────────────┐    │ │
│  │  │ Components                                           │    │ │
│  │  │ - SymptomForm, Results, Tracker                      │    │ │
│  │  │ - Login, Register                                    │    │ │
│  │  │ - Navigation, ProtectedRoute                         │    │ │
│  │  └──────────┬───────────────────────────────────────────┘    │ │
│  │             │                                                │ │
│  │  ┌──────────▼───────────────────────────────────────────┐    │ │
│  │  │ Utils (dateFormatter.js)                             │    │ │
│  │  │ - formatDate(), formatTime()                         │    │ │
│  │  │ - getUserTimezone()                                  │    │ │
│  │  │ - parseUTCTimestamp()                                │    │ │
│  │  └──────────┬───────────────────────────────────────────┘    │ │
│  └─────────────┼─────────────────────────────────────────────┬──┘ │ 
│                │ localStorage [pendingAssessment]            │    │
│                │ HTTP Requests (Axios, credentials: true)    │    │
│                └────────────┬────────────────────────────────┘    │
└─────────────────────────────┼─────────────────────────────────────┘
                              │
                              │ HTTP/JSON
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                   Flask Backend (Port 5000)                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Authentication Endpoints                                   │  │
│  │ - POST /api/auth/register                                  │  │
│  │ - POST /api/auth/login                                     │  │
│  │ - POST /api/auth/logout                                    │  │
│  │ - GET  /api/auth/me (Protected)                            │  │
│  │ - PUT  /api/auth/update (Protected)                        │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Assessment & Tracker Endpoints                             │  │
│  │ - POST /api/assess                                         │  │
│  │ - GET  /api/tracker (Protected)                            │  │
│  │ - POST /api/tracker (Protected)                            │  │
│  │ - DELETE /api/tracker/<id> (Protected)                     │  │
│  │ - GET  /api/info (Public)                                  │  │
│  └─────┬──────────────────────────────────────────────────────┘  │
│        │                                                         │
│  ┌─────▼──────────────────────────────────────────────────────┐  │
│  │ Flask App (app.py)                                         │  │
│  │ - Session management with Flask-Login                      │  │
│  │ - CORS enabled for frontend                                │  │
│  │ - User authentication & authorization                      │  │
│  └─────┬──────────────────────────────────────────────────────┘  │
│        │                                                         │
│  ┌─────▼──────────────────────────────────────────────────────┐  │
│  │ Python Modules                                             │  │
│  │ - decision_logic.py (IMCI assessment engine)               │  │
│  │ - models_auth.py (User & TrackedAssessment ORM)            │  │
│  │ - database.py (SQLAlchemy initialization)                  │  │
│  └─────┬──────────────────────────────────────────────────────┘  │
│        │                                                         │
│  ┌─────▼──────────────────────────────────────────────────────┐  │
│  │ SQLAlchemy ORM                                             │  │
│  │ - Manages User model                                       │  │
│  │ - Manages TrackedAssessment model                          │  │
│  │ - Password hashing (Werkzeug bcrypt)                       │  │
│  │ - Foreign key relationships                                │  │
│  └─────┬──────────────────────────────────────────────────────┘  │
│        │                                                         │
│  ┌─────▼──────────────────────────────────────────────────────┐  │
│  │ SQLite Database (pneumtofy.db)                             │  │
│  │ - user table (id, username, email, password_hash, ...)     │  │
│  │ - tracked_assessment table (id, user_id, symptoms, ...)    │  │
│  │ - All timestamps stored in UTC (ISO format with Z)         │  │
│  └─────┬──────────────────────────────────────────────────────┘  │
└────────┼─────────────────────────────────────────────────────────┘
         │
         └─ File: pneumtofy.db (auto-created, auto-migrated SQLite)


TECH STACK:
Back: Flask>=2.3.0, Werkzeug>=2.3.0, Flask-SQLAlchemy>=3.0.0, Flask-Login>=0.6.0
Front: React 18, React Router DOM v6, Axios, cross-env 7.0.3
DB: SQLite (development) → PostgreSQL (production)
```

---

## Data Flow: Symptom Assessment

```
┌────────────────────────┐
│  User enters symptoms  │
│  in SymptomForm.jsx    │
└────────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ Validate form      │
    │ inputs on client   │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ POST /api/assess           │
    │ (Send symptom data)        │
    └────────┬───────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ Flask app.py receives request       │
    │ Extracts parameters                 │
    └────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ PneumoniaAssessment.assess_symptoms │
    │ (decision_logic.py)                 │
    │                                     │
    │ Logic Tree:                         │
    │  1. Check critical signs            │
    │  2. Count pneumonia indicators      │
    │  3. Age-based thresholds            │
    │  4. Return risk level               │
    └────────┬────────────────────────────┘
             │
             ├─ If Critical → Return "SEEK IMMEDIATE MEDICAL CARE"
             │               with severity warnings
             │
             ├─ If Indicators → Return "OBSERVE & MANAGE"
             │                  with home remedies
             │
             └─ Else → Return "MILD - Safe to observe"
             │
             ▼
    ┌─────────────────────────────────────┐
    │ Return JSON response to frontend    │
    │ {                                   │
    │   assessment: "...",                │
    │   risk_level: "...",                │
    │   recommendation: "...",            │
    │   home_remedies: [...],             │
    │   guidance: [...]                   │
    │ }                                   │
    └────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ Results.jsx displays results        │
    │ with color-coded risk level         │
    │ and actionable recommendations      │
    └────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ User can:                           │
    │ 1. Save to tracker                  │
    │ 2. Go back and reassess             │
    │ 3. View information                 │
    │ 4. Check tracker history            │
    └─────────────────────────────────────┘
```

---

## IMCI Assessment Decision Tree

```
                            ASSESS SYMPTOMS
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │ CHECK CRITICAL SIGNS    │
                    └────────┬────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   Chest          Stridor (calm)    Lethargy   Unable to drink
   Indrawing       (≥2 months)      (unusl.)   (vomiting)
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                      ┌──────▼──────┐
                      │ ANY FOUND?  │
                      └──┬──────┬───┘
                         │      │
                      YES│      │NO
                         │      └─────────────────────┐
                         │                            │
                         ▼                            ▼
                    ┌─────────────┐         ┌──────────────────┐
                    │ *CRITICAL*  │         │ CHECK FOR        │
                    │             │         │ PNEUMONIA        │
                    │ SEEK        │         │INDICATORS        │
                    │ IMMEDIATE   │         └────┬─────────────┘
                    │ MEDICAL     │              │
                    │ CARE        │              ▼
                    └─────────────┘      ┌───────────────────┐
                                         │ Fast Breathing?   │
                                         │ (age-based RPM)   │
                                         │                   │
                                         │ Persistent cough? │
                                         │ (≥7 days)         │
                                         │                   │
                                         │ Difficulty        │
                                         │ breathing?        │
                                         │                   │
                                         │ Fever present?    │
                                         └────┬──────────────┘
                                              │
                                         ┌────▼─────┐
                                         │ ANY?     │
                                         └┬──────┬──┘
                                          │      │
                                      YES │      │ NO
                                          │      │
                                    ┌─────▼─┐  ┌▼──────┐
                                    │MODERATE│  │ MILD  │
                                    │OBSERVE │  │OBSERVE│
                                    │ & HOME │  │ & HOME│
                                    │REMEDIES│  │       │
                                    └────────┘  └───────┘


                    ┌─ HOME REMEDIES (Safe Options) ─┐
                    │ • Honey (5ml for 1+ years)     │
                    │ • Warm fluids (frequent)       │
                    │ • Steam (15-20 min)            │
                    │ • Chest rubs (gentle)          │
                    │ • Proper rest                  │
                    │ • OTC fever reducers (* warn)  │
                    └────────────────────────────────┘


                        ┌─ MONITORING GUIDANCE ─┐
                        │ • Check breathing rate │
                        │ • Watch fever pattern  │
                        │ • Ensure hydration     │
                        │ • Track symptom changes│
                        │ • Seek help if worse   │
                        └────────────────────────┘
```

---

## Database Schema (Current: SQLite with SQLAlchemy ORM)

User Model (models_auth.py):
```python
class User(UserMixin, db.Model):
    id              INTEGER PRIMARY KEY
    username        VARCHAR UNIQUE NOT NULL
    email           VARCHAR UNIQUE NOT NULL
    password_hash   VARCHAR NOT NULL (bcrypt hashed)
    guardian_name   VARCHAR
    guardian_phone  VARCHAR
    created_at      TIMESTAMP (UTC, ISO format with Z)
    updated_at      TIMESTAMP (UTC, ISO format with Z)
    last_login      TIMESTAMP (UTC, ISO format with Z)
    assessments     One-to-Many relationship to TrackedAssessment
```

TrackedAssessment Model (models_auth.py):
```python
class TrackedAssessment(db.Model):
    id                  INTEGER PRIMARY KEY
    user_id             INTEGER FOREIGN KEY (references User.id)
    age_months          INTEGER
    cough_duration      INTEGER
    fast_breathing      BOOLEAN
    fever               BOOLEAN
    fever_temperature   DECIMAL
    difficulty_breathing BOOLEAN
    chest_indrawing     BOOLEAN (CRITICAL SIGN)
    stridor             BOOLEAN (CRITICAL SIGN)
    lethargy            BOOLEAN (CRITICAL SIGN)
    unable_to_drink     BOOLEAN (CRITICAL SIGN)
    vomiting            BOOLEAN
    diarrhea            BOOLEAN
    previous_episodes   INTEGER
    assessment          VARCHAR (MILD, MODERATE, CRITICAL)
    recommendation      TEXT
    guidance            JSON (parsed from string)
    home_remedies       JSON (parsed from string)
    timestamp           TIMESTAMP (UTC, ISO format with Z)
    created_at          TIMESTAMP (UTC, ISO format with Z)
```

Database File:
- Location: pneumtofy.db (in backend directory)
- Type: SQLite (development)
- Auto-created: Yes (on first app.py run)
- Auto-migrated: Yes (when models change)

Future Migration to PostgreSQL:
```bash
# 1. Install PostgreSQL driver
pip install psycopg2-binary

# 2. Set environment variable
export DATABASE_URL="postgresql://user:pass@localhost:5432/pneumtofy"

# 3. Restart Flask - auto-migrates to PostgreSQL while keeping same schema
```

---

## API Response Examples

### Assessment Response (Moderate Case)
```json
{
  "assessment": "OBSERVE & MANAGE AT HOME",
  "risk_level": "MODERATE",
  "recommendation": "Suspected pneumonia - Careful observation recommended. Monitor symptoms closely and seek medical care if they worsen.",
  "guidance": [
    "Monitor your child's breathing rate and general condition daily",
    "Ensure child stays hydrated",
    "Maintain appropriate nutrition",
    "Watch for worsening symptoms: increased breathing difficulty, persistent fever, refusal to eat/drink",
    "If symptoms worsen or new symptoms appear, seek medical attention immediately",
    "Already taking antibiotics? Continue as prescribed"
  ],
  "home_remedies": [
    {
      "name": "Honey",
      "description": "Natural throat soother for cough. Age-appropriate and safe when given carefully.",
      "dosage": "For children 1+ years: 5ml (1 tsp) as needed. Do NOT give to infants under 1 year."
    },
    {
      "name": "Warm Fluids",
      "description": "Help with comfort and hydration. Warm broth, water, or mild herbal tea.",
      "dosage": "Frequent small amounts throughout the day"
    }
    // ... more remedies
  ],
  "symptoms": {
    "age": 24,
    "cough_duration": 7,
    "indicators": [
      "Fast breathing (respiratory rate ≥ 30 per minute)",
      "Persistent cough (≥7 days)"
    ]
  }
}
```

### Critical Case Response
```json
{
  "assessment": "SEEK IMMEDIATE MEDICAL CARE",
  "risk_level": "CRITICAL",
  "recommendation": "URGENT: Your child shows signs of severe pneumonia (Chest wall indrawing, Stridor). Seek medical attention immediately. This requires professional evaluation.",
  "guidance": [
    "Take the child to the nearest hospital or health facility immediately",
    "Do not delay - critical signs require urgent medical care",
    "Bring this assessment with you"
  ],
  "home_remedies": [],
  "warning": "CRITICAL: This assessment indicates potentially life-threatening conditions. Professional medical care is essential.",
  "symptoms": {
    "age": 24,
    "cough_duration": 7,
    "critical_signs": "Chest wall indrawing, Stridor"
  }
}
```

---

## Timezone Data Flow

```
┌───────────────────────────────────────────────────────────────┐
│                    BACKEND (UTC Storage)                      │
│                                                               │
│  models_auth.py returns timestamps with Z suffix (UTC marker) │
│  Example: "2026-03-31T14:45:30Z"                              │
│                                                               │
│  POST /api/tracker returns assessment with timestamp in UTC   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ {                                                       │  │
│  │   "timestamp": "2026-03-31T14:45:30Z",  // UTC+0 time   │  │
│  │   "assessment": "MODERATE",                             │  │
│  │   ...                                                   │  │
│  │ }                                                       │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────┬────────────────────────────────────────────┘
                   │ HTTP Response with timestamp in UTC
                   │
┌──────────────────▼────────────────────────────────────────────┐
│              FRONTEND (Browser Timezone Conversion)           │
│                                                               │
│  Tracker.jsx receives UTC timestamp                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ import { formatDate, formatTime, getUserTimezone }      │  │
│  │        from '../utils/dateFormatter';                   │  │
│  │                                                         │  │
│  │ // UTC string: "2026-03-31T14:45:30Z"                   │  │
│  │ const date = formatDate(timestamp);                     │  │
│  │ // Returns: "Mar 31, 2026" (local timezone)             │  │
│  │                                                         │  │
│  │ const time = formatTime(timestamp);                     │  │
│  │ // Returns: "2:45:30 PM" (EST if browser in US/Eastern) │  │
│  │                                                         │  │
│  │ const tz = getUserTimezone();                           │  │
│  │ // Returns: "America/New_York"                          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  dateFormatter.js uses Intl.DateTimeFormat API:               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ export function formatDate(timestamp) {                 │  │
│  │   const date = parseUTCTimestamp(timestamp);            │  │
│  │   const timeZone = Intl.DateTimeFormat()                │  │
│  │     .resolvedOptions().timeZone;                        │  │
│  │   const formatter = new Intl.DateTimeFormat(            │  │
│  │     'en-US',                                            │  │
│  │     {                                                   │  │
│  │       year: 'numeric',                                  │  │
│  │       month: 'short',                                   │  │
│  │       day: 'numeric',                                   │  │
│  │       timeZone: timeZone  // Auto-detect browser TZ     │  │
│  │     }                                                   │  │
│  │   );                                                    │  │
│  │   return formatter.format(date);                        │  │
│  │ }                                                       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  USER SEES IN BROWSER:                                        │
│  - Timestamp converted to their local timezone                │
│  - Works automatically with system timezone settings          │
│  - No manual configuration needed                             │
│  - Timezone info box shows user's timezone                    │
└───────────────────────────────────────────────────────────────┘
```

---

## Pending Assessment Auto-Save Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                    GUEST USER FLOW                               │
│                                                                  │
│  1. User visits http://localhost:3000                            │
│     └─→ isAuthenticated = false (from AuthContext)               │
│                                                                  │
│  2. User completes symptom assessment                            │
│     └─→ SymptomForm → POST /api/assess → Results page            │
│                                                                  │
│  3. Results.jsx displays recommendations                         │
│     └─→ "Save to Tracker" button shown (but guarded by auth)     │
│                                                                  │
│  4. User clicks "Save to Tracker"                                │
│     └─→ Check: if (!isAuthenticated)                             │
│         └─→ YES: Store assessment in localStorage                │
│             localStorage.setItem('pendingAssessment',            │
│               JSON.stringify({ ...result }))                     │
│                                                                  │
│  5. User redirected to login page                                │
│     └─→ navigate('/login')                                       │
│                                                                  │
└──────────────┬───────────────────────────────────────────────────┘
               │
┌──────────────▼────────────────────────────────────────────────────┐
│                 AUTHENTICATION FLOW                               │
│                                                                   │
│  6. User enters credentials (username/email + password)           │
│     └─→ POST /api/auth/login                                      │
│                                                                   │
│  7. Backend validates and creates session                         │
│     └─→ Returns user data if successful                           │
│                                                                   │
│  8. Frontend receives success response                            │
│     └─→ AuthContext.login(userData) called                        │
│     └─→ isAuthenticated = true                                    │
│                                                                   │
│  9. Login.jsx checks for pending assessment:                      │
│     └─→ const pending = localStorage.getItem('pendingAssessment') │
│     └─→ if (pending) {                                            │
│           savePendingAssessment(pending) // POST /api/tracker     │
│         }                                                         │
│                                                                   │
│  10. Backend POST /api/tracker saves assessment to user           │ 
│      └─→ Links to user_id (from session)                          │
│      └─→ Saves all symptom data to database                       │
│      └─→ Returns success response                                 │
│                                                                   │
│  11. Frontend clears localStorage                                 │
│      └─→ localStorage.removeItem('pendingAssessment')             │
│                                                                   │
│  12. Frontend redirects to Tracker page                           │
│      └─→ navigate('/tracker')                                     │
│                                                                   │
│  13. Tracker page shows newly saved assessment                    │
│      └─→ GET /api/tracker returns all user's assessments          │
│      └─→ Assessment appears in list with correct timestamps       │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

KEY BENEFITS:
- No data loss during authentication
- Seamless user experience (no re-assessment needed)
- Encourages user registration
- Assessment immediately available in Tracker after login
- Works with both login and registration flows
```

---

## File Dependencies

```
Frontend Dependencies:
├── Navigation.jsx, .css
├── App.jsx, .css
│   └─ Uses Navigation.jsx
├── SymptomForm.jsx, .css
│   └─ Calls POST /api/assess
├── Results.jsx, .css
│   ├─ Receives data from SymptomForm
│   └─ Calls POST /api/tracker
├── Info.jsx, .css
│   └─ Calls GET /api/info
├── Tracker.jsx, .css
│   ├─ Calls GET /api/tracker
│   └─ Calls DELETE /api/tracker/<id>
├── index.jsx
│   └─ Mounts App.jsx to DOM
└── public/index.html
    └─ Contains <div id="root">

Backend Dependencies:
├── app.py (Flask server)
│   ├─ Imports decision_logic.PneumoniaAssessment
│   ├─ Imports models.InfoContent
│   ├─ Imports models.TrackerEntry
│   └─ Defines all API routes
├── decision_logic.py (IMCI Logic)
│   ├─ assess_symptoms() function
│   └─ Home remedy functions
├── models.py (Data Models)
│   ├─ TrackerEntry class
│   └─ InfoContent class
└── .env (Configuration)
    └─ Flask settings

Database:
└── schema.sql (For PostgreSQL in the future)
    ├─ CREATE TABLE tracker_entries
    └─ CREATE TABLE information_content
```

---


