"""
IMCI-Based Decision Logic for Pneumonia Assessment
Based on WHO Integrated Management of Childhood Illness guidelines
"""

class PneumoniaAssessment:
    """
    Assessment engine based on IMCI guidelines.
    Determines whether child needs:
    - Observation and home management
    - Seek medical attention immediately
    """
    
    @staticmethod
    def assess_symptoms(age_months, cough_duration, fast_breathing, fever, 
                        fever_temp, difficulty_breathing, chest_indrawing, 
                        stridor, lethargy, unable_to_drink, vomiting, 
                        diarrhea, previous_episodes):
        """
        Assess pneumonia risk based on IMCI guidelines.
        
        Args:
            age_months: Age of child in months
            cough_duration: Duration of cough in days
            fast_breathing: Boolean - presence of tachypnea
            fever: Boolean - presence of fever
            fever_temp: Temperature in Celsius
            difficulty_breathing: Boolean - dyspnea
            chest_indrawing: Boolean - chest wall indrawing (CRITICAL)
            stridor: Boolean - stridor (CRITICAL)
            lethargy: Boolean - lethargy/unusual sleepiness
            unable_to_drink: Boolean - unable to drink (CRITICAL)
            vomiting: Boolean - vomiting
            diarrhea: Boolean - diarrhea
            previous_episodes: Number of previous pneumonia episodes
        
        Returns:
            dict with assessment, recommendation, guidance, remedies, warnings
        """
        
        # CRITICAL SIGNS - Immediate referral needed
        critical_signs = []
        
        if chest_indrawing:
            critical_signs.append("Chest wall indrawing")
        if stridor and not (age_months < 2):  # Stridor in calm child
            critical_signs.append("Stridor")
        if lethargy:
            critical_signs.append("Lethargy")
        if unable_to_drink:
            critical_signs.append("Unable to drink")
        
        if critical_signs:
            return {
                'assessment': 'SEEK IMMEDIATE MEDICAL CARE',
                'risk_level': 'CRITICAL',
                'recommendation': f'URGENT: Your child shows signs of severe pneumonia ({", ".join(critical_signs)}). Seek medical attention immediately. This requires professional evaluation.',
                'guidance': [
                    'Take the child to the nearest hospital or health facility immediately',
                    'Do not delay - critical signs require urgent medical care',
                    'Bring this assessment with you',
                ],
                'home_remedies': [],
                'warning': 'CRITICAL: This assessment indicates potentially life-threatening conditions. Professional medical care is essential.',
                'symptoms': {
                    'age': age_months,
                    'cough_duration': cough_duration,
                    'fast_breathing': fast_breathing,
                    'fever': fever,
                    'critical_signs': ', '.join(critical_signs) if critical_signs else 'None'
                }
            }
        
        # PNEUMONIA INDICATORS - Based on IMCI chest wall indrawing or fast breathing
        pneumonia_indicators = []
        
        if fast_breathing:
            # Fast breathing thresholds by age (WHO IMCI)
            if age_months < 2:
                threshold = 50
            elif age_months < 12:
                threshold = 40
            else:
                threshold = 30
            pneumonia_indicators.append(f"Fast breathing (respiratory rate ≥ {threshold} per minute)")
        
        if cough_duration >= 7:
            pneumonia_indicators.append("Persistent cough (≥7 days)")
        
        if difficulty_breathing:
            pneumonia_indicators.append("Difficulty breathing")
        
        # IMCI assessment logic
        if pneumonia_indicators or fever:
            return {
                'assessment': 'OBSERVE & MANAGE AT HOME',
                'risk_level': 'MODERATE',
                'recommendation': 'Suspected pneumonia - Careful observation recommended. Monitor symptoms closely and seek medical care if they worsen.',
                'guidance': [
                    'Monitor your child\'s breathing rate and general condition daily',
                    'Ensure child stays hydrated',
                    'Maintain appropriate nutrition',
                    'Watch for worsening symptoms: increased breathing difficulty, persistent fever, refusal to eat/drink',
                    'If symptoms worsen or new symptoms appear, seek medical attention immediately',
                    'Already taking antibiotics? Continue as prescribed',
                ],
                'home_remedies': get_home_remedies_for_observation(),
                'warning': 'If your child shows any worsening or critical signs, seek medical care immediately.',
                'symptoms': {
                    'age': age_months,
                    'cough_duration': cough_duration,
                    'indicators': pneumonia_indicators
                }
            }
        
        # MILD SYMPTOMS - Safe for home management
        return {
            'assessment': 'OBSERVE & MANAGE AT HOME',
            'risk_level': 'MILD',
            'recommendation': 'No immediate signs of pneumonia detected. Safe to manage at home with observation.',
            'guidance': [
                'Continue with normal caregiving',
                'Ensure proper hydration and nutrition',
                'Monitor for any new symptoms',
                'If cough persists beyond 2 weeks or new symptoms develop, consult healthcare provider',
            ],
            'home_remedies': get_home_remedies_for_mild(),
            'warning': None,
            'symptoms': {
                'age': age_months,
                'cough_duration': cough_duration,
            }
        }


def get_home_remedies_for_observation():
    """Get recommended home remedies for observation cases"""
    return [
        {
            'name': 'Honey',
            'description': 'Natural throat soother for cough. Age-appropriate and safe when given carefully.',
            'dosage': 'For children 1+ years: 5ml (1 tsp) as needed. Do NOT give to infants under 1 year.'
        },
        {
            'name': 'Warm Fluids',
            'description': 'Help with comfort and hydration. Warm broth, water, or mild herbal tea.',
            'dosage': 'Frequent small amounts throughout the day'
        },
        {
            'name': 'Chest Rubs',
            'description': 'Gentle massage can help with comfort. Use only warm oil, avoid mentholated products.',
            'dosage': 'Twice daily'
        },
        {
            'name': 'Steam Inhalation',
            'description': 'Help open airways. Use a humidifier or steam tent (15-20 minutes).',
            'dosage': '2-3 times daily'
        },
        {
            'name': 'Proper Rest',
            'description': 'Sleep aids healing. Ensure child gets adequate rest.',
            'dosage': 'Allow natural sleep patterns'
        },
        {
            'name': 'Over-the-counter Pain/Fever Relievers',
            'description': 'For fever or discomfort. Examples: Paracetamol, Ibuprofen. CONSULT A PROFESSIONAL FIRST on appropriate dosage for your child\'s age and weight.',
            'dosage': 'Only as directed by healthcare provider'
        }
    ]


def get_home_remedies_for_mild():
    """Get recommended home remedies for mild cases"""
    return [
        {
            'name': 'Warm Fluids',
            'description': 'Help with comfort and hydration.',
            'dosage': 'Frequent small amounts'
        },
        {
            'name': 'Proper Hydration',
            'description': 'Ensure child drinks enough water and fluids.',
            'dosage': 'Regular intervals'
        },
        {
            'name': 'Rest',
            'description': 'Allow the child to rest naturally.',
            'dosage': 'As needed'
        }
    ]
