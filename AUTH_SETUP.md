# Pneumtofy Authentication System

## Overview

The Pneumtofy application includes a complete authentication system allowing users to:
- Create accounts with secure password hashing
- Login and maintain persistent sessions
- Track assessments associated with their user account
- Update profile information
- Securely logout

## Architecture

### Backend Components

#### 1. **database.py** - SQLAlchemy Setup
```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
```

#### 2. **models_auth.py** - Database Models

**User Model:**
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `guardianname` - Guardian/caregiver name (optional)
- `phone` - Contact phone number (optional)
- `childrens_ages` - JSON field for child age information
- `is_active` - Account active status
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp
- `last_login` - Last login timestamp
- `tracked_assessments` - Relationship to user's assessments

Methods:
- `set_password(password)` - Hash and store password
- `check_password(password)` - Verify password during login
- `to_dict()` - Serialize user to JSON

**TrackedAssessment Model:**
- Linked to User via `user_id` foreign key
- Stores all symptom data and assessment results
- Indexed by timestamp for efficient queries
- All assessment data now associated with specific user

#### 3. **app.py** - Flask Backend with Auth Routes

**Authentication Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires login)
- `GET /api/auth/me` - Get current user info (requires login)
- `PUT /api/auth/update` - Update user profile (requires login)

**Protected Routes:**
- `GET /api/tracker` - Get user's assessments (protected)
- `POST /api/tracker` - Save new assessment (protected)
- `DELETE /api/tracker/<id>` - Delete assessment (protected)

**Public Routes:**
- `POST /api/assess` - Run assessment (no login required)
- `GET /api/info` - Get medical information (no login required)

### Frontend Components

#### 1. **Login.jsx** - Login Page
- Email/username and password input
- Session creation via backend
- Redirect to home on successful login
- Error handling and display

#### 2. **Register.jsx** - Registration Page
- Username, email, password fields
- Optional guardian information
- Password confirmation validation
- Email validation
- Automatic login after registration

#### 3. **AuthContext.jsx** - Auth State Management
- Provides authentication state across app
- Methods: `login()`, `logout()`, `updateUser()`
- Props: `user`, `isAuthenticated`, `loading`
- Persists authentication in localStorage
- Automatically checks auth on app load

#### 4. **ProtectedRoute.jsx** - Route Protection
- Wraps routes requiring authentication
- Redirects unauthenticated users to login
- Shows loading state during auth check

#### 5. **Auth.css** - Styling
- Gradient backgrounds
- Form styling with validation
- Loading spinner
- Responsive design

### Updated Components

#### Navigation.jsx
- Added Login/Register buttons for logged-out users
- User menu dropdown for logged-in users
- Logout button
- Displays username when authenticated

#### App.jsx
- Integrated React Router with BrowserRouter
- Wrapped app in AuthProvider
- Added routes for /login and /register
- Protected /tracker route with ProtectedRoute
- State management with navigation

## Backend Setup

### Configuration

The Flask app uses the following configuration:

```python
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'sqlite:///pneumtofy.db'  # Default to SQLite
)
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
```

### Database

By default, data is stored in a local SQLite database (`pneumtofy.db`). For production, update:

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/pneumtofy"
```

The database schema includes:
- `User` table with 10+ fields
- `TrackedAssessment` table with 15+ fields
- Proper indexes on timestamps
- Foreign key constraints

### Dependencies

**New auth-related packages added to requirements.txt:**
- `Flask-SQLAlchemy==3.0.5` - ORM for database operations
- `Flask-Login==0.6.2` - Session management
- `PyJWT==2.8.1` - JWT token support
- `Werkzeug==3.0.0` - Password hashing utilities

## Frontend Setup

### Dependencies

**New packages added to package.json:**
- `react-router-dom==^6.11.0` - Client-side routing

Install with:
```bash
cd frontend
npm install
```

## API Endpoints

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123",
  "guardianname": "John Doe",
  "phone": "+1234567890"
}

Response (201):
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "guardianname": "John Doe",
    "is_active": true,
    "created_at": "2024-01-01T12:00:00"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepass123",
  "remember": true
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "user": {...}
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <session_token>

Response (200):
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  ...
}
```

