#!/usr/bin/env python
"""
Add new symptom columns to tracked_assessments table if they don't exist.
"""
import sqlite3
import sys

DB_PATH = 'instance/pneumtofy.db'

def column_exists(cursor, table, column_name):
    cursor.execute(f"PRAGMA table_info({table})")
    cols = [r[1] for r in cursor.fetchall()]
    return column_name in cols

def migrate():
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        additions = []
        if not column_exists(cur, 'tracked_assessments', 'respiratory_rate'):
            additions.append("ALTER TABLE tracked_assessments ADD COLUMN respiratory_rate INTEGER")
        if not column_exists(cur, 'tracked_assessments', 'convulsions'):
            additions.append("ALTER TABLE tracked_assessments ADD COLUMN convulsions INTEGER DEFAULT 0")
        if not column_exists(cur, 'tracked_assessments', 'cyanosis'):
            additions.append("ALTER TABLE tracked_assessments ADD COLUMN cyanosis INTEGER DEFAULT 0")
        if not column_exists(cur, 'tracked_assessments', 'unconscious'):
            additions.append("ALTER TABLE tracked_assessments ADD COLUMN unconscious INTEGER DEFAULT 0")

        if not additions:
            print('No schema changes required')
            conn.close()
            return True

        for stmt in additions:
            print('Executing:', stmt)
            cur.execute(stmt)

        conn.commit()
        conn.close()
        print('Migration completed successfully')
        return True

    except sqlite3.Error as e:
        print('SQLite error:', e)
        return False

if __name__ == '__main__':
    ok = migrate()
    sys.exit(0 if ok else 1)
