-- PostgreSQL schema for the current Pneumtofy application
-- Updated to match backend/models_auth.py
--
-- Current SQLAlchemy models:
--   users
--   tracked_assessments
--   admin_invites
--
-- Note:
--   The visible Info Hub is currently frontend-driven in frontend/src/components/Info.jsx.
--   /api/info returns static content from backend/models.py, not from this database.

BEGIN;

-- ============================================================================
-- Users
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    guardianname VARCHAR(120),
    relationship VARCHAR(50),
    phone VARCHAR(20),
    childrens_ages VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITHOUT TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) NOT NULL DEFAULT 'guardian',
    CONSTRAINT chk_users_role CHECK (role IN ('guardian', 'admin'))
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ============================================================================
-- Tracked assessments
-- ============================================================================

CREATE TABLE IF NOT EXISTS tracked_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    age_months INTEGER NOT NULL,
    cough_duration INTEGER,
    respiratory_rate INTEGER,
    fast_breathing BOOLEAN DEFAULT FALSE,
    fever BOOLEAN DEFAULT FALSE,
    fever_temperature DOUBLE PRECISION,
    difficulty_breathing BOOLEAN DEFAULT FALSE,
    chest_indrawing BOOLEAN DEFAULT FALSE,
    stridor BOOLEAN DEFAULT FALSE,
    convulsions BOOLEAN DEFAULT FALSE,
    cyanosis BOOLEAN DEFAULT FALSE,
    unconscious BOOLEAN DEFAULT FALSE,
    lethargy BOOLEAN DEFAULT FALSE,
    unable_to_drink BOOLEAN DEFAULT FALSE,
    vomiting BOOLEAN DEFAULT FALSE,
    diarrhea BOOLEAN DEFAULT FALSE,
    previous_episodes INTEGER DEFAULT 0,

    assessment VARCHAR(100) NOT NULL,
    recommendation TEXT,
    guidance TEXT,
    home_remedies TEXT,
    timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tracked_assessments_user_id ON tracked_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_assessments_timestamp ON tracked_assessments(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tracked_assessments_assessment ON tracked_assessments(assessment);
CREATE INDEX IF NOT EXISTS idx_tracked_assessments_user_timestamp
    ON tracked_assessments(user_id, timestamp DESC);

-- ============================================================================
-- Admin invitation tokens
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_invites (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    invited_email VARCHAR(120) NOT NULL,
    invited_name VARCHAR(120),
    created_by_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accepted_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITHOUT TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    CONSTRAINT chk_admin_invites_status CHECK (status IN ('pending', 'accepted', 'expired'))
);

CREATE INDEX IF NOT EXISTS idx_admin_invites_token ON admin_invites(token);
CREATE INDEX IF NOT EXISTS idx_admin_invites_invited_email ON admin_invites(invited_email);
CREATE INDEX IF NOT EXISTS idx_admin_invites_created_at ON admin_invites(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_invites_status ON admin_invites(status);
CREATE INDEX IF NOT EXISTS idx_admin_invites_created_by_id ON admin_invites(created_by_id);
CREATE INDEX IF NOT EXISTS idx_admin_invites_accepted_by_id ON admin_invites(accepted_by_id);

-- ============================================================================
-- Optional legacy/support table
-- ============================================================================
--
-- This table is not used by the current visible Info Hub, but it is kept as a
-- safe optional table for teams that want to move /api/info content into the DB
-- later without reintroducing the old tracker schema.

CREATE TABLE IF NOT EXISTS information_content (
    id SERIAL PRIMARY KEY,
    section VARCHAR(50) NOT NULL UNIQUE,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_information_content_section ON information_content(section);

COMMIT;
