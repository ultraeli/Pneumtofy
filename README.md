# Pneumtofy - Fast MVP Setup Guide

## Project Structure

```
Pneumtofy/
├── frontend/                       # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx           # Login page 
│   │   │   ├── Register.jsx        # Registration page 
│   │   │   ├── ProtectedRoute.jsx  # Route protection 
│   │   │   ├── Navigation.jsx      # Navigation bar
│   │   │   ├── SymptomForm.jsx     # Main form page
│   │   │   ├── Results.jsx         # Results 
│   │   │   ├── Info.jsx            # Education page
│   │   │   └── Tracker.jsx         # Tracker page
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx     # Auth state management 
│   │   ├── styles/
│   │   │   ├── Auth.css            # Auth styling 
│   │   │   └── [other styles]
│   │   ├── App.jsx                 # Routing
│   │   └── index.jsx
│   └── package.json               
├── backend/                        # Python Flask API
│   ├── app.py                      # Updated with auth routes
│   ├── database.py                 # SQLAlchemy setup 
│   ├── models_auth.py              # User & Assessment models 
│   ├── models.py                   # Info models
│   ├── decision_logic.py           # IMCI-based assessment logic
│   ├── requirements.txt            # Updated with auth packages
│   ├── pneumtofy.db                # SQLite database (auto-created)
│   └── data/                       # Storage for tracker entries
├── database/
│   └── schema.sql                  # PostgreSQL schema
├── docs/
│   ├── AUTH_SETUP.md               # Authentication documentation 
│   ├── AUTH_QUICK_START.md         # Quick testing guide 
│   ├── AUTHENTICATION_COMPLETE.md  # Implementation summary 
│   └── VERIFICATION_CHECKLIST.md   # Setup verification 
└── README.md                       
```

## Quick Start

### 1. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React app will start on `http://localhost:3000`

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The Flask API will start on `http://localhost:5000`

## Features - Fast MVP

### 1. User Authentication 
- Secure user registration with email
- Login with persistent sessions
- Profile management
- Password hashing with bcrypt
- Protected assessment tracking

### 2. Symptom Assessment Form
- Input child's age and symptoms
- IMCI-based assessment
- Immediate risk classification
- Automatic saving to user account (when logged in)

### 3. Results Display
- Risk level (Mild, Moderate, Critical)
- Recommendations (Observe vs Seek Care)
- Home remedies suggestions
- Safety warnings
- Save to personal tracker button

### 4. Information Pages
- Pneumonia information
- Symptoms and risk factors
- Prevention guidelines
- WHO-based resources

### 5. Symptom Tracker (Protected)
- Save assessment history to your account
- View personal past entries
- Filter and sort entries
- Track child health progression
- Delete entries
- Data linked to user account

## API Endpoints

### Authentication (NEW)

#### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
    "username": "caregivername",
    "email": "caregiver@example.com",
    "password": "securepassword",
    "guardianname": "Jane Doe",
    "phone": "+1234567890"
}
```

**Response:** User object with id, username, email, created_at

#### POST /api/auth/login
Login with existing credentials.

**Request:**
```json
{
    "username": "caregivername",
    "password": "securepassword",
    "remember": true
}
```

**Response:** User object with session established

#### GET /api/auth/me
Get current logged-in user info (protected).

**Response:** User object with all profile info

#### PUT /api/auth/update
Update user profile (protected).

**Request:**
```json
{
    "guardianname": "Updated Name",
    "phone": "+1234567890",
    "new_password": "newpassword"
}
```

#### POST /api/auth/logout
Logout current user (protected).

### Assessment

#### POST /api/assess
Assess symptoms and get recommendation.

**Request:**
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

**Response:**
```json
{
    "assessment": "OBSERVE & MANAGE AT HOME",
    "risk_level": "MODERATE",
    "recommendation": "...",
    "guidance": [...],
    "home_remedies": [...],
    "warning": null
}
```

### Information & Tracking

#### GET /api/info
Get pneumonia information content.

#### GET /api/tracker
Get all saved tracker entries for logged-in user (protected).

#### POST /api/tracker
Save new assessment to tracker (protected).

**Request:**
```json
{
    "age_months": 24,
    "cough_duration": 7,
    "fast_breathing": true,
    "fever": true,
    "fever_temperature": 38.5,
    "assessment": "OBSERVE & MANAGE AT HOME",
    "recommendation": "...",
    "guidance": [...],
    "home_remedies": [...]
}
```

#### DELETE /api/tracker/<id>
Delete a tracker entry (protected - user's own entries only).

## IMCI-Based Assessment Logic

### Critical Signs (Immediate Referral)
- Chest wall indrawing
- Stridor in calm child
- Lethargy
- Unable to drink

### Pneumonia Indicators (Observation)
- Fast breathing (age-based thresholds)
- Persistent cough (≥7 days)
- Difficulty breathing
- Fever

### Home Management Recommendations
- Honey for cough
- Warm fluids
- Steam inhalation
- Proper rest
- Close monitoring

## Notes for Development Team

### Authentication System (NEW)
-  User registration and login with secure sessions
-  Password hashing with bcrypt
-  SQLAlchemy ORM for database
-  Flask-Login for session management
-  React Context for state management
-  Protected routes for authenticated features
-  localStorage backup for session persistence

See [AUTH_SETUP.md](AUTH_SETUP.md) for full authentication documentation.
See [AUTH_QUICK_START.md](AUTH_QUICK_START.md) for 5-minute testing guide.

### Database
- **Development**: Uses SQLite (pneumtofy.db) - zero configuration
- **Production**: Can upgrade to PostgreSQL using database/schema.sql
- All user assessments are linked to their user account
- Automatic timestamps for audit trail

### Data Storage
- User credentials securely stored with bcrypt hashing
- Assessment history linked to user accounts
- All data stored in SQLite during MVP
- Ready for PostgreSQL migration

### Frontend Stack
- React 18 with React Router v6 for navigation
- Axios for API calls with credentials support
- Context API for state management
- CSS3 for responsive design
- Mobile-first approach

### Backend Stack
- Flask 3.0.0 with Flask-CORS
- SQLAlchemy 3.0.5 for ORM
- Flask-Login 0.6.2 for sessions
- Werkzeug 3.0.0 for password hashing
- IMCI-based assessment logic

### Getting Started with Auth
1. Read [AUTH_QUICK_START.md](AUTH_QUICK_START.md)
2. Start backend: `python backend/app.py`
3. Start frontend: `npm start` from frontend folder
4. Test registration/login at http://localhost:3000

### Production Checklist
- [ ] Set strong `SECRET_KEY` environment variable
- [ ] Enable HTTPS and set `SESSION_COOKIE_SECURE = True`
- [ ] Configure ALLOWED_ORIGINS for CORS
- [ ] Review security settings in [AUTH_SETUP.md](AUTH_SETUP.md)
- [ ] Set up email verification 


3. **Backend Dependencies**: Flask, Flask-CORS, psycopg2 (for future DB integration)

4. **IMCI Guidelines**: Assessment follows WHO Integrated Management of Childhood Illness standards

5. **Medical Disclaimers**: All pages include disclaimers that this is NOT a substitute for professional medical advice

6. **Home Remedies**: Only safe, evidence-based remedies are recommended with proper warnings

## Testing

### Test the Assessment Logic

**Mild Case (No action needed):**
- Age: 24 months, Cough: 2 days, No other symptoms
- Expected: "OBSERVE & MANAGE AT HOME - MILD"

**Moderate Case (Observation):**
- Age: 24 months, Cough: 7 days, Fast breathing: Yes, Fever: Yes (38.5°C)
- Expected: "OBSERVE & MANAGE AT HOME - MODERATE"

**Critical Case (Immediate care):**
- Age: 24 months, Chest indrawing: Yes
- Expected: "SEEK IMMEDIATE MEDICAL CARE"


## Disclaimer

This application is NOT a substitute for professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment. The app is designed to help with symptom tracking and general awareness only.
