# Pneumtofy - Troubleshooting Guide

## Backend Issues

### Python Dependency Installation Fails

**Error**: "Failed to build" or "No matching distribution found"

**Cause**: Version conflicts with pinned versions

**Solution**:
Use flexible version constraints (>=) instead of pinned versions (==):
```bash
cd backend
python -m pip cache purge
python -m pip install --upgrade pip
pip install -r requirements.txt
```

The `requirements.txt` should have flexible versions like:
```
Flask>=2.3.0
Werkzeug>=2.3.0
Flask-SQLAlchemy>=3.0.0
Flask-Login>=0.6.0
PyJWT>=2.8.0
```

### SQLite Database Errors

**Error**: "database is locked"

**Cause**: SQLite doesn't handle concurrent writes well

**Solution**:
- Close all connections to database
- Restart Flask backend
- Delete pneumtofy.db and restart (will recreate with fresh schema)

**For Production**: Migrate to PostgreSQL
```bash
pip install psycopg2-binary
export DATABASE_URL="postgresql://user:pass@hostname:5432/pneumtofy"
python app.py  # Re-run to auto-migrate
```

### "Address already in use" Port 5000

**Windows**:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux**:
```bash
lsof -i :5000
kill -9 <PID>
```

### Backend won't start or crashes with errors

**Check**:
1. Is Python 3.7+ installed? `python --version`
2. Are dependencies installed? `pip list | grep Flask`
3. Are you in the backend directory? `cd backend`

**Fix**:
```bash
cd backend
# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +  # macOS/Linux
rmdir /s /q __pycache__                            # Windows

# Reinstall dependencies
pip install -r requirements.txt

# Try to start
python app.py
```

### TypeError about ORM models

**Cause**: Database schema mismatch or old pneumtofy.db

**Solution**:
```bash
cd backend
# Remove old database
rm pneumtofy.db  # macOS/Linux
del pneumtofy.db # Windows

# Restart Flask - new database will be auto-created
python app.py
```

---

## Frontend Issues

### npm install fails

**Error**: "ERESOLVE unable to resolve dependency tree"

**Solution**:
```bash
cd frontend
npm cache clean --force
npm install --legacy-peer-deps
npm start
```

### "Address already in use" Port 3000

**Windows**:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux**:
```bash
lsof -i :3000
kill -9 <PID>
```

### Blank page or "Cannot find module" errors

**Solution**:
```bash
cd frontend
# Clear and reinstall
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s /q node_modules               # Windows

npm install
npm start
```

### React Router shows 404 page

