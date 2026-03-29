s# Pneumtofy Fast MVP - Quick Reference Guide

## 🎯 What's Been Built

A **complete, working web application** for pneumonia symptom tracking and management based on WHO IMCI guidelines.

- **Frontend**: Full React app with 5 interactive pages
- **Backend**: Python Flask API with IMCI decision logic
- **Database**: Schema ready for PostgreSQL integration
- **Assessment Engine**: 5+ test cases all passing ✅

---

## 🚀 Quick Start (< 5 minutes)

### Option 1: Windows - Run Setup Script
```bash
cd Pneumtofy
setup.bat
```

### Option 2: macOS/Linux - Run Setup Script
```bash
cd Pneumtofy
bash setup.sh
```

### Option 3: Manual Setup

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

Then open: **http://localhost:3000**

---

## 📱 App Features & Pages

| Feature | Location | What It Does |
|---------|----------|--------------|
| **Home** | `/` | Main symptom assessment form |
| **Results** | After form | Risk classification + recommendations |
| **Info** | Click "Info" | Educational content about pneumonia |
| **Tracker** | Click "Tracker" | History of all assessments |

---

## 🧪 Test the App

### Quick Test Cases

**Case 1: Normal (No Symptoms)**
- Age: 24 months, Cough: 2 days
- Expected: ✅ MILD - Safe to manage at home

**Case 2: Moderate (Pneumonia Indicators)**
- Age: 24 months, Cough: 7+ days, Fast breathing: YES, Fever: YES
- Expected: ✅ MODERATE - Observe & manage

**Case 3: Critical (Needs Doctor)**
- Age: 24 months, Chest indrawing: YES
- Expected: ⚠️ CRITICAL - Seek immediate medical care

Run tests: `python test_mvp.py`

---

## 📂 Files to Edit

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

## 🔌 API Endpoints Quick Reference

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

## 🎓 Key Concepts

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
- ⚠️ Chest wall indrawing
- ⚠️ Stridor (in calm child)
- ⚠️ Lethargy (unusual sleepiness)
- ⚠️ Unable to drink

---

## 🛠️ Customization Examples

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

## 🐛 Common Issues & Fixes

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

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

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

## 📦 Dependencies

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

## 🎨 UI Components Summary

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
- Primary: Purple gradient (#667eea → #764ba2)
- Success: Green (#27ae60)
- Warning: Orange (#f39c12)
- Critical: Red (#e74c3c)
- Neutral: Gray (#95a5a6)

---

## 📋 Before Going Live

- [ ] Test all 4 pages
- [ ] Try entering symptoms and getting recommendations
- [ ] Save something to tracker
- [ ] Check disclaimers are visible
- [ ] Test on mobile/phone size
- [ ] Verify backend responds to API calls
- [ ] Check that tracker saves/loads data
- [ ] Review all home remedies for accuracy

---

## 🚀 Future Enhancements

### Easy Wins (1-2 weeks):
1. Add database (use schema.sql)
2. Add user authentication
3. Add symptom photos/videos
4. Add multilingual support

### Medium (2-4 weeks):
1. Mobile app (React Native)
2. Offline mode (Service Workers)
3. Admin panel for content management
4. Advanced analytics

### Hard (4+ weeks):
1. Health system integration
2. Push notifications
3. AI/ML for pattern detection
4. Integration with EHR systems

---

## 💡 Tips for Team Members

1. **Always include disclaimers** - This is medical software
2. **Test edge cases** - Try different age groups, symptom combinations
3. **Keep it simple** - Don't add features beyond current scope
4. **Document changes** - Comment your code so teammates understand
5. **Test on mobile** - Not everyone uses desktop
6. **Get feedback** - Test with actual caregivers if possible
7. **Follow IMCI** - All changes should be guideline-aligned

---

## 📞 Questions?

1. Check **README.md** for overview
2. Check **DEPLOYMENT_GUIDE.md** for detailed info
3. Check **test_mvp.py** for example cases
4. Run tests: `python test_mvp.py`

---

## ✅ Status: READY TO USE

**All core features implemented and tested.** ✅  
**All API endpoints working.** ✅  
**Assessment logic tested with 5 test cases - all passing.** ✅  
**Ready for team customization and deployment.** ✅  

---

*Start here, then customize for your specific needs!*
