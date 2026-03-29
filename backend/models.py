"""
Database models for Pneumtofy
"""
from datetime import datetime

class TrackerEntry:
    """Represents a symptom tracking entry"""
    
    def __init__(self, symptoms, assessment, recommendation, guidance=None, 
                 home_remedies=None, timestamp=None, entry_id=None):
        self.id = entry_id
        self.symptoms = symptoms
        self.assessment = assessment
        self.recommendation = recommendation
        self.guidance = guidance or []
        self.home_remedies = home_remedies or []
        self.timestamp = timestamp or datetime.now().isoformat()
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'symptoms': self.symptoms,
            'assessment': self.assessment,
            'recommendation': self.recommendation,
            'guidance': self.guidance,
            'home_remedies': self.home_remedies,
            'timestamp': self.timestamp
        }


class InfoContent:
    """Information content about pneumonia"""
    
    ABOUT = """Pneumonia is an infection that inflames the air sacs (alveoli) in one or both lungs. 
    The air sacs may fill with fluid or pus, causing cough with phlegm or pus, fever, chills, 
    and difficulty breathing. Pneumonia can be caused by bacteria, viruses, or fungi. It is a 
    significant cause of morbidity and mortality in children under 5 years of age, particularly 
    in low and middle-income countries."""
    
    SYMPTOMS = [
        'Cough lasting more than 3 weeks or worsening',
        'Fever (often above 38.5°C)',
        'Fast breathing (tachypnea)',
        'Difficulty breathing',
        'Chest wall indrawing',
        'Flaring of nostrils',
        'Stridor (noisy breathing)',
        'Fatigue and weakness',
        'Refusal to eat or drink',
        'Vomiting',
    ]
    
    RISK_FACTORS = [
        'Age under 5 years (highest risk under 2)',
        'Malnutrition',
        'Not exclusively breastfed (in infants)',
        'Incomplete immunization',
        'Exposure to air pollution and indoor smoke',
        'Low birth weight',
        'Previous pneumonia episodes',
        'HIV infection',
        'Measles',
    ]
    
    SEEK_MEDICAL_CARE = [
        'Chest wall indrawing (any degree)',
        'Stridor in a calm child',
        'Severe respiratory distress',
        'Unable to drink or breastfeed',
        'Persistent high fever (above 39°C)',
        'Signs of severe illness (lethargy, unconsciousness)',
        'Cyanosis (bluish discoloration)',
    ]
    
    PREVENTION = [
        'Ensure exclusive breastfeeding for first 6 months',
        'Complete immunization schedule including PCV vaccine',
        'Proper nutrition and vitamin A supplementation',
        'Avoid exposure to air pollution and smoke',
        'Maintain good hand hygiene practices',
        'Ensure access to clean water and sanitation',
        'Early identification and treatment of malnutrition',
    ]
    
    @staticmethod
    def get_all():
        """Get all information content"""
        return {
            'about': InfoContent.ABOUT,
            'symptoms': InfoContent.SYMPTOMS,
            'risk_factors': InfoContent.RISK_FACTORS,
            'seek_medical_care': InfoContent.SEEK_MEDICAL_CARE,
            'prevention': InfoContent.PREVENTION,
        }
