# Pneumtofy - Fast MVP Setup Guide

## Project Structure

```
Pneumtofy/
├── frontend/                   # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── SymptomForm.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── Info.jsx
│   │   │   └── Tracker.jsx
│   │   ├── App.jsx
│   │   └── index.jsx
│   └── package.json
├── backend/                    # Python Flask API
│   ├── app.py                 # Main Flask application
│   ├── decision_logic.py      # IMCI-based assessment logic
│   ├── models.py              # Data models
│   ├── requirements.txt       # Python dependencies
│   └── data/                  # Storage for tracker entries
└── database/
    └── schema.sql             # PostgreSQL schema
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

### 1. Symptom Assessment Form
- Input child's age and symptoms
- IMCI-based assessment
- Immediate risk classification

### 2. Results Display
- Risk level (Mild, Moderate, Critical)
- Recommendations (Observe vs Seek Care)
- Home remedies suggestions
- Safety warnings

### 3. Information Pages
- Pneumonia information
- Symptoms and risk factors
- Prevention guidelines
- WHO-based resources

### 4. Symptom Tracker
- Save assessment history
- View past entries
- Filter by risk level
- Track progression

## API Endpoints

### POST /api/assess
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

### GET /api/info
Get pneumonia information content.

### GET /api/tracker
Get all saved tracker entries.

### POST /api/tracker
Save new tracker entry.

### DELETE /api/tracker/<id>
Delete tracker entry.

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

1. **Data Storage**: Currently uses JSON files. Can upgrade to PostgreSQL using the provided schema.sql

2. **Frontend Dependencies**: React 18, Axios for API calls, CSS modules for styling

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

## Future Enhancements

1. Database integration with PostgreSQL
2. User accounts and authentication
3. Multi-language support
4. Mobile app version
5. Admin panel for information updates
6. Analytics and reporting
7. Integration with health systems
8. Push notifications for reminders

## Disclaimer

This application is NOT a substitute for professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment. The app is designed to help with symptom tracking and general awareness only.
