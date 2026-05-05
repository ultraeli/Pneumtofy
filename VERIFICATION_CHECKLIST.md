# Pneumtofy - Verification Checklist

Use this checklist to verify the current site behavior after changes.

## Backend

- [ ] `python app.py` starts the Flask backend on `http://localhost:5000`
- [ ] `GET /health` returns a JSON health response
- [ ] `POST /api/assess` returns one of the current assessment outcomes
- [ ] Auth routes work: register, login, logout, current user, update profile
- [ ] Tracker routes require login
- [ ] Saved assessments are linked to the logged-in user only
- [ ] SQLite database is created through SQLAlchemy

## Frontend

- [ ] `npm start` starts the React frontend on `http://localhost:3000`
- [ ] Home page loads with centered feature card icons and text
- [ ] Symptom form submits successfully
- [ ] Results page displays guidance, warning text, and save controls
- [ ] Info Hub uses full-width article styling
- [ ] Tracker page is protected by login
- [ ] Desktop navigation shows page links and auth actions
- [ ] Mobile navigation shows and opens the hamburger menu

## Current Assessment Outcomes

- [ ] Cough for 2 days with no danger signs returns `SIMPLE COUGH or COLD`
- [ ] Cough plus age-based fast breathing returns `PNEUMONIA - Treat with Amoxicillin`
- [ ] Chest indrawing returns `SEEK IMMEDIATE MEDICAL CARE`
- [ ] Mild symptoms without pneumonia indicators return `OBSERVE & MANAGE AT HOME`

## Tracker

- [ ] Logged-in users can save assessments
- [ ] Logged-out users are prompted to login/register before saving
- [ ] Pending guest assessment is saved after login/register
- [ ] Date and entry time display beside each other
- [ ] Tracker filters include:
  - All Assessments
  - Seek Immediate Care
  - Pneumonia / Amoxicillin
  - Simple Cough or Cold
  - Observe & Manage
- [ ] Delete removes only the selected assessment

## Info Hub

- [ ] `/info` is full browser width
- [ ] The page begins with the educational "What is Pneumonia?" section
- [ ] The global childhood pneumonia burden text appears below the second paragraph
- [ ] Old card sections for Symptoms in Children, Risk Factors, and Prevention are replaced
- [ ] Article sections cover access to care, community response, treatment, and prevention
- [ ] Source/reference area remains visible

## Authentication

- [ ] Register creates an account and logs in
- [ ] Login accepts username or email
- [ ] Logout clears the session
- [ ] Tracker redirects logged-out users to login
- [ ] User menu/auth controls work on desktop and mobile navigation

## Local Network

- [ ] Desktop local testing works at `http://localhost:3000`
- [ ] Phone testing has a configured backend LAN URL if using `http://192.168.x.x:3000`
- [ ] Firewall allows backend port 5000 if testing from another device

## Build

- [ ] User runs `npm run build` manually when needed
- [ ] Build output is created in `frontend/build`
- [ ] Source files are not changed by the build command

