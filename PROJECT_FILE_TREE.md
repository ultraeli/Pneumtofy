# Pneumtofy - Complete Project File Tree

```
Pneumtofy/
├─ DOCUMENTATION (All Up-to-Date)
│  ├─ README.md                          # Project overview with all features
│  ├─ QUICK_START.md                     # Complete 350+ line setup guide
│  ├─ AUTHENTICATION_COMPLETE.md         # Full auth + timezone implementation
│  ├─ AUTH_SETUP.md                      # Auth API & endpoints documentation
│  ├─ AUTH_QUICK_START.md                # Fast auth testing guide
│  ├─ ARCHITECTURE.md                    # System design, data flows, auth flow
│  ├─ DEPLOYMENT_GUIDE.md                # Project structure & deployment
│  ├─ VERIFICATION_CHECKLIST.md          # Complete feature checklist
│  ├─ TROUBLESHOOTING.md                 # Comprehensive troubleshooting guide
│  └─ PROJECT_FILE_TREE.md               # This file
│
├─ SETUP & TESTING
│  ├─ setup.bat                          # Windows setup script
│  ├─ setup.sh                           # macOS/Linux setup script
│  └─ [setup includes: backend dependencies, frontend dependencies, DB init]
│
├─ FRONTEND (React 18 with Auth & Router)
│  └─ frontend/
│     ├─ package.json                    # Dependencies: React, Router, Axios, cross-env
│     │
│     ├─ public/
│     │  └─ index.html                   # HTML entry point
│     │
│     └─ src/
│        ├─ index.jsx                    # React root
│        ├─ App.jsx                      # Root with Router & AuthProvider
│        ├─ App.css                      # Root styles
│        │
│        ├─ components/
│        │  ├─ Navigation.jsx            # Header with auth UI
│        │  ├─ Navigation.css            # Nav styling (new)
│        │  │
│        │  ├─ Login.jsx                 # Login page (NEW - 100+ lines)
│        │  │  └─ Features:
│        │  │     • Username/Email login
│        │  │     • Session creation
│        │  │     • Auto-save pending assessment
│        │  │     • Error handling
│        │  │     • Loading states
│        │  │
│        │  ├─ Register.jsx              # Registration page (NEW - 150+ lines)
│        │  │  └─ Features:
│        │  │     • User creation
│        │  │     • Email validation
│        │  │     • Password hashing (backend)
│        │  │     • Optional guardian info
│        │  │     • Auto-login after registration
│        │  │     • Auto-save pending assessment
│        │  │
│        │  ├─ ProtectedRoute.jsx        # Route wrapper (NEW)
│        │  │  └─ Features:
│        │  │     • Auth check before render
│        │  │     • Redirect to login if not auth
│        │  │     • Loading state
│        │  │
│        │  ├─ Auth.css                  # Auth styling (NEW - 200+ lines)
│        │  │  └─ Styles: Form, buttons, gradient, transitions
│        │  │
│        │  ├─ SymptomForm.jsx           # Assessment form
│        │  ├─ SymptomForm.css           # Form styling
│        │  │
│        │  ├─ Results.jsx               # Assessment results (UPDATED)
│        │  │  └─ Updates:
│        │  │     • Pending assessment storage (localStorage)
│        │  │     • Redirect to login if not authenticated
│        │  │     • Timezone display
│        │  │
│        │  ├─ Results.css               # Results styling
│        │  │
│        │  ├─ Tracker.jsx               # Assessment history (PROTECTED - UPDATED)
│        │  │  └─ Updates:
│        │  │     • Protected route (redirects if not logged in)
│        │  │     • Timezone-aware timestamps
│        │  │     • Filter by risk level
│        │  │     • Delete with authentication
│        │  │     • Timezone info box display
│        │  │
│        │  ├─ Tracker.css               # Tracker styling
│        │  │
│        │  ├─ Info.jsx                  # Education page
│        │  └─ Info.css                  # Info styling
│        │
│        ├─ contexts/
│        │  └─ AuthContext.jsx           # Global auth state (NEW - 80+ lines)
│        │     └─ Features:
│        │        • user, isAuthenticated, loading state
│        │        • login(), logout(), updateUser() methods
│        │        • useAuth() hook for components
│        │        • localStorage persistence
│        │        • Auto-auth check on app load
│        │
│        ├─ utils/
│        │  └─ dateFormatter.js          # Timezone utilities (NEW - 50+ lines)
│        │     └─ Functions:
│        │        • formatDate(timestamp) → local date string
│        │        • formatTime(timestamp) → local time string
│        │        • getUserTimezone() → timezone name
│        │        • parseUTCTimestamp() → Date object
│        │        • Uses Intl.DateTimeFormat API
│        │
│        └─ styles/
│           ├─ [component].css           # Component-specific styles
│           └─ [global styles]
│
├─ BACKEND (Python Flask with Auth & ORM)
│  └─ backend/
│     ├─ app.py                          # Flask server (UPDATED - 350+ lines)
│     │  └─ Routes:
│     │     AUTHENTICATION:
│     │     • POST   /api/auth/register      → Register new user
│     │     • POST   /api/auth/login         → User login (username or email)
│     │     • POST   /api/auth/logout        → User logout (protected)
│     │     • GET    /api/auth/me            → Get current user (protected)
│     │     • PUT    /api/auth/update        → Update profile (protected)
│     │
│     │     ASSESSMENT:
│     │     • POST   /api/assess             → Assessment scoring
│     │     • GET    /api/info               → Information content
│     │
│     │     TRACKER (Protected):
│     │     • POST   /api/tracker            → Save assessment to user
│     │     • GET    /api/tracker            → Get user's assessments (protected)
│     │     • DELETE /api/tracker/<id>       → Delete user's assessment (protected)
│     │
│     │     HEALTH:
│     │     • GET    /health                 → Health check
│     │
│     ├─ database.py                     # SQLAlchemy setup (NEW)
│     │  └─ Features:
│     │     • db = SQLAlchemy()
│     │     • init_db(app) creates tables
│     │     • Auto-creates pneumtofy.db
│     │
│     ├─ models_auth.py                  # Auth models (NEW - 150+ lines)
│     │  └─ Classes:
│     │     • User model
│     │     │  ├─ id, username, email (unique)
│     │     │  ├─ password_hash (bcrypt)
│     │     │  ├─ guardian_name, guardian_phone
│     │     │  ├─ created_at, updated_at, last_login
│     │     │  └─ relationship: tracked_assessments (one-to-many)
│     │     │
│        │     • TrackedAssessment model
│     │     │  ├─ user_id (foreign key)
│     │     │  ├─ All symptom fields
│     │     │  ├─ assessment, recommendation, guidance
│     │     │  ├─ home_remedies (JSON)
│     │     │  ├─ timestamp (UTC with Z suffix)
│     │     │  └─ to_dict() → JSON with Z-suffixed timestamps
│     │
│     ├─ models.py                       # Assessment content models
│     │  └─ Classes: Assessment logic, info content
│     │
│     ├─ decision_logic.py               # IMCI assessment algorithm
│     │  └─ PneumoniaAssessment class
│     │
│     ├─ requirements.txt                # Dependencies (UPDATED)
│     │  └─ • Flask>=2.3.0
│     │     • Werkzeug>=2.3.0
│     │     • Flask-SQLAlchemy>=3.0.0
│     │     • Flask-Login>=0.6.0
│     │     • PyJWT>=2.8.0
│     │     • Flask-CORS>=4.0.0
│     │
│     ├─ .env                            # Configuration
│     │  └─ • SECRET_KEY (for sessions)
│     │     • DATABASE_URL (SQLite by default, PostgreSQL for prod)
│     │
│     ├─ pneumtofy.db                    # SQLite database (AUTO-CREATED)
│     │  └─ Tables:
│     │     • user (usernames, emails, hashed passwords)
│     │     • tracked_assessment (assessments linked to users)
│     │
│     └─ data/                           # Assessment content storage
│        └─ [assessment info files]
│
├─ DATABASE (PostgreSQL)
│  └─ database/
│     └─ schema.sql                      # PostgreSQL schema
│        └─ For production migration
│           (set DATABASE_URL env var)
│
└─ ROOT
   └─ Access Frontend: http://localhost:3000
      Access Backend:  http://localhost:5000
      Database:        sqlite/pneumtofy.db (auto-created)
```
│     │
│
│     └─ data/                            # Assessment content
│        └─ [assessment info files]
│
├─ DATABASE
│  ├─ SQLite (Development - Auto-Created)
│  │  └─ pneumtofy.db
│  │     └─ Tables:
│  │        • user (for auth system)
│  │        • tracked_assessment (linked to users)
│  │
│  └─ PostgreSQL (Production)
│     └─ database/schema.sql             # Schema for PostgreSQL
│        └─ Set DATABASE_URL env var to migrate
│
└─ PROJECT ROOT
   ├─ Pneumtofy/
   │  ├─ frontend/ (React App)
   │  ├─ backend/  (Flask API)
   │  └─ database/ (PostgreSQL)
   │
   └─ Access App at: http://localhost:3000
      Access API at: http://localhost:5000
