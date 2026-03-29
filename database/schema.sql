-- Database Schema for Pneumtofy
-- PostgreSQL schema for storing tracker entries and information

-- Tracker entries table
CREATE TABLE IF NOT EXISTS tracker_entries (
    id SERIAL PRIMARY KEY,
    age_months INTEGER NOT NULL,
    cough_duration INTEGER,
    fast_breathing BOOLEAN DEFAULT FALSE,
    fever BOOLEAN DEFAULT FALSE,
    fever_temperature DECIMAL(5,2),
    difficulty_breathing BOOLEAN DEFAULT FALSE,
    chest_indrawing BOOLEAN DEFAULT FALSE,
    stridor BOOLEAN DEFAULT FALSE,
    lethargy BOOLEAN DEFAULT FALSE,
    unable_to_drink BOOLEAN DEFAULT FALSE,
    vomiting BOOLEAN DEFAULT FALSE,
    diarrhea BOOLEAN DEFAULT FALSE,
    previous_episodes INTEGER DEFAULT 0,
    assessment VARCHAR(100) NOT NULL,
    recommendation TEXT,
    guidance JSONB,
    home_remedies JSONB,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Information content table
CREATE TABLE IF NOT EXISTS information_content (
    id SERIAL PRIMARY KEY,
    section VARCHAR(50) NOT NULL UNIQUE,
    content JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tracker_timestamp ON tracker_entries(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tracker_assessment ON tracker_entries(assessment);

-- Insert initial information content
INSERT INTO information_content (section, content) VALUES
(
    'symptoms',
    '[
        "Cough lasting more than 3 weeks or worsening",
        "Fever (often above 38.5°C)",
        "Fast breathing (tachypnea)",
        "Difficulty breathing",
        "Chest wall indrawing",
        "Flaring of nostrils",
        "Stridor (noisy breathing)",
        "Fatigue and weakness",
        "Refusal to eat or drink",
        "Vomiting"
    ]'
),
(
    'risk_factors',
    '[
        "Age under 5 years (highest risk under 2)",
        "Malnutrition",
        "Not exclusively breastfed (in infants)",
        "Incomplete immunization",
        "Exposure to air pollution and indoor smoke",
        "Low birth weight",
        "Previous pneumonia episodes",
        "HIV infection",
        "Measles"
    ]'
),
(
    'prevention',
    '[
        "Ensure exclusive breastfeeding for first 6 months",
        "Complete immunization schedule including PCV vaccine",
        "Proper nutrition and vitamin A supplementation",
        "Avoid exposure to air pollution and smoke",
        "Maintain good hand hygiene practices",
        "Ensure access to clean water and sanitation",
        "Early identification and treatment of malnutrition"
    ]'
)
ON CONFLICT (section) DO NOTHING;
