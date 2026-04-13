## Pneumtofy - REFERENCE AND GUIDE

## What's Been Built

A **working web application** for pneumonia symptom tracking and management based on WHO IMCI guidelines.

- **Frontend**: Full React app 
- **Backend**: Python Flask API with IMCI decision logic
- **Database**: Python SQLite and SQLAlchemy toolkit

---

## Start 

### Option 1: Windows - Run Setup Script
```bash
cd Pneumtofy
setup.bat
```

### Option 2: Manual Setup

**Terminal 1 (Backend)**:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm install
npm start
```

Will open: **http://localhost:3000**

---

## If already set up

**Terminal 1 (Backend)**:
```bash
cd backend
python app.py
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm start
```

---

##  App Features & Pages

| Feature | Location | What It Does |
|---------|----------|--------------|
| **Home** | `/` | Main symptom assessment form |
| **Results** | After form | Risk classification + recommendations |
| **Info** | Click "Info" | Educational content about pneumonia |
| **Tracker** | Click "Tracker" | History of all assessments |

---

## For Testing

### Quick Test Cases

**Case 1: Normal (No Symptoms)**
- Age: 24 months, Cough: 2 days
- Expected: MILD - Safe to manage at home

**Case 2: Moderate (Pneumonia Indicators)**
- Age: 24 months, Cough: 7+ days, Fast breathing: YES, Fever: YES
- Expected: MODERATE - Observe & manage

**Case 3: Critical (Needs Doctor)**
- Age: 24 months, Chest indrawing: YES
- Expected: CRITICAL - Seek immediate medical care

Run tests: `python test_mvp.py`

---

##  For Improvement

### Frontend Changes
- **Logo/Header**: `frontend/src/components/Navigation.jsx`
- **Form Fields**: `frontend/src/components/SymptomForm.jsx`
- **Results Display**: `frontend/src/components/Results.jsx`
- **Info Content**: `frontend/src/components/Info.jsx`
- **Colors/Styling**: `frontend/src/components/*.css`

### Backend Changes
- **Assessment Logic**: `backend/decision_logic.py`
- **API Routes**: `backend/app.py`
- **Home Remedies**: `backend/decision_logic.py` (search for `get_home_remedies`)

---

## API Endpoints Quick Reference

```
POST http://localhost:5000/api/assess
  → Submit symptoms, get assessment

GET http://localhost:5000/api/info
  → Get pneumonia information

POST http://localhost:5000/api/tracker
  → Save assessment to history

GET http://localhost:5000/api/tracker
  → Get all saved assessments

DELETE http://localhost:5000/api/tracker/<id>
  → Delete an assessment
```

---

## Key Concepts

### IMCI (Integrated Management of Childhood Illness)
- WHO framework for assessing sick children
- **Critical signs** = Immediate hospital referral
- **Pneumonia signs** = Careful observation at home
- Age-appropriate assessment

### Risk Levels
1. 🟢 **MILD** → Safe home management
2. 🟡 **MODERATE** → Observation + home remedies
3. 🔴 **CRITICAL** → SEEK MEDICAL ATTENTION NOW

### Critical Signs (Auto-Refer to Hospital)
- Chest wall indrawing
- Stridor (in calm child)
- Lethargy (unusual sleepiness)
- Unable to drink

---

## Customization Examples

### Add a New Symptom Field

**1. Frontend** (SymptomForm.jsx):
```jsx
// Add to form state
cough_type: '',

// Add to form JSX
<div className="form-group">
  <label>Type of cough</label>
  <input
    type="text"
    name="cough_type"
    value={symptoms.cough_type}
    onChange={handleInputChange}
  />
</div>
```

**2. Backend** (decision_logic.py):
```python
def assess_symptoms(..., cough_type):
    # Add logic to use cough_type
    if cough_type == 'productive':
        # Add to assessment
```

### Change Home Remedies

Edit `backend/decision_logic.py`:
```python
def get_home_remedies_for_observation():
    return [
        {
            'name': 'New Remedy',
            'description': 'Description here',
            'dosage': 'How to use'
        }
    ]
```

### Update Information

Edit `backend/models.py`:
```python
class InfoContent:
    ABOUT = "Updated description here..."
    SYMPTOMS = ["Updated list", "of symptoms"]
```

---

## Common Issues

### "Can't find module 'react'"
```bash
cd frontend
npm install
```

### "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

### "CORS error" or "Can't connect to backend"
- Make sure backend is running on port 5000
- Check that frontend calls `http://localhost:5000`
- Verify `.env` has correct API host

### "No module named flask"
```bash
cd backend
pip install -r requirements.txt
```

---

## Dependencies

### Frontend
- React 18
- Axios (HTTP client)
- CSS3 (styling)

### Backend
- Flask 3.0
- Flask-CORS
- psycopg2 (for future DB)
- python-dotenv

---

## UI Components Summary

```
App
├── Navigation (top bar)
├── Main Content
│   ├── SymptomForm (home page)
│   ├── Results (assessment results)
│   ├── Info (information page)
│   └── Tracker (history)
```

**Color Scheme**:
- Success: Green (#27ae60)
- Warning: Orange (#f39c12)
- Critical: Red (#e74c3c)
- Neutral: Gray (#95a5a6)

---

## Other

1. Check **README.md** for overview
2. Check **DEPLOYMENT_GUIDE.md** for detailed info
3. Check **test_mvp.py** for example cases
4. Run tests: `python test_mvp.py`

