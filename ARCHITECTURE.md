# Pneumtofy Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER BROWSER (Port 3000)                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                 React Frontend Application                 │ │
│  │  ┌──────────────┬──────────────┬──────────────┐            │ │
│  │  │ Symptom Form │ Assessment   │ Info Page    │ Navigation│ │
│  │  │              │ Results      │ Tracker      │ Bar       │ │
│  │  └──────────────┴──────────────┴──────────────┘            │ │
│  │         │                                                   │ │
│  │         └──────────────┬─────────────────────────────────┐ │ │
│  └────────────────────────┼─────────────────────────────────┘ │ │
│                           │ HTTP Requests (Axios)              │ │
│                           └────────────────┬────────────────────┘ │
│                                            │                      │
│                    ┌──────────────────────────────┐               │
│                    │   Flask API Server           │               │
│                    │   (Port 5000)                │               │
│                    │  ┌────────────────────────┐  │               │
│                    │  │  REST API Endpoints:   │  │               │
│                    │  │  - POST /api/assess    │  │               │
│                    │  │  - GET  /api/info      │  │               │
│                    │  │  - POST /api/tracker   │  │               │
│                    │  │  - GET  /api/tracker   │  │               │
│                    │  │  - DELETE /api/tracker │  │               │
│                    │  └────────────────────────┘  │               │
│                    │           │                   │               │
│                    │     ┌─────┴──────┬────────┐   │               │
│                    │     │            │        │   │               │
│              ┌─────────┬─────────────┐ │   │       │               │
│              │       │ │             │ │ Python Module │           │
│   ┌──────────────┐ │  │    │         │ │             │           │
│   │ Data Store   │ │  │    ├◄───────┤ │  decision_   │           │
│   │              │ │  │  │ │   logic.py (IMCI) │     │           │
│   │ JSON Files   │ │  │  │ │             │     │     │           │
│   │ (tracker.    │ │  │  │ └─────────────┤     │     │           │
│   │  json)       │ │  │  │               │     │     │           │
│   │              │ │  │  │  models.py    │     │     │           │
│   └──────────────┘ │  │  │ (Info Content)      │     │           │
│         ▲          │  │  │               │     │     │           │
│         │          │  │  └───────────────┤─────┘     │           │
│         └──────────┼──┼──────────────────────────────┼────────┘   │
│                    └──────────────────────────────────┘           │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────┐
│                    Future Integration Options                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database (When Migrating Past MVP)             │   │
│  │  - tracker_entries table                                   │   │
│  │  - information_content table                               │   │
│  │  - User accounts (future)                                  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Health System Integration (Future)                        │   │
│  │  - Connect to local health facilities                      │   │
│  │  - Patient records sync                                    │   │
│  │  - Analytics dashboard                                     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Mobile App (React Native / Native Apps)                  │   │
│  │  - Same API backend                                        │   │
│  │  - Offline-first capabilities                              │   │
│  │  - Push notifications                                      │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
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
                    │ ⚠️  SEEK     │         │ INDICATORS       │
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
                    │ • OTC fever reducers (* warn) │
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

## Database Schema (PostgreSQL)

```sql
-- When Migrating from JSON to Database

tracker_entries
├── id (PRIMARY KEY)
├── age_months (INTEGER)
├── cough_duration (INTEGER)
├── fast_breathing (BOOLEAN)
├── fever (BOOLEAN)
├── fever_temperature (DECIMAL)
├── difficulty_breathing (BOOLEAN)
├── chest_indrawing (BOOLEAN)  ⚠️ CRITICAL
├── stridor (BOOLEAN)          ⚠️ CRITICAL  
├── lethargy (BOOLEAN)         ⚠️ CRITICAL
├── unable_to_drink (BOOLEAN)  ⚠️ CRITICAL
├── vomiting (BOOLEAN)
├── diarrhea (BOOLEAN)
├── previous_episodes (INTEGER)
├── assessment (VARCHAR)
├── recommendation (TEXT)
├── guidance (JSONB)
├── home_remedies (JSONB)
├── timestamp (TIMESTAMP)
└── created_at (TIMESTAMP)

information_content
├── id (PRIMARY KEY)
├── section (VARCHAR UNIQUE)
├── content (JSONB)
├── updated_at (TIMESTAMP)
└── Sections: symptoms, risk_factors, prevention, etc.
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

## Component Communication Flow

```
Navigation.jsx
│
└─ Listens to currentPage state
│
└─ Changes page on button click
   │
   ├─ Page: home
   │  └─→ SymptomForm
   │       └─→ onSubmit sends to Results
   │
   ├─ Page: results  
   │  └─→ Results
   │       ├─→ Display assessment
   │       ├─→ Save to Tracker (POST /api/tracker)
   │       └─→ Go Home
   │
   ├─ Page: info
   │  └─→ Info
   │       ├─→ Fetch from GET /api/info
   │       └─→ Display education content
   │
   └─ Page: tracker
      └─→ Tracker
           ├─→ Fetch from GET /api/tracker
           ├─→ Display history
           ├─→ Filter entries
           └─→ Delete entries (DELETE /api/tracker/<id>)
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
└── schema.sql (PostgreSQL)
    ├─ CREATE TABLE tracker_entries
    └─ CREATE TABLE information_content
```

---

*This architecture is designed to be scalable, maintainable, and ready for future enhancements.*
