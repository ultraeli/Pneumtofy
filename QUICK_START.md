# Pneumtofy - Quick Start Guide

## What This Application Does

Pneumtofy is a web application that helps caregivers assess pneumonia risk in children based on WHO IMCI guidelines. Users can:
- Enter child symptoms anonymously or with an account
- Get risk assessment and recommendations
- Create an account and save assessment history
- Track assessments with proper timezone display

## System Requirements

- Python 3.8 or higher
- Node.js 14 or higher (with npm)
- 100 MB free disk space
- Any modern web browser

## Installation and Running

### Option 1: Windows - Automated Setup

```bash
cd Pneumtofy
setup.bat
```

This automatically installs and starts both servers.

### Option 2: Manual Setup

#### Step 1: Start Backend (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend will run on http://localhost:5000

#### Step 2: Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm start
```

Frontend will open http://localhost:3000 automatically

### Option 3: If Already Installed

#### Terminal 1:
```bash
cd backend
python app.py
```

#### Terminal 2:
```bash
cd frontend
npm start
```

## Using the Application

### As a Guest (No Account Required)

1. Go to Home page
2. Fill out child's age and symptoms
3. Click "Assess Symptoms"
4. View assessment results with recommendations
5. Cannot save to tracker without logging in

### Creating an Account and Logging In

#### Register (New Users)

1. Click "Register" in top right
2. Enter:
   - Username (required)
   - Email (required)
   - Password (minimum 6 characters)
   - Guardian name (optional)
   - Phone number (optional)
3. Click "Create Account"
4. Automatically logged in

#### Login (Existing Users)

1. Click "Login" in top right
2. Enter username or email
3. Enter password
4. Click "Login"

### Saving Assessments to Tracker

#### If Logged In

1. Complete the form with symptoms
2. Click "Assess Symptoms"
3. Review results page
4. Click "Save to Tracker"
5. Assessment saved with date/time in your timezone
6. Redirects to Tracker page after 2 seconds

#### If Not Logged In

1. Complete the form
2. Click "Assess Symptoms"
3. Review results
4. Click "Save to Tracker"
5. Prompted to login/register
6. After successful authentication, assessment auto-saves
7. Redirected to Tracker page showing the saved assessment

### Viewing Assessment History

1. Must be logged in
2. Click "Tracker" in navigation bar
3. View all saved assessments
4. Shows:
   - Date and time (in your local timezone)
   - Risk level (color-coded)
   - Symptoms that were entered
   - Original recommendation
5. Filter by risk level using dropdown
6. Click "Delete" to remove entries

### Logging Out

1. Click your username in top right corner
2. Click "Logout" in dropdown menu
3. Session ends and returns to Home

## Testing Assessment Risk Levels

### Test Case 1: Mild Risk
- Age: 24 months
- Cough duration: 2 days  
- No other symptoms
- Expected: Mild - Safe home management

### Test Case 2: Moderate Risk
- Age: 24 months
- Cough duration: 7+ days
- Fast breathing: YES
- Fever: YES (38.5 Celsius)
- Expected: Moderate - Observe at home

### Test Case 3: Critical Risk
- Age: 24 months
- Chest indrawing: YES
- Expected: Critical - Seek immediate medical care

## Pages Overview

| Page | Path | Function | Requires Login |
|------|------|----------|----------------|
| Home/Assessment | / | Enter symptoms and get assessment | No |
| Results | /results | View outcome, save to tracker | No |
| Information | /info | Medical education about pneumonia | No |
| Tracker | /tracker | Personal assessment history | Yes |
| Login | /login | Sign in to account | No |
| Register | /register | Create new account | No |

## Key Features

### Authentication System
- Secure username and email registration
- Session-based login (remember me option available)
- Password hashing with Werkzeug
- Profile updates and password changes
- Protected Tracker access

### Timezone Support
- All assessments display in your local timezone
- Backend stores times in UTC
- Tracker page shows your timezone name
- Dates and times automatically convert from server

### Smart Guest-to-User Workflow
- Guests can perform complete assessments
- Clicking Save triggers optional login/register
- Assessment data preserved during authentication
- Auto-save to Tracker after login
- No data loss in login flow

### Data Privacy
- Each user sees only their own assessments
- All data linked to individual accounts
- Secure session management
- Automatic logout support

## Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -r node_modules package-lock.json
npm install
npm start
```

### Port already in use
- Find and stop services using port 3000 or 5000
- Or restart your computer

### Database errors
To reset the database:
```bash
cd backend
rm pneumtofy.db
python app.py
```

### Can't login after registration
- Make sure backend is running (port 5000)
- Try using email instead of username
- Clear browser cookies and try again

### Assessment not saving
- Must be logged in to use Tracker
- Verify backend is running and accessible
- Check browser console for errors (F12)

## Feature Customization

### Modify Assessment Logic
- Edit: `backend/decision_logic.py`
- Contains IMCI guideline rules
- Search for `assess_symptoms()` function

### Change Home Remedies
- Edit: `backend/decision_logic.py`
- Look for `get_home_remedies_for_observation()` and `get_home_remedies_for_mild()`

### Update Information Content
- Edit: `backend/models.py`
- Modify text in `InfoContent` class

### Edit App Styling
- Frontend: `frontend/src/components/*.css`
- Colors: Look for hex codes like #667eea
- Fonts: Montserrat (loaded from Google Fonts)

## System Architecture

The application uses:
- Frontend: React with Axios HTTP client
- Backend: Flask API with SQLAlchemy ORM
- Database: SQLite with relational schema
- Authentication: Flask-Login with session cookies
- Styling: CSS3 with responsive design

All servers run locally on your machine. No internet required after initial setup.

## For More Information

See these documentation files:
- README.md - Full feature documentation and API endpoints
- AUTHENTICATION_COMPLETE.md - Detailed auth system explanation
- ARCHITECTURE.md - System design and data flow diagrams
- DEPLOYMENT_GUIDE.md - Production deployment instructions

