# Quick Start Guide - Authentication System Testing

## Prerequisites

- Python 3.7+ installed
- Node.js 14+ installed  
- npm package manager
- Two terminal windows (one for backend, one for frontend)

## Step 1: Setup Backend

### 1.1 Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Note:** This installs flexible versions (>=) not pinned versions for easier dependency resolution.

### 1.2 Start Flask Backend

```bash
python app.py
```

**Expected output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://localhost:5000
```

The SQLite database will be automatically created as `pneumtofy.db` in the backend folder.

**Keep this terminal open!**

## Step 2: Setup Frontend

### 2.1 Install Frontend Dependencies

In a **new terminal window**:

```bash
cd frontend
npm install
```

This may take a minute or two. It will install:
- React 18
- Axios for HTTP requests
- React Router 6 for navigation
- And other dependencies

**Expected output:**
```
added 125 packages in 1m 30s
```

### 2.2 Start React Development Server

```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view pneumtofy-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

The app will automatically open in your browser at `http://localhost:3000`

## Step 3: Test Registration Flow

### 3.1 Create a New Account

1. You should see the Pneumtofy home page
2. Click **"Register"** button in the top right
3. Fill in the registration form:
   - **Username:** `caregivertest`
   - **Email:** `caregiver@test.com`
   - **Password:** `TestPassword123!`
   - **Confirm Password:** `TestPassword123!`
   - **Guardian Name:** `Sarah Johnson` (optional)
   - **Phone:** `555-0123` (optional)

4. Click **"Create Account"**

**Expected results:**
- ✅ Registration succeeds
- ✅ User automatically logged in
- ✅ Redirected to home page
- ✅ Username appears in top-right corner
- ✅ "Register" button replaced with user menu

### 3.2 Verify User Menu

1. Click the **user button** (shows username in top-right)
2. Should see dropdown with:
   - Your email address
   - Logout button

## Step 4: Test Assessment Saving with Auth

### 4.1 Complete an Assessment

1. From home page, fill out the symptom assessment form:
   - **Child's Age:** 24 months
   - **Cough Duration:** 7 days
   - Check some symptoms (e.g., fever, fast breathing)
   - Click **"Check Assessment"**

2. Review results showing risk assessment

3. You should see an option to **"Save to Tracker"** (only visible when logged in)

### 4.2 Verify Assessment Saved

1. Navigate to **"Tracker"** page (top navigation)
2. Your assessment should appear with:
   - Date and time
   - Symptoms assessed
   - Assessment result
   - Delete button

## Step 5: Test Email Login

### 5.1 Logout

1. Click user menu
2. Click **"Logout"**

### 5.2 Login with Email Instead of Username

On login page, enter:
- **Username/Email:** `caregiver@test.com` (use the email, not username)
- **Password:** `TestPassword123!`

**Expected results:**
- ✅ Email login works (both email and username are accepted)

## Step 6: Test Pending Assessment Auto-Save Workflow

### 6.1 Logout Completely

1. Go to user menu
2. Click **"Logout"**

### 6.2 Complete Assessment Without Login

1. Complete a symptom assessment form
2. Click **"Check Assessment"**
3. On results page, click **"Save to Tracker"**

**Expected results:**
- ✅ Gets alert: "Please login or register to save assessment"
- ✅ Redirected to login page
- ✅ Assessment stored in browser (localStorage)

### 6.3 Login and Auto-Save

1. On login page, enter your credentials and login
2. Wait for page to redirect

**Expected results:**
- ✅ Assessment automatically saved to Tracker
- ✅ Redirected to Tracker page
- ✅ Assessment now appears in Tracker
- ✅ Assessment has correct timestamp in your local timezone
- ✅ Timezone info box shows your timezone (e.g., "America/New_York")

## Step 7: Test Timezone Display

On Tracker page, verify:
- ✅ Timezone info box visible (e.g., "Timezone: America/New_York")
- ✅ All assessment dates displayed in local timezone (e.g., "Mar 31, 2026")
- ✅ All assessment times displayed in local timezone (e.g., "2:45:30 PM")
- ✅ Timezone automatically matches your browser/system timezone

## Step 8: Test Login/Logout

### 8.1 Logout

1. Click user menu (username button)
2. Click **"Logout"**

**Expected results:**
- ✅ Logged out successfully
- ✅ Redirected to login page
- ✅ Tracker page no longer accessible (redirects to login)
- ✅ "Register" and "Login" buttons shown again

