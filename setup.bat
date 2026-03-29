@echo off
REM Pneumtofy Fast MVP - Quick Start Script for Windows

echo.
echo ============================================
echo   Pneumtofy - Pneumonia Tracker MVP Setup
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if errorlevel 1 (
    echo ERROR: Python is not installed. Please install Python from https://www.python.org/
    exit /b 1
)

echo [1/4] Installing Python backend dependencies...
echo.
cd backend

REM Clear pip cache to avoid build issues
python -m pip cache purge >nul 2>nul

REM Install requirements (no PostgreSQL for MVP - using JSON storage)
python -m pip install --upgrade pip setuptools wheel >nul 2>nul
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install Python dependencies
    echo.
    echo Troubleshooting:
    echo   1. Make sure Python 3.7+ is installed
    echo   2. Try: python -m pip install --upgrade pip
    echo   3. Check your internet connection
    echo.
    cd ..
    exit /b 1
)
echo ✓ Python dependencies installed successfully
cd ..

echo.
echo [2/4] Installing React frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install Node.js dependencies
    echo.
    echo Troubleshooting:
    echo   1. Make sure Node.js 14+ is installed
    echo   2. Try: npm cache clean --force
    echo   3. Check your internet connection
    echo.
    cd ..
    exit /b 1
)
echo ✓ React dependencies installed successfully
cd ..

echo.
echo ============================================
echo   Setup Complete! ✓
echo ============================================
echo.
echo To run the application:
echo.
echo Terminal 1 - Start Backend:
echo   cd backend
echo   python app.py
echo.
echo Terminal 2 - Start Frontend:
echo   cd frontend
echo   npm start
echo.
echo The application will be available at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo Note: This MVP uses JSON file storage.
echo For PostgreSQL: read requirements-db.txt
echo.
echo ============================================
echo.