```

---

##  Guide

### Modification

| Need to Change | File(s) | Line # |
|---|---|---|
| Logo/Company name | `Navigation.jsx` | 15 |
| Form color scheme | `App.css` | 5 |
| Add symptom field | `SymptomForm.jsx` | 25-45 |
| Change assessment logic | `decision_logic.py` | 30-150 |
| Add home remedy | `decision_logic.py` | 200-220 |
| Update info content | `models.py` | 50-120 |
| Add API endpoint | `app.py` | 50-120 |
| Change database | `app.py` | Top imports |

---

## Testing & Verification

**Test File**: `test_mvp.py`

```bash
# Run tests
python test_mvp.py
```

**Expected Output**:
```
✓ TEST 1: Mild Case - PASS
✓ TEST 2: Moderate Case - PASS
✓ TEST 3: Critical Case - PASS
✓ TEST 4: Lethargy Case - PASS
✓ TEST 5: Unable to Drink Case - PASS

All core tests passed
```

---

## Startup Sequence

### Step 1: Setup (First Time Only)
```bash
cd Pneumtofy
setup.bat          # Windows
# OR
bash setup.sh      # macOS/Linux

# This installs:
# - Python dependencies (Flask, CORS)
# - React dependencies (React 18, Axios)
```

### Step 2: Start Backend (Terminal 1)
```bash
cd backend
python app.py

