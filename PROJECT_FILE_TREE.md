# 🎯 Pneumtofy - Fast MVP Complete Project Tree

```
Pneumtofy/
├─ DOCUMENTATION
│  ├─ README.md                          # START HERE - Project Overview
│  ├─ QUICK_START.md                     # Fast Reference 
│  ├─ DEPLOYMENT_GUIDE.md                # Detailed Setup & Customization
│  ├─ ARCHITECTURE.md                    # System Design & Data Flows
│  └─ PROJECT_COMPLETION_REPORT.md       # What's Built 
│
├─ GETTING STARTED
│  ├─ setup.bat                          # Windows Setup (1 click)
│  └─ test_mvp.py                        # Test Suite (5 tests, all pass)
│
├─ FRONTEND (React 18)
│  └─ frontend/
│     ├─ package.json                    # Dependencies: React, Axios
│     │
│     ├─ public/
│     │  └─ index.html                   # HTML entry point
│     │
│     └─ src/
│        ├─ index.jsx                    # React root (8 lines)
│        ├─ App.jsx                      # Main app (39 lines)
│        ├─ App.css                      # Root styles
│        │
│        └─ components/
│           │
│           ├─ Navigation
│           │  ├─ Navigation.jsx         # Header & navigation 
│           │  └─ Navigation.css         # Nav styling
│           │
│           ├─ SymptomForm (MAIN PAGE)
│           │  ├─ SymptomForm.jsx        # Symptom input form 
│           │  │  └─ Features:
│           │  │     • Age input (months)
│           │  │     • Cough duration
│           │  │     • All respiratory symptoms
│           │  │     • Fever temperature
│           │  │     • General symptoms
│           │  │     • Form validation
│           │  │     • API integration
│           │  │
│           │  └─ SymptomForm.css        # Professional form styling
│           │
│           ├─ Results (ASSESSMENT PAGE)
│           │  ├─ Results.jsx            # Assessment results 
│           │  │  └─ Features:
│           │  │     • Risk level badge (color-coded)
│           │  │     • Assessment text
│           │  │     • Recommendations
│           │  │     • Guidance checklist
│           │  │     • Home remedies cards
│           │  │     • Medical warnings
│           │  │     • Save to tracker
│           │  │
│           │  └─ Results.css            # Results styling
│           │
│           ├─ Info (EDUCATION PAGE)
│           │  ├─ Info.jsx               # Information hub 
│           │  │  └─ Features:
│           │  │     • About pneumonia
│           │  │     • Symptoms list
│           │  │     • Risk factors
│           │  │     • Prevention tips
│           │  │     • When to seek care
│           │  │     • WHO references
│           │  │
│           │  └─ Info.css               # Info styling
│           │
│           └─ Tracker (HISTORY PAGE)
│              ├─ Tracker.jsx            # History tracker
│              │  └─ Features:
│              │     • Display all assessments
│              │     • Filter by risk level
│              │     • Show symptoms for each
│              │     • Timestamps
│              │     • Delete entries
│              │     • Empty state
│              │
│              └─ Tracker.css            # Tracker styling
│
├─ BACKEND (Python Flask)
│  └─ backend/
│     ├─ app.py                          # Flask API server 
│     │  └─ Routes:
│     │     • POST   /api/assess          → Assessment logic
│     │     • GET    /api/info            → Information content
│     │     • POST   /api/tracker         → Save assessment
│     │     • GET    /api/tracker         → Get all assessments
│     │     • DELETE /api/tracker/<id>    → Delete entry
│     │     • GET    /health              → Health check
│     │
│     ├─ decision_logic.py                # IMCI Assessment 
│     │  └─ Classes & Functions:
│     │     • PneumoniaAssessment class
│     │     • assess_symptoms()           → Main logic
│     │     • get_home_remedies_for_observation()
│     │     • get_home_remedies_for_mild()
│     │
│     ├─ models.py                        # Data models (96 lines)
│     │  └─ Classes:
│     │     • TrackerEntry               → Assessment records
│     │     • InfoContent                → Medical information
│     │
│     ├─ requirements.txt                 # Python dependencies
│     │  └─ • Flask==3.0.0
│     │     • Flask-CORS==4.0.0
│     │     • psycopg2-binary==2.9.9
│     │     • python-dotenv==1.0.0
│     │
│     ├─ .env                             # Configuration
│     │  └─ • FLASK_ENV=development
│     │     • API_HOST=localhost
│     │     • FLASK_DEBUG=True
│     │
│     └─ data/                            # Data storage (auto-created)
│        └─ tracker.json                  # Saved assessments (JSON)
│
├─ DATABASE
│  └─ database/
│     └─ schema.sql                       # PostgreSQL schema (73 lines)
│        └─ Tables:
│           • tracker_entries             → Assessment history
│           • information_content         → Medical information
│           • Indexes for performance
│           • Ready to use - just import!
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

