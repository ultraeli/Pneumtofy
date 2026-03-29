#!/bin/bash

# Pneumtofy Fast MVP - Quick Start Script for macOS/Linux

echo ""
echo "============================================"
echo "  Pneumtofy - Pneumonia Tracker MVP Setup"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed. Please install from https://www.python.org/"
    exit 1
fi

echo "[1/4] Installing Python backend dependencies..."
cd backend

# Clear pip cache
python3 -m pip cache purge 2>/dev/null

# Upgrade pip and install base tools
python3 -m pip install --upgrade pip setuptools wheel >/dev/null 2>&1

# Install requirements (no PostgreSQL for MVP - using JSON storage)
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install Python dependencies"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Make sure Python 3.7+ is installed"
    echo "  2. Try: python3 -m pip install --upgrade pip"
    echo "  3. Check your internet connection"
    echo ""
    cd ..
    exit 1
fi
echo "✓ Python dependencies installed successfully"
cd ..

echo ""
echo "[2/4] Installing React frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install Node.js dependencies"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Make sure Node.js 14+ is installed"
    echo "  2. Try: npm cache clean --force"
    echo "  3. Check your internet connection"
    echo ""
    cd ..
    exit 1
fi
echo "✓ React dependencies installed successfully"
cd ..

echo ""
echo "============================================"
echo "   Setup Complete! ✓"
echo "============================================"
echo ""
echo "To run the application:"
echo ""
echo "Terminal 1 - Start Backend:"
echo "  cd backend"
echo "  python3 app.py"
echo ""
echo "Terminal 2 - Start Frontend:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "Note: This MVP uses JSON file storage."
echo "For PostgreSQL: read requirements-db.txt"
echo ""
echo "============================================"
echo ""