# Should see:
# * Running on http://localhost:5000
# * Press CTRL+C to quit
```

### Step 3: Start Frontend (Terminal 2)
```bash
cd frontend
npm start

# Should see:
# On Your Network: http://localhost:3000
# (Browser opens automatically)
```

### Step 4: Access Application
```
Open browser: http://localhost:3000
```

---

## User Flow

```
User Opens App (http://localhost:3000)
│
├─ Sees Navigation Bar with 3 links
│  ├─ Home (default)
│  ├─ Info
│  └─ Tracker
│
├─ HOME PAGE
│  ├─ User fills Symptom Form
│  │  • Age
│  │  • Cough duration
│  │  • Various symptoms...
│  │
│  ├─ Click "Assess Symptoms"
│  │  • Form sends to backend: POST /api/assess
│  │  • Backend runs IMCI logic
│  │  • Returns: Risk level + recommendations
│  │
│  └─ Navigate to RESULTS PAGE
│     ├─ See risk badge (🟢 🟡 or 🔴)
│     ├─ Read recommendation
│     ├─ See home remedies
│     ├─ Click "Save to Tracker"
│     │  • Saved to: /api/tracker
│     │  • Stored in: backend/data/tracker.json
│     │
│     └─ Options:
│        ├─ "Back to Home" → New assessment
│        ├─ "Info" → Learn about pneumonia
│        └─ "Tracker" → View history
│
├─ INFO PAGE
│  ├─ Educational content
│  ├─ Pneumonia information
│  ├─ Prevention tips
│  └─ Links to WHO resources
│
├─ TRACKER PAGE
│  ├─ List of all past assessments
│  ├─ Filter by risk level
│  ├─ Delete old entries
│  └─ Track progression over time
│
└─ DISCLAIMERS
   ├─ Every page has medical disclaimer
   ├─ "Not a substitute for professional advice"
   ├─ "Seek medical care immediately" when needed
   └─ "Always consult healthcare provider"
```

---

## Data Flow Architecture

```
USER INPUT (Browser)
    ↓
SymptomForm Component
    ↓
Collect & Validate
    ↓
HTTP POST Request (Axios)
    ↓
Flask Backend (app.py)
    ↓
Parse Request
    ↓
Call PneumoniaAssessment.assess_symptoms()
    ↓
IMCI Decision Logic (decision_logic.py)
    ├─ Check Critical Signs
    ├─ Count Indicators
    ├─ Age Thresholds
    └─ Generate Response
    ↓
Return JSON Response
    ↓
Results Component (React)
    ↓
Display Results to User
    ↓
User Can:
├─ Save to Tracker (POST /api/tracker)
├─ View Info (GET /api/info)
├─ Go Back (New assessment)
└─ Check Tracker (GET /api/tracker)
```