**Check**: 
- Is backend running? (port 5000)
- Are you at correct URL? (http://localhost:3000)
- Did initial page load? (check console with F12)

---

## Authentication Issues

### Login fails with "Invalid username or email"

**Check**:
1. Is backend running?
2. Did you register first?
3. Are you using correct credentials?

**Test email login**:
- Login page accepts both username AND email
- Try with email instead of username

### "Invalid password" error

**Check**:
- Passwords are case-sensitive
- No extra spaces in password field
- Password must be at least 6 characters

**Reset**:
- Delete database (see SQLite section above)
- Create new test account

### Session expires immediately

**Cause**: Browser doesn't allow cookies or localStorage is disabled

**Fix**:
1. Check browser settings - cookies should be enabled
2. Open developer tools (F12)
3. Go to Storage/Application tab
4. Verify localStorage and cookies are populated

### Tracker page redirects to login

**Cause**: Session expired or not authenticated

**Solution**:
1. Login again
2. Try accessing Tracker page
3. If still redirects, check browser console (F12) for errors

---

## Timezone Issues

### Tracker shows UTC time instead of local time

**Cause**: Browser is not properly detecting timezone

**Check**:
1. Open browser console (F12)
2. Type: `new Date().toLocaleString()`
3. Should show current date/time in YOUR timezone, not UTC

**Fix**:
- Ensure `dateFormatter.js` is imported in Tracker.jsx
- Hard refresh page (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache

### Timezone box shows wrong timezone name

**Cause**: Browser reports wrong timezone to JavaScript

**Fix**:
1. Check system timezone settings
2. Sync system time
3. Test in console: `Intl.DateTimeFormat().resolvedOptions().timeZone`

---

## Pending Assessment Auto-Save Issues

### Assessment doesn't save after login

**Cause**: localStorage might be disabled or browser cleared storage

**Check**:
1. Backend is running and responding
2. You're not in private browsing mode (disables localStorage)
3. Assessment was actually stored before logging in

**Test manually**:
1. Logout
2. Complete assessment
3. Click "Save to Tracker"
4. Open browser console (F12) → Storage/Application tab
5. Check for `pendingAssessment` in localStorage

### Auto-save redirects but assessment not in Tracker

**Cause**: POST request to /api/tracker failed silently

**Check**:
1. Open browser console (F12)
2. Go to Network tab
3. Login and watch for POST /api/tracker request
4. Check response status (should be 200 or 201, not 4xx/5xx)

**Fix**:
```bash
# Manually save assessment via API
curl -X POST http://localhost:5000/api/tracker \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION" \
  -d '{"age_months": 24, "fever": true, ...}'
```

---

## Network/CORS Issues

### "CORS error" in browser console

**Error**: "Access to XMLHttpRequest... has been blocked by CORS policy"

**Check**:
- Backend is running on port 5000
- Flask has CORS enabled

**Fix**:
Ensure `app.py` has CORS import and initialization:
```python
from flask_cors import CORS
CORS(app)
```

### "Cannot reach http://localhost:5000"

**Check**:
1. Is backend running? (look for "Running on http://localhost:5000")
2. Are you using correct URL?
3. Is firewall blocking port 5000?

**Test**:
```bash
# Test backend health
curl http://localhost:5000/health
# Should return: {"status": "ok"}
```

---

## Database Issues

### "pneumtofy.db" keeps resetting

**Cause**: Database file is being deleted on startup

**Check**:
- `database.py` has `db.create_all()` but shouldn't delete data
- Check if backup process is running

**Solution**:
```bash
cd backend
# Verify database exists and has data
python -c "from database import db, init_db; from app import app; init_db(app)"
```

### Can't connect to PostgreSQL

**Error**: "could not connect to server"

**Check**:
- PostgreSQL is installed and running
- User credentials are correct
- Database exists: `createdb pneumtofy`

**Fix**:
```bash
# Test PostgreSQL connection
psql -U user -h localhost -d pneumtofy
```

---

## Performance Issues

### App loads slowly

**Frontend**: 
```bash
cd frontend
npm cache clean --force
npm start  # Should be faster second time
```

**Backend**:
- First startup creates database
- Second+ startups should be faster
- If still slow, check logs for errors

### Tracker page takes long to load

**Cause**: Large number of assessments

**Solution**: 
- Works fine up to 10,000+ assessments
- For much larger data, consider pagination in Tracker.jsx

---

## Browser Console Errors

### "useAuth is not defined" in components

**Cause**: Forgot to import useAuth hook

**Fix**:
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ...
}
```

### "Cannot read property 'formatDate' of undefined"

**Cause**: dateFormatter.js not imported correctly

**Fix**:
```javascript
import { formatDate, formatTime, getUserTimezone } from '../utils/dateFormatter';
// Use functions directly
const date = formatDate(timestamp);
```

### "localStorage is not defined"

**Cause**: Using localStorage in server during SSR (shouldn't happen in create-react-app)

**Fix**:
```javascript
if (typeof localStorage !== 'undefined') {
  const data = localStorage.getItem('pendingAssessment');
}
```

---

## Complete Reset - Nuclear Option

If everything is broken, start completely fresh:
```bash
# Find process
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### 4. Backend Won't Start

**Error**: "Address already in use" or "Flask won't start"

**Fix**:
```bash
cd backend

# Check if port is in use
python -c "import socket; print(socket.gethostbyname(socket.gethostname()))"

# Kill existing process or change port
# Edit app.py, change: app.run(..., port=5001)  # Use different port
```

### 5. Frontend Won't Start

**Error**: npm start error or blank page

**Fix**:
```bash
cd frontend

# Clear node_modules
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s /q node_modules               # Windows

# Reinstall
npm install
npm start
```

### 6. API Can't Connect

**Error**: "Cannot reach http://localhost:5000"

**Checklist**:
- [ ] Backend is running (`python app.py`)
- [ ] Backend shows "Running on http://localhost:5000"
- [ ] Firewall isn't blocking port 5000
- [ ] Frontend is trying to connect to correct URL
- [ ] CORS is enabled in backend

**Fix**: Add this to `backend/app.py` line 6:
```python
CORS(app)  # Make sure this is there
```

### 7. "Cannot find module" errors

**Error**: "Module 'react' not found" or similar

**Fix**:
```bash
cd frontend
npm install
npm start
```

### 8. Python Version Issue

**Error**: "Python 3.x required" or syntax errors

**Check**:
```bash
python --version  # Should be 3.7+
python -m pip --version
```

**Fix**: Install Python 3.9 or later from python.org

---

## Data Storage

### For MVP (Now - JSON)
- Data stored in: `backend/data/tracker.json`
- No database required
- Works immediately
- Falls back gracefully

### For Database (Future)
When ready to upgrade to PostgreSQL:

1. Install PostgreSQL from https://www.postgresql.org/download/
2. Install Python dependencies:
   ```bash
   pip install -r backend/requirements-db.txt
   ```
3. Update `backend/app.py` to use database
4. Run `database/schema.sql` to create tables

---

## Performance Issues

### Slow Startup

**Issue**: "npm start takes a long time"

**Solution**:
```bash
cd frontend

# Clear cache
npm cache clean --force

# Use clean install
npm ci  # Instead of npm install
```

### Slow API Response

**Issue**: "Backend takes too long to respond"

**Check**:
1. Is backend actually running?
2. Is there network latency?
3. Check `backend/app.py` for blocking operations

**Solution**: Restart backend
```bash
# Terminal 1
cd backend
ctrl+c  # Stop current process
python app.py  # Restart
```

---

## Nothing Works - Nuclear Option

Start completely fresh:

```bash
# 1. Stop all processes (Ctrl+C in both terminals)

# 2. Clear everything
cd Pneumtofy
rmdir /s /q frontend\node_modules  # Windows
rm -rf frontend/node_modules       # macOS/Linux
rmdir /s /q backend\__pycache__    # Windows
rm -rf backend/__pycache__         # macOS/Linux

# 3. Clear pip/npm cache
pip cache purge
npm cache clean --force

# 4. Run setup again
setup.bat  # Windows
bash setup.sh  # macOS/Linux

# 5. Start fresh
# Terminal 1
cd backend
python app.py

# Terminal 2
cd frontend  
npm start
```

---

## Manual Testing

1. Open http://localhost:3000
2. Complete symptom assessment
3. Review results
4. Test Save to Tracker (with and without login)
5. Go to Tracker page
6. Verify timezone display
7. Test email login
8. Test logout

---

## Checking Logs

### Backend Logs
Stop backend with Ctrl+C, then restart with debug:
```bash
cd backend
python app.py  # Logs will appear here
```

### Frontend Logs
Open browser console:
- Chrome/Edge: F12 → Console tab
- Firefox: F12 → Console tab
- Safari: Enable Developer Menu, then Console

### Python Debugging
Add to backend code:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## Getting Help

### 1. Check These Files
- `QUICK_START.md` - Fast reference
- `README.md` - Project overview
- `DEPLOYMENT_GUIDE.md` - Detailed setup

### 2. Verify Setup
```bash
python --version  # Should be 3.7+
npm --version     # Should be 6+
node --version    # Should be 14+
```

### 3. Test Endpoints Manually
```bash
# Check if backend is responding
python -c "import requests; print(requests.get('http://localhost:5000/health').json())"
```

### 4. Review Logs
- Backend: Check terminal output
- Frontend: Check browser console (F12)
- Python: Add `print()` statements

---

## Version Info

Current Pneumtofy Setup:
- Python: 3.7+
- Node.js: 14+
- React: 18.2
- Flask: 3.0
- PostgreSQL: Optional (for future database)

---

## Still Not Working?

1. Read the error message carefully
2. Search this document for your error
3. Try the "Nuclear Option" section
4. Check QUICK_START.md
5. Verify versions are correct

---

*Last Updated: March 30, 2026*

