"""
Pneumtofy Backend API
Flask application for symptom assessment and tracking
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os
from decision_logic import PneumoniaAssessment
from models import TrackerEntry, InfoContent

app = Flask(__name__)
CORS(app)

# In-memory storage for Fast MVP (can be replaced with database)
tracker_entries = []
entry_counter = 1

# Load or create data directory
DATA_DIR = 'data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

TRACKER_FILE = os.path.join(DATA_DIR, 'tracker.json')


def load_tracker_data():
    """Load tracker data from file"""
    global tracker_entries, entry_counter
    if os.path.exists(TRACKER_FILE):
        try:
            with open(TRACKER_FILE, 'r') as f:
                data = json.load(f)
                tracker_entries = data.get('entries', [])
                entry_counter = data.get('counter', 1)
        except Exception as e:
            print(f"Error loading tracker data: {e}")
            tracker_entries = []
            entry_counter = 1


def save_tracker_data():
    """Save tracker data to file"""
    try:
        with open(TRACKER_FILE, 'w') as f:
            json.dump({
                'entries': tracker_entries,
                'counter': entry_counter
            }, f, indent=2)
    except Exception as e:
        print(f"Error saving tracker data: {e}")


# Load data on startup
load_tracker_data()


@app.route('/api/assess', methods=['POST'])
def assess_symptoms():
    """
    Assess symptoms and return recommendation
    
    Expected JSON:
    {
        "age_months": int,
        "cough_duration": int,
        "fast_breathing": bool,
        "fever": bool,
        "fever_temperature": float,
        "difficulty_breathing": bool,
        "chest_indrawing": bool,
        "stridor": bool,
        "lethargy": bool,
        "unable_to_drink": bool,
        "vomiting": bool,
        "diarrhea": bool,
        "previous_episodes": int
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required = ['age_months', 'cough_duration']
        if not all(field in data for field in required):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Extract parameters
        age_months = int(data.get('age_months', 0))
        cough_duration = int(data.get('cough_duration', 0))
        fast_breathing = data.get('fast_breathing', False)
        fever = data.get('fever', False)
        fever_temp = float(data.get('fever_temperature', 0)) if data.get('fever_temperature') else 0
        difficulty_breathing = data.get('difficulty_breathing', False)
        chest_indrawing = data.get('chest_indrawing', False)
        stridor = data.get('stridor', False)
        lethargy = data.get('lethargy', False)
        unable_to_drink = data.get('unable_to_drink', False)
        vomiting = data.get('vomiting', False)
        diarrhea = data.get('diarrhea', False)
        previous_episodes = int(data.get('previous_episodes', 0))
        
        # Perform assessment
        result = PneumoniaAssessment.assess_symptoms(
            age_months, cough_duration, fast_breathing, fever, fever_temp,
            difficulty_breathing, chest_indrawing, stridor, lethargy, 
            unable_to_drink, vomiting, diarrhea, previous_episodes
        )
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error in assess_symptoms: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/info', methods=['GET'])
def get_info():
    """Get pneumonia information content"""
    try:
        info = InfoContent.get_all()
        return jsonify(info), 200
    except Exception as e:
        print(f"Error in get_info: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/tracker', methods=['GET'])
def get_tracker():
    """Get all tracker entries"""
    try:
        return jsonify({'entries': tracker_entries}), 200
    except Exception as e:
        print(f"Error in get_tracker: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/tracker', methods=['POST'])
def add_tracker_entry():
    """Add a new tracker entry"""
    try:
        global entry_counter
        data = request.get_json()
        
        entry = {
            'id': entry_counter,
            'symptoms': data.get('symptoms', {}),
            'assessment': data.get('assessment', ''),
            'recommendation': data.get('recommendation', ''),
            'guidance': data.get('guidance', []),
            'home_remedies': data.get('home_remedies', []),
            'timestamp': data.get('timestamp', datetime.now().isoformat()),
        }
        
        tracker_entries.insert(0, entry)  # Most recent first
        entry_counter += 1
        save_tracker_data()
        
        return jsonify(entry), 201
        
    except Exception as e:
        print(f"Error in add_tracker_entry: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/tracker/<int:entry_id>', methods=['DELETE'])
def delete_tracker_entry(entry_id):
    """Delete a tracker entry"""
    try:
        global tracker_entries
        tracker_entries = [e for e in tracker_entries if e['id'] != entry_id]
        save_tracker_data()
        return jsonify({'success': True}), 200
    except Exception as e:
        print(f"Error in delete_tracker_entry: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
