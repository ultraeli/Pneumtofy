"""
Pneumtofy Backend API - With Authentication
Flask application for symptom assessment, tracking, and user management
"""
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from datetime import datetime, timedelta
import json
import os
from functools import wraps

# Import database and models
from database import db, init_db
from models_auth import User, TrackedAssessment
from decision_logic import PneumoniaAssessment
from models import InfoContent

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'sqlite:///pneumtofy.db'  # Local SQLite database
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SECURE'] = False  # Set True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

# Initialize extensions
CORS(app, supports_credentials=True)
init_db(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    """Load user by ID for Flask-Login"""
    return User.query.get(int(user_id))


# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """
    Register a new user
    
    Expected JSON:
    {
        "username": "string",
        "email": "string@example.com",
        "password": "string",
        "guardianname": "string (optional)",
        "phone": "string (optional)"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Username, email, and password are required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            guardianname=data.get('guardianname'),
            phone=data.get('phone'),
            childrens_ages=data.get('childrens_ages')  # JSON string
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Log them in
        login_user(user)
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in register: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Login user - can use username or email
    
    Expected JSON:
    {
        "username": "string (username or email)",
        "password": "string"
    }
    """
    try:
        data = request.get_json()
        
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username/email and password required'}), 400
        
        # Find user by username OR email
        user_input = data['username']
        user = User.query.filter(
            (User.username == user_input) | (User.email == user_input)
        ).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid username/email or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is inactive'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create session
        login_user(user, remember=data.get('remember', False))
        session.permanent = True
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Error in login: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    """Logout current user"""
    try:
        logout_user()
        return jsonify({'success': True, 'message': 'Logged out successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current logged-in user info"""
    try:
        return jsonify(current_user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/update', methods=['PUT'])
@login_required
def update_profile():
    """Update user profile"""
    try:
        data = request.get_json()
        
        # Update allowed fields
        if 'guardianname' in data:
            current_user.guardianname = data['guardianname']
        if 'phone' in data:
            current_user.phone = data['phone']
        if 'childrens_ages' in data:
            current_user.childrens_ages = data['childrens_ages']
        
        # Handle email update (check for duplicates)
        if 'email' in data and data['email'] != current_user.email:
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email already in use'}), 400
            current_user.email = data['email']
        
        # Handle password change
        if 'new_password' in data:
            if not data.get('old_password'):
                return jsonify({'error': 'Current password required'}), 400
            if not current_user.check_password(data['old_password']):
                return jsonify({'error': 'Current password is incorrect'}), 401
            current_user.set_password(data['new_password'])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated',
            'user': current_user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in update_profile: {e}")
        return jsonify({'error': str(e)}), 500


# ============================================================================
# ASSESSMENT ROUTES (Updated for logged-in users)
# ============================================================================

@app.route('/api/assess', methods=['POST'])
def assess_symptoms():
    """
    Assess symptoms (works with or without login)
    
    Expected JSON:
    {
        "age_months": int,
        "cough_duration": int,
        ... (all symptom fields)
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required = ['age_months', 'cough_duration']
        if not all(field in data for field in required):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Extract parameters
        age_months = int(data.get('age_months', 0) or 0)
        cough_duration = int(data.get('cough_duration', 0) or 0)
        respiratory_rate = data.get('respiratory_rate', None)
        fast_breathing = data.get('fast_breathing', False)
        fever = data.get('fever', False)
        fever_temp = float(data.get('fever_temperature', 0) or 0) if data.get('fever_temperature') else 0
        difficulty_breathing = data.get('difficulty_breathing', False)
        chest_indrawing = data.get('chest_indrawing', False)
        stridor = data.get('stridor', False)
        lethargy = data.get('lethargy', False)
        unable_to_drink = data.get('unable_to_drink', False)
        convulsions = data.get('convulsions', False)
        cyanosis = data.get('cyanosis', False)
        unconscious = data.get('unconscious', False)
        vomiting = data.get('vomiting', False)
        diarrhea = data.get('diarrhea', False)
        previous_episodes = int(data.get('previous_episodes', 0) or 0)
        
        # Perform assessment
        result = PneumoniaAssessment.assess_symptoms(
            age_months, cough_duration, respiratory_rate, fast_breathing, fever, fever_temp,
            difficulty_breathing, chest_indrawing, stridor, lethargy, unable_to_drink,
            convulsions, cyanosis, unconscious, vomiting, diarrhea, previous_episodes
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


# ============================================================================
# TRACKER ROUTES (Protected - requires login)
# ============================================================================

@app.route('/api/tracker', methods=['GET'])
@login_required
def get_tracker():
    """Get all tracker entries for current user"""
    try:
        assessments = TrackedAssessment.query.filter_by(user_id=current_user.id).order_by(
            TrackedAssessment.timestamp.desc()
        ).all()
        
        return jsonify({
            'entries': [a.to_dict() for a in assessments]
        }), 200
    except Exception as e:
        print(f"Error in get_tracker: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/tracker', methods=['POST'])
@login_required
def add_tracker_entry():
    """Add a new tracker entry for logged-in user"""
    try:
        data = request.get_json()
        
        # Parse timestamp if provided, otherwise use current time
        timestamp = datetime.utcnow()
        if data.get('timestamp'):
            try:
                # Handle ISO format timestamps correctly
                timestamp_str = data.get('timestamp')
                # Remove 'Z' suffix if present, then parse
                if timestamp_str.endswith('Z'):
                    timestamp_str = timestamp_str[:-1]
                # Split on milliseconds
                if '.' in timestamp_str:
                    timestamp_str = timestamp_str.split('.')[0]
                # Parse and ensure it's treated as UTC
                timestamp = datetime.fromisoformat(timestamp_str)
            except Exception as parse_err:
                print(f"Error parsing timestamp '{data.get('timestamp')}': {parse_err}")
                timestamp = datetime.utcnow()
        
        # Create new assessment entry
            assessment = TrackedAssessment(
            user_id=current_user.id,
            age_months=int(data.get('age_months', 0)),
            cough_duration=int(data.get('cough_duration', 0)) if data.get('cough_duration') else None,
            respiratory_rate=data.get('respiratory_rate', None),
            fast_breathing=data.get('fast_breathing', False),
            fever=data.get('fever', False),
            fever_temperature=float(data.get('fever_temperature', 0)) if data.get('fever_temperature') else None,
            difficulty_breathing=data.get('difficulty_breathing', False),
            chest_indrawing=data.get('chest_indrawing', False),
            stridor=data.get('stridor', False),
            convulsions=data.get('convulsions', False),
            cyanosis=data.get('cyanosis', False),
            unconscious=data.get('unconscious', False),
            lethargy=data.get('lethargy', False),
            unable_to_drink=data.get('unable_to_drink', False),
            vomiting=data.get('vomiting', False),
            diarrhea=data.get('diarrhea', False),
            previous_episodes=int(data.get('previous_episodes', 0)) if data.get('previous_episodes') else 0,
            assessment=data.get('assessment', ''),
            recommendation=data.get('recommendation', ''),
            guidance=json.dumps(data.get('guidance', [])),
            home_remedies=json.dumps(data.get('home_remedies', [])),
            timestamp=timestamp
        )
        
        db.session.add(assessment)
        db.session.commit()
        
        return jsonify(assessment.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in add_tracker_entry: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/tracker/<int:entry_id>', methods=['DELETE'])
@login_required
def delete_tracker_entry(entry_id):
    """Delete a tracker entry (only if user owns it)"""
    try:
        assessment = TrackedAssessment.query.get(entry_id)
        
        if not assessment:
            return jsonify({'error': 'Entry not found'}), 404
        
        if assessment.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        db.session.delete(assessment)
        db.session.commit()
        
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error in delete_tracker_entry: {e}")
        return jsonify({'error': str(e)}), 500


# ============================================================================
# ADMIN ROUTES
# ============================================================================

def admin_required(f):
    """Decorator to check if user is admin"""
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if not current_user or current_user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function


@app.route('/api/admin/stats', methods=['GET'])
@admin_required
def admin_stats():
    """Get admin dashboard statistics"""
    try:
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        total_assessments = TrackedAssessment.query.count()
        
        # Get users with assessments (active guardians)
        users_with_assessments = db.session.query(User).join(
            TrackedAssessment
        ).distinct().count()
        
        # Get assessments from last 7 days
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        recent_assessments = TrackedAssessment.query.filter(
            TrackedAssessment.timestamp >= seven_days_ago
        ).count()
        
        return jsonify({
            'total_users': total_users,
            'active_users': active_users,
            'total_assessments': total_assessments,
            'users_with_assessments': users_with_assessments,
            'recent_assessments': recent_assessments,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        print(f"Error in admin_stats: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/users', methods=['GET'])
@admin_required
def admin_get_users():
    """Get all users with pagination and search"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        search = request.args.get('search', '', type=str)
        
        query = User.query
        
        # Apply search filter
        if search:
            query = query.filter(
                (User.username.ilike(f'%{search}%')) |
                (User.email.ilike(f'%{search}%')) |
                (User.guardianname.ilike(f'%{search}%'))
            )
        
        # Paginate
        paginated = query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=limit, error_out=False
        )
        
        users_data = [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'guardianname': user.guardianname,
                'phone': user.phone,
                'is_active': user.is_active,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'last_login': user.last_login.isoformat() if user.last_login else None,
                'assessment_count': len(user.tracked_assessments)
            }
            for user in paginated.items
        ]
        
        return jsonify({
            'users': users_data,
            'total': paginated.total,
            'pages': paginated.pages,
            'current_page': page
        }), 200
    except Exception as e:
        print(f"Error in admin_get_users: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/assessments', methods=['GET'])
@admin_required
def admin_get_assessments():
    """Get all assessments with pagination"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        user_id = request.args.get('user_id', None, type=int)
        
        query = TrackedAssessment.query
        
        # Filter by user if specified
        if user_id:
            query = query.filter_by(user_id=user_id)
        
        # Paginate
        paginated = query.order_by(TrackedAssessment.timestamp.desc()).paginate(
            page=page, per_page=limit, error_out=False
        )
        
        assessments_data = [
            {
                'id': assessment.id,
                'user_id': assessment.user_id,
                'username': assessment.user.username,
                'age_months': assessment.age_months,
                'assessment': assessment.assessment,
                'timestamp': assessment.timestamp.isoformat() if assessment.timestamp else None
            }
            for assessment in paginated.items
        ]
        
        return jsonify({
            'assessments': assessments_data,
            'total': paginated.total,
            'pages': paginated.pages,
            'current_page': page
        }), 200
    except Exception as e:
        print(f"Error in admin_get_assessments: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/recent-assessments', methods=['GET'])
@admin_required
def admin_get_recent_assessments():
    """Get recent assessments for notifications"""
    try:
        # Get last 5 assessments
        recent = TrackedAssessment.query.order_by(TrackedAssessment.timestamp.desc()).limit(5).all()
        
        assessments_data = [
            {
                'id': assessment.id,
                'guardian_username': assessment.user.username,
                'age': assessment.age_months,
                'assessment_type': assessment.assessment,
                'created_at': assessment.timestamp.isoformat() if assessment.timestamp else None
            }
            for assessment in recent
        ]
        
        return jsonify({'assessments': assessments_data}), 200
    except Exception as e:
        print(f"Error in admin_get_recent_assessments: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def admin_delete_user(user_id):
    """Deactivate a user (soft delete)"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Soft delete - mark as inactive
        user.is_active = False
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'User deactivated'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error in admin_delete_user: {e}")
        return jsonify({'error': str(e)}), 500


# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)

