# Pneumtofy - Troubleshooting Guide

This guide reflects the current React/Flask site with authentication, SQLite-backed tracker history, the article-style Info Hub, and mobile navigation.

## Backend Issues

### Backend will not start

Check that you are in the backend folder and dependencies are installed:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

If port 5000 is already in use on Windows:

```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database errors

The app uses SQLite through SQLAlchemy. If the schema is stale during local development, stop the backend, remove the local database, and restart:

```bash
cd backend
del instance\pneumtofy.db
python app.py
```

Only do this for local development because it deletes registered users and saved assessments.

### Health check fails

Verify the backend is running:

```bash
curl http://localhost:5000/health
```

A working backend should return a JSON health response.

## Frontend Issues

### Frontend will not start

```bash
cd frontend
npm install
npm start
```

If port 3000 is already in use on Windows:

```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Blank page or missing module errors

Reinstall dependencies:

```bash
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
npm start
```

## Login and Session Issues

### Login fails on the same computer

Check:
- Backend is running at `http://localhost:5000`
- Frontend is running at `http://localhost:3000`
- You registered an account first
- Cookies and localStorage are enabled
- You are using the correct username/email and password

### Login fails from a phone on the same Wi-Fi

Opening `http://192.168.x.x:3000` from a phone can load the frontend, but the phone cannot use the computer's `localhost`. The current frontend API calls target `http://localhost:5000`, which means "the phone itself" when opened on a phone.

For phone testing, the backend must listen on the network and the frontend API base URL must point to the computer's LAN IP, for example `http://192.168.x.x:5000`. Firewall settings may also need to allow port 5000.

### Tracker redirects to login

The tracker is protected. Log in again, then open `/tracker`. If it still redirects, check the browser console and confirm `/api/auth/me` is returning the current user.

## Assessment and Tracker Issues

### Assessment does not save after login

The guest-to-user flow stores a pending assessment before redirecting to login/register. Check:
- localStorage is enabled
- You are not using a private browsing mode that blocks storage
- Backend is running
- The Network tab shows a successful `POST /api/tracker`

### Tracker filters look wrong

The current tracker filters are:
- All Assessments
- Seek Immediate Care
- Pneumonia / Amoxicillin
- Simple Cough or Cold
- Observe & Manage

If old labels such as only "Mild", "Moderate", or "Critical" appear, hard refresh the browser and confirm `frontend/src/components/Tracker.jsx` is the version being served.

### Date and time look wrong

The tracker uses browser timezone formatting. Check your system timezone and test in the browser console:

```javascript
new Date().toLocaleString()
Intl.DateTimeFormat().resolvedOptions().timeZone
```

## Info Hub or Layout Issues

### Info sections are not full browser width

The Info route should use the full-width layout in `frontend/src/App.jsx`, and the article styling is in `frontend/src/styles/Info.css`. Hard refresh after CSS changes.

### Mobile navigation is missing

The current navigation includes a hamburger menu on mobile widths. If it does not appear, check:
- `frontend/src/components/Navigation.jsx`
- `frontend/src/styles/Navigation.css`
- Browser cache after restarting `npm start`

## Build Notes

`npm run build` creates optimized production files in `frontend/build`. It does not modify source files such as `.jsx` or `.css`, but it does create or replace build output.

## Manual Smoke Test

1. Start backend and frontend.
2. Open `http://localhost:3000`.
3. Register or log in.
4. Submit a simple cough assessment and confirm `SIMPLE COUGH or COLD`.
5. Submit cough plus fast breathing and confirm `PNEUMONIA - Treat with Amoxicillin`.
6. Submit a danger sign such as chest indrawing and confirm `SEEK IMMEDIATE MEDICAL CARE`.
7. Save an assessment and confirm it appears in Tracker.
8. Test tracker filters and delete.
9. Open `/info` and confirm the full-width article layout.
10. Resize to mobile width and confirm the hamburger menu opens.