#### Update Profile
```bash
PUT /api/auth/update
Content-Type: application/json

{
  "guardianname": "Jane Doe",
  "phone": "+0987654321",
  "new_password": "newpass123",  // Optional
  "old_password": "securepass123"  // Required if changing password
}

Response (200):
{
  "success": true,
  "message": "Profile updated",
  "user": {...}
}
```

#### Logout
```bash
POST /api/auth/logout

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Assessment (Protected Routes)

#### Get User's Assessments
```bash
GET /api/tracker
Authorization: Bearer <session_token>

Response (200):
{
  "entries": [
    {
      "id": 1,
      "user_id": 1,
      "age_months": 24,
      "assessment": "Pneumonia - Severe",
      "recommendation": "Hospital referral",
      "timestamp": "2024-01-01T12:00:00"
    }
  ]
}
```

#### Save Assessment
```bash
POST /api/tracker
Content-Type: application/json
Authorization: Bearer <session_token>

{
  "age_months": 24,
  "cough_duration": 5,
  "fast_breathing": true,
  "fever": true,
  "fever_temperature": 39.2,
  "assessment": "Pneumonia - Severe",
  "recommendation": "Hospital referral",
  "guidance": ["Call ambulance", "Keep child warm"],
  "home_remedies": ["Honey cough drops"]
}

Response (201):
{
  "id": 1,
  "user_id": 1,
  ...
}
```

#### Delete Assessment
```bash
DELETE /api/tracker/1
Authorization: Bearer <session_token>

Response (200):
{
  "success": true
}
```

## Security Features

### Password Security
- Passwords hashed with Werkzeug's `generate_password_hash()`
- Uses bcrypt algorithm
- Never stored in plaintext
- Verified with `check_password_hash()`

### Session Management
- Flask-Login manages user sessions
- Secure session cookies (HTTPONLY, SAMESITE=Lax)
- Automatic session validation on each request
- Session timeout after 7 days of inactivity

### Data Protection
- User-specific data isolation (users only see their assessments)
- Foreign key constraints prevent data tampering
- Input validation on all endpoints
- CORS configured for allowed origins

### Recommended Production Settings

```python
# In production, enable:
app.config['SESSION_COOKIE_SECURE'] = True  # Requires HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Already set
app.config['SESSION_COOKIE_SAMESITE'] = 'Strict'  # Change from Lax
```

## Testing the System

### 1. Start Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

The Flask app will run on `http://localhost:5000`
SQLite database will be created at `backend/pneumtofy.db`

### 2. Start Frontend
```bash
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

### 3. Test Registration
- Navigate to `http://localhost:3000/register`
- Create an account with:
  - Username: `testuser`
  - Email: `test@example.com`
  - Password: `testpass123`
- Should be automatically logged in and redirected to home

### 4. Test Tracker
- On home page, complete an assessment
- Click "Save Assessment" (automatically saves if logged in)
- Go to Tracker page
- Your assessment should appear
- You should be able to delete it

### 5. Test Login/Logout
- Click logout in user menu
- Redirects to login page
- Login with saved credentials
- Session restored

## Troubleshooting

### "Database is locked" error
- SQLite doesn't handle concurrent writes well
- Solution: Switch to PostgreSQL for production
- See `requirements-db.txt` for PostgreSQL setup

### "Unauthorized" on tracker routes
- Session may have expired
- Login again to get new session
- Check browser cookies are enabled

### CORS errors
- Backend CORS is configured for all origins in dev
- In production, set specific allowed origins:
```python
CORS(app, origins=['https://yourdomain.com'])
```

### Auth state not persisting
- Check browser localStorage is enabled
- Auth data is stored in localStorage as backup
- Browser console will show any JS errors

## Future Enhancements

1. **Email Verification** - Verify email before enabling account
2. **Password Reset** - Send reset link via email
3. **Two-Factor Auth** - Add security with 2FA
4. **Social Login** - Support Google/GitHub login
5. **Profile Picture** - Allow user avatars
6. **Role-Based Access** - Admin, caregiver roles
7. **Assessment Sharing** - Share assessments with healthcare providers
8. **Data Export** - Export assessment history as PDF

