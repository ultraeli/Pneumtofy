# Pneumtofy - Pneumonia Assessment and Tracking Platform

A web application for pneumonia symptom assessment in children based on WHO IMCI guidelines, with user authentication and assessment tracking.

Group 10 - Ezrha Fines, John Christian Jamesula, Elijah Theodore Uy

There is a video showcasing basic functionality of the website with the backend, the frontend UI is currently a WIP. (Pneumtofy Functionality Demo.mp4)


## Project Structure

```
Pneumtofy/
├── frontend/                           # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx               # Login form with session auth
│   │   │   ├── Register.jsx            # New account creation
│   │   │   ├── ProtectedRoute.jsx      # Route protection wrapper
│   │   │   ├── Navigation.jsx          # Header with auth menu
│   │   │   ├── SymptomForm.jsx         # Assessment form
│   │   │   ├── Results.jsx             # Assessment results and save to tracker
│   │   │   ├── Info.jsx                # Medical education content
│   │   │   └── Tracker.jsx             # Personal assessment history
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx         # Global auth state management
│   │   ├── utils/
│   │   │   └── dateFormatter.js        # Timezone-aware date formatting
│   │   ├── styles/
│   │   │   ├── Auth.css                # Authentication pages
│   │   │   ├── Navigation.css          # Navigation styling
│   │   │   ├── SymptomForm.css         # Form styling
│   │   │   ├── Results.css             # Results page styling
│   │   │   ├── Tracker.css             # Tracker page styling
│   │   │   └── other component styles
│   │   ├── App.jsx                     # Main routing and state
│   │   └── index.jsx                   # React entry point
│   └── package.json
├── backend/
│   ├── app.py                          # Flask API with auth routes
│   ├── database.py                     # SQLAlchemy initialization
│   ├── models_auth.py                  # User and Assessment models
│   ├── models.py                       # Information content models
│   ├── decision_logic.py               # IMCI-based assessment logic
│   ├── requirements.txt                # Python dependencies
│   └── pneumtofy.db                    # SQLite database (auto-created)
├── README.md                           # This file
├── QUICK_START.md                      # Setup and running instructions
├── AUTHENTICATION_COMPLETE.md          # Auth system documentation
├── ARCHITECTURE.md                     # System architecture overview
└── other documentation files
```

## Quick Start  

- See [QUICK_START.md](Quick Start) for a more detailed setup.

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

## Core Features

### 1. User Authentication
- Secure user registration with email and username
- Login with username or email
- Persistent session-based authentication
- Password hashing with Werkzeug
- Profile management and account updates
- Logout with session cleanup
- Password change functionality
- Guardian information storage

### 2. Symptom Assessment Form
- Input child's age (months) and symptoms
- Comprehensive symptom checklist:
  - Respiratory symptoms (fast breathing, difficulty breathing, stridor)
  - Chest indicators (chest wall indrawing)
  - Fever and temperature
  - General symptoms (lethargy, unable to drink, vomiting, diarrhea)
  - History (previous pneumonia episodes)
- Real-time form validation
- Works for logged-in and guest users

### 3. IMCI-Based Assessment Results
- Risk classification: Critical, Moderate, Mild
- Risk level color-coded display
- WHO guideline-based recommendations:
  - Seek immediate medical care (critical signs)
  - Observe and manage at home (pneumonia indicators)
  - Safe home management (mild symptoms)
- Detailed guidance steps
- Home remedies with dosage information
- Safety warnings and disclaimers
- Displays assessment timestamp with user's timezone

### 4. Pneumonia Information Pages
- What is pneumonia
- Symptoms in children
- Risk factors
- When to seek medical care
- Prevention strategies
- Information sources and references

### 5. Personal Assessment Tracker (Requires Login)
- Save assessment history to personal account
- View all past assessments with dates and times
- Filter by risk level (All, Observe & Manage, Seek Medical Care)
- Displays assessments in user's local timezone
- Delete past assessments
- Assessment history persists across sessions
- Each assessment shows:
  - Date and time in local timezone
  - Risk level and recommendation
  - Symptoms that were checked
  - Original assessment recommendation

### 6. Seamless Unauthenticated to Authenticated Workflow
- Guests can perform assessments and view results
- Clicking Save to Tracker prompts unauthenticated users to login/register
- After login, previously entered assessment data is automatically saved
- Redirects to Tracker page after auto-save
- No data loss during authentication transition

## API Endpoints

### Authentication 

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

### Authentication System 
-  User registration and login with secure sessions
-  Password hashing with bcrypt
-  SQLAlchemy ORM for database
-  Flask-Login for session management
-  React Context for state management
-  Protected routes for authenticated features
-  localStorage backup for session persistence

See [AUTH_SETUP.md](AUTH_SETUP.md) for full authentication documentation.
See [AUTH_QUICK_START.md](AUTH_QUICK_START.md) testing guide.

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
