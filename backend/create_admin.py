"""
Script to create or update an admin user for Pneumtofy
Run this script from the backend directory: python create_admin.py
"""
import os
import sys
from datetime import datetime

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import db, init_db
from models_auth import User
from app import app

def create_admin_user(username, email, password, guardian_name=None):
    """Create a new admin user"""
    with app.app_context():
        # Check if user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            print(f"❌ User '{username}' already exists!")
            return False
        
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            print(f"❌ Email '{email}' already registered!")
            return False
        
        # Create new admin user
        admin_user = User(
            username=username,
            email=email,
            guardianname=guardian_name or username,
            role='admin',
            is_active=True,
            created_at=datetime.utcnow()
        )
        admin_user.set_password(password)
        
        db.session.add(admin_user)
        db.session.commit()
        
        print(f"✅ Admin user created successfully!")
        print(f"   Username: {username}")
        print(f"   Email: {email}")
        print(f"   Role: admin")
        return True

def upgrade_user_to_admin(username):
    """Upgrade an existing user to admin"""
    with app.app_context():
        user = User.query.filter_by(username=username).first()
        if not user:
            print(f"❌ User '{username}' not found!")
            return False
        
        if user.role == 'admin':
            print(f"ℹ️  User '{username}' is already an admin!")
            return True
        
        user.role = 'admin'
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        print(f"✅ User '{username}' upgraded to admin!")
        print(f"   New role: admin")
        return True

def main():
    """Main function"""
    print("=" * 50)
    print("Pneumtofy Admin User Setup")
    print("=" * 50)
    print("\nOptions:")
    print("1. Create a new admin user")
    print("2. Upgrade existing user to admin")
    print("3. Exit")
    
    choice = input("\nSelect option (1-3): ").strip()
    
    if choice == '1':
        print("\n--- Create New Admin User ---")
        username = input("Username: ").strip()
        email = input("Email: ").strip()
        password = input("Password: ").strip()
        guardian_name = input("Guardian Name (optional, press Enter to skip): ").strip() or None
        
        if not username or not email or not password:
            print("❌ Username, email, and password are required!")
            return
        
        create_admin_user(username, email, password, guardian_name)
    
    elif choice == '2':
        print("\n--- Upgrade Existing User ---")
        username = input("Username: ").strip()
        
        if not username:
            print("❌ Username is required!")
            return
        
        upgrade_user_to_admin(username)
    
    elif choice == '3':
        print("Exiting...")
        return
    
    else:
        print("❌ Invalid option! Please select 1, 2, or 3.")

if __name__ == '__main__':
    main()
