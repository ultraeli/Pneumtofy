# 🔧 Pneumtofy - Troubleshooting Guide

## Issue: psycopg2-binary Build Error

### Symptom
```
Error: pg_config executable not found.
ERROR: Failed to build 'psycopg2-binary' when getting requirements to build wheel
```

### Solution ✅

The MVP now uses **JSON file storage** instead of requiring PostgreSQL immediately. We've removed the problematic `psycopg2-binary` dependency from `requirements.txt`.

### What Changed
- **Before**: `requirements.txt` included `psycopg2-binary==2.9.9`
- **Now**: `requirements.txt` only has Flask dependencies
- **Future**: When ready, install PostgreSQL and use `requirements-db.txt`

---

## Getting Started (Revised Setup)

### Step 1: Run Setup Script (FIXED)
```bash
cd Pneumtofy
setup.bat        # Windows
# OR
bash setup.sh    # macOS/Linux
```

This will now:
- ✅ Clear pip cache
- ✅ Upgrade pip, setuptools, wheel
- ✅ Install Flask + CORS only
- ✅ Install React dependencies
- ✅ Show clear error messages if something fails

### Step 2: Start Application
```bash
# Terminal 1
cd backend
python app.py

# Terminal 2
cd frontend
npm start
```

---

## Common Issues & Fixes

### 1. Python Dependencies Still Failing

**Error**: "Failed to install Python dependencies"

**Fix**:
```bash
# Clear cache and try again
python -m pip cache purge
python -m pip install --upgrade pip setuptools wheel
cd backend
pip install Flask==3.0.0
pip install Flask-CORS==4.0.0
pip install python-dotenv==1.0.0
```

### 2. Node.js/npm Issues

**Error**: "Failed to install Node.js dependencies"

**Fix**:
```bash
# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest

# Try again
cd frontend
npm install
```

### 3. Port Already in Use (3000 or 5000)

**Error**: "Address already in use" or "Port 3000/5000 in use"

**Windows Fix**:
```bash
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process (replace PID with the number)
taskkill /PID <PID> /F
```

**macOS/Linux Fix**:
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

## Testing the Application

### Quick Test
```bash
# Terminal 3 (while app is running)
cd Pneumtofy
python test_mvp.py
```

**Expected Output**:
```
✓ TEST 1: Mild Case - PASS
✓ TEST 2: Moderate Case - PASS
✓ TEST 3: Critical Case - PASS
✓ TEST 4: Lethargy Case - PASS
✓ TEST 5: Unable to Drink Case - PASS

All core tests passed!
```

### Manual Test
1. Open http://localhost:3000
2. Fill form with test data
3. Click "Assess Symptoms"
4. Should see results
5. Click "Save to Tracker"
6. Click "Tracker" to see saved entry

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