### 5.2 Login Again

1. On login page, enter:
   - **Username:** `caregivertest`
   - **Password:** `TestPassword123!`
   - Check "Remember Me" (optional)

2. Click **"Login"**

**Expected results:**
- ✅ Login succeeds
- ✅ Redirected to home page
- ✅ Username shown in top-right
- ✅ Tracker page accessible
- ✅ Previous assessments still visible

## Step 6: Test Protected Routes

### 6.1 Try Accessing Tracker While Logged Out

1. Logout (if still logged in)
2. Try going directly to `http://localhost:3000/tracker`

**Expected results:**
- ✅ Redirected to login page
- ✅ Tracker content not visible

### 6.2 Login and Access Tracker

1. Login again with credentials
2. Go to `http://localhost:3000/tracker`

**Expected results:**
- ✅ Tracker page loads
- ✅ Your assessments displayed

## Step 7: Test Backend API Directly (Optional)

### 7.1 Register via API

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apitest",
    "email": "api@test.com",
    "password": "ApiTest123!"
  }'
```

**Expected response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 2,
    "username": "apitest",
    "email": "api@test.com",
    ...
  }
}
```

### 7.2 Login via API

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "apitest",
    "password": "ApiTest123!"
  }'
```

**Expected response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {...}
}
```

### 7.3 Get Current User

```bash
curl http://localhost:5000/api/auth/me \
  -b cookies.txt
```

**Expected response (200):**
```json
{
  "id": 2,
  "username": "apitest",
  "email": "api@test.com",
  "created_at": "2026-03-31T14:45:30Z",
  "last_login": "2026-03-31T14:46:40Z"
}
```

Note: All timestamps include Z suffix (UTC indicator) and are automatically converted to your local timezone by the frontend.

## Troubleshooting

### Port Already in Use

**Problem:** `Address already in use`

**Solution:**
```bash
# Find process using port 5000 (Flask)
lsof -i :5000
# Or for React (port 3000)
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### npm install fails

**Problem:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Force legacy peer deps resolution
npm install --legacy-peer-deps
```

### CORS Errors

**Problem:** `Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:** Ensure Flask backend is running (check terminal)

### Database Lock Error

**Problem:** `database is locked`

**Solution:** 
- This happens with SQLite under heavy load
- Restart backend server
- For production, migrate to PostgreSQL

### Auth not persisting after refresh

**Problem:** Logged out after page refresh

**Solution:**
- Ensure localStorage is enabled in browser
- Check browser DevTools → Storage → Local Storage
- Should have `user` and `authenticated` keys

## Next Steps

Now that authentication is working:

1. **Create More Test Accounts** - Test with different usernames
2. **Test Profile Updates** - Update guardian info via Settings page (to be added)
3. **Test Assessment Filtering** - Filter tracker by date range
4. **Load Testing** - Create multiple assessments and verify they're saved
5. **Mobile Testing** - Test on mobile device or use DevTools responsive mode

## Database

The SQLite database file is created automatically at:
```
backend/pneumtofy.db
```

To clear all data and start fresh:
```bash
cd backend
rm pneumtofy.db
# Restart Flask server - it will recreate the database
```

To view database contents using sqlite3:
```bash
sqlite3 backend/pneumtofy.db

# View all users
SELECT * FROM user;

# View assessments for a user
SELECT * FROM tracked_assessment WHERE user_id=1;

# Exit
.exit
```

## Performance Tips

1. **Clear Browser Cache** - If seeing old UI:
   ```bash
   Ctrl+Shift+Del  # Open DevTools cache settings
   ```

2. **Use incognito Mode** - Avoid cached data:
   ```bash
   Ctrl+Shift+N  # New incognito window
   ```

3. **Monitor Console** - Check DevTools console for errors:
   ```bash
   F12  # Open DevTools
   Click "Console" tab
   ```

## Success Checklist

✅ Backend running on port 5000
✅ Frontend running on port 3000  
✅ Created account successfully
✅ Logged in with credentials
✅ Saved assessment to tracker
✅ Logout working
✅ Login again successful
✅ Tracker protected (redirects to login when logged out)
✅ Multiple assessments saved and displayed


Check the following files for more details:
- `AUTH_SETUP.md` - Full authentication documentation
- `backend/app.py` - Backend routes and logic
- `frontend/src/components/Login.jsx` - Login component
- `frontend/src/components/Register.jsx` - Registration component
- `frontend/src/contexts/AuthContext.jsx` - Auth state management

