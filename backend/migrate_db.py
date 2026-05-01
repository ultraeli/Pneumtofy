#!/usr/bin/env python
"""
Database migration script to add role column to users table
"""
import sqlite3
import sys

def migrate_database():
    """Add role column to users table"""
    db_path = 'instance/pneumtofy.db'
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if role column already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'role' in columns:
            print("Column 'role' already exists")
            conn.close()
            return True
        
        # Add role column with default value
        cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'guardian'")
        conn.commit()
        print("Successfully added 'role' column to users table")
        conn.close()
        return True
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return False

if __name__ == '__main__':
    success = migrate_database()
    sys.exit(0 if success else 1)
