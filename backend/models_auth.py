"""
User model for authentication
"""
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from database import db

class User(UserMixin, db.Model):
    """User model for Pneumtofy"""
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    guardianname = db.Column(db.String(120), nullable=True)  # Parent/Guardian name
    relationship = db.Column(db.String(50), nullable=True)   # e.g., "Parent", "Guardian"
    phone = db.Column(db.String(20), nullable=True)
    childrens_ages = db.Column(db.String(255), nullable=True)  # JSON string of ages
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    tracked_assessments = db.relationship('TrackedAssessment', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert to dictionary for JSON"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'guardianname': self.guardianname,
            'relationship': self.relationship,
            'phone': self.phone,
            'childrens_ages': self.childrens_ages,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }


class TrackedAssessment(db.Model):
    """Tracked symptom assessments linked to users"""
    
    __tablename__ = 'tracked_assessments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    age_months = db.Column(db.Integer, nullable=False)
    cough_duration = db.Column(db.Integer)
    fast_breathing = db.Column(db.Boolean, default=False)
    fever = db.Column(db.Boolean, default=False)
    fever_temperature = db.Column(db.Float)
    difficulty_breathing = db.Column(db.Boolean, default=False)
    chest_indrawing = db.Column(db.Boolean, default=False)
    stridor = db.Column(db.Boolean, default=False)
    lethargy = db.Column(db.Boolean, default=False)
    unable_to_drink = db.Column(db.Boolean, default=False)
    vomiting = db.Column(db.Boolean, default=False)
    diarrhea = db.Column(db.Boolean, default=False)
    previous_episodes = db.Column(db.Integer, default=0)
    assessment = db.Column(db.String(100), nullable=False)
    recommendation = db.Column(db.Text)
    guidance = db.Column(db.Text)  # JSON string
    home_remedies = db.Column(db.Text)  # JSON string
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        import json
        return {
            'id': self.id,
            'age_months': self.age_months,
            'cough_duration': self.cough_duration,
            'fast_breathing': self.fast_breathing,
            'fever': self.fever,
            'fever_temperature': self.fever_temperature,
            'difficulty_breathing': self.difficulty_breathing,
            'chest_indrawing': self.chest_indrawing,
            'stridor': self.stridor,
            'lethargy': self.lethargy,
            'unable_to_drink': self.unable_to_drink,
            'vomiting': self.vomiting,
            'diarrhea': self.diarrhea,
            'previous_episodes': self.previous_episodes,
            'assessment': self.assessment,
            'recommendation': self.recommendation,
            'guidance': json.loads(self.guidance) if self.guidance else [],
            'home_remedies': json.loads(self.home_remedies) if self.home_remedies else [],
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        }
