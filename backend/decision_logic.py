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
    def assess_symptoms(age_months, cough_duration, respiratory_rate, fast_breathing, fever, 
                        fever_temp, difficulty_breathing, chest_indrawing, 
                        stridor, lethargy, unable_to_drink, convulsions, cyanosis, unconscious,
                        vomiting, diarrhea, previous_episodes):
        """
        Assess pneumonia risk based on IMCI guidelines.
        
        Args:
            age_months: Age of child in months
            cough_duration: Duration of cough in days
            fast_breathing: Boolean - presence of tachypnea
            fever: Boolean - presence of fever
            fever_temp: Temperature in Celsius
            difficulty_breathing: Boolean - dyspnea (CRITICAL)
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
        if difficulty_breathing:
            critical_signs.append("Dyspnea / difficulty breathing")
        if stridor:
            critical_signs.append("Stridor")
        if lethargy:
            critical_signs.append("Lethargy")
        if unable_to_drink:
            critical_signs.append("Unable to drink")
        if convulsions:
            critical_signs.append("Convulsions / seizures")
        if cyanosis:
            critical_signs.append("Central cyanosis / blue lips")
        if unconscious:
            critical_signs.append("Unconscious / Not responsive")
        
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
        
        # Determine fast breathing from respiratory rate when provided
        # WHO IMCI thresholds:
        # - 2 months to 12 months: 50 breaths/min or more = fast breathing
        # - 12 months to 5 years: 40 breaths/min or more = fast breathing
        fast_breathing_flag = False
        respiratory_rate_value = None
        threshold = None
        
        if respiratory_rate is not None and respiratory_rate != '':
            try:
                rr = int(respiratory_rate)
                respiratory_rate_value = rr
                
                if age_months >= 2 and age_months < 12:
                    threshold = 50
                elif age_months >= 12 and age_months < 60:  # up to 5 years
                    threshold = 40
                else:
                    threshold = 50  # fallback for younger infants
                
                if rr >= threshold:
                    fast_breathing_flag = True
                    pneumonia_indicators.append(f"Fast breathing (respiratory rate {rr} ≥ {threshold} per minute)")
            except Exception:
                # fall back to provided boolean
                if fast_breathing:
                    fast_breathing_flag = True
                    pneumonia_indicators.append("Fast breathing")
        else:
            if fast_breathing:
                fast_breathing_flag = True
                pneumonia_indicators.append("Fast breathing")
        
        # WHO IMCI: Cough with fast breathing is a sign of pneumonia
        # Check if this is pneumonia (fast breathing + cough) vs simple cough
        is_pneumonia = False
        if fast_breathing_flag and cough_duration is not None:
            is_pneumonia = True
        
        # Determine if it's a simple cough: cough < 14 days, no danger signs, no fast breathing
        is_simple_cough = (
            cough_duration is not None and cough_duration < 14 and
            not fast_breathing_flag and
            not difficulty_breathing and
            not any([chest_indrawing, lethargy, unable_to_drink, convulsions, cyanosis, unconscious])
        )
        
        # IMCI assessment logic
        if is_pneumonia:
            # Fast breathing + cough = pneumonia; recommend amoxicillin
            return {
                'assessment': 'PNEUMONIA - Treat with Amoxicillin',
                'risk_level': 'MODERATE',
                'recommendation': 'Cough with fast breathing is a sign of pneumonia. Consult with a healthcare provider about amoxicillin treatment. If no chest indrawing or other danger signs, amoxicillin can be given at home.',
                'guidance': [
                    f'Child has fast breathing (respiratory rate {respiratory_rate_value} breaths/minute) with cough',
                    'Consult a healthcare provider about amoxicillin treatment',
                    'Amoxicillin can often be given at home if there are no danger signs',
                    'Ensure child stays well hydrated and continues to eat',
                    'Monitor breathing rate and general condition daily',
                    'Watch for worsening: chest indrawing, increased difficulty breathing, inability to drink, lethargy',
                    'If any danger signs appear, seek immediate medical care',
                ],
                'home_remedies': get_home_remedies_for_pneumonia(),
                'warning': 'Contact a healthcare provider for amoxicillin prescription. Monitor closely for any worsening.',
                'amoxicillin_recommended': True,
                'symptoms': {
                    'age': age_months,
                    'cough_duration': cough_duration,
                    'respiratory_rate': respiratory_rate_value,
                    'threshold': threshold,
                    'fast_breathing': fast_breathing_flag,
                    'convulsions': convulsions,
                    'cyanosis': cyanosis,
                    'unconscious': unconscious,
                    'indicators': pneumonia_indicators
                }
            }
        
        elif is_simple_cough:
            # Cough < 14 days, no danger signs, no fast breathing = simple cough/cold
            return {
                'assessment': 'SIMPLE COUGH or COLD',
                'risk_level': 'MILD',
                'recommendation': 'No signs of pneumonia. This is likely a simple cough or cold. Safe remedies at home can help.',
                'guidance': [
                    'No need for antibiotics',
                    'Safe, soothing remedies like honey in warm water can help relieve cough and soothe the throat',
                    'Cough medicines may contain harmful ingredients and are expensive - avoid them',
                    'Ensure child stays well hydrated and continues to eat',
                    'Allow adequate rest',
                    'Monitor cough duration - if it persists beyond 14 days, consult a healthcare provider',
                    'If any danger signs develop (fast breathing, chest indrawing, lethargy), seek medical care immediately',
                ],
                'home_remedies': get_home_remedies_for_simple_cough(),
                'warning': None,
                'amoxicillin_recommended': False,
                'symptoms': {
                    'age': age_months,
                    'cough_duration': cough_duration,
                    'respiratory_rate': respiratory_rate_value,
                    'fast_breathing': fast_breathing_flag,
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
                'Seek immediate care if any danger signs appear',
            ],
            'home_remedies': get_home_remedies_for_mild(),
            'warning': None,
            'amoxicillin_recommended': False,
            'symptoms': {
                'age': age_months,
                'cough_duration': cough_duration,
                'respiratory_rate': respiratory_rate_value,
                'convulsions': convulsions,
                'cyanosis': cyanosis,
                'unconscious': unconscious,
            }
        }


def get_home_remedies_for_pneumonia():
    """Get recommended home remedies for pneumonia cases (fast breathing + cough)"""
    return [
        {
            'name': 'Amoxicillin (if prescribed)',
            'description': 'Antibiotic prescribed by healthcare provider for pneumonia. Give exactly as directed.',
            'dosage': 'As directed by healthcare provider based on child\'s weight and age'
        },
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
            'name': 'Adequate Rest',
            'description': 'Sleep aids healing. Ensure child gets adequate rest.',
            'dosage': 'Allow natural sleep patterns'
        },
        {
            'name': 'Proper Hydration & Nutrition',
            'description': 'Maintain normal feeding and fluids to support immune system.',
            'dosage': 'Continue regular feeding schedule'
        },
    ]


def get_home_remedies_for_simple_cough():
    """Get recommended home remedies for simple cough or cold"""
    return [
        {
            'name': 'Honey in Warm Water',
            'description': 'Safe, soothing remedy that relieves cough and soothes the throat. WHO recommended for simple cough.',
            'dosage': 'For children 1+ years: 5ml (1 tsp) in warm water. Do NOT give raw honey to infants under 1 year.'
        },
        {
            'name': 'Warm Fluids',
            'description': 'Help with comfort and hydration. Warm broth, water, or mild herbal tea.',
            'dosage': 'Frequent small amounts throughout the day'
        },
        {
            'name': 'Adequate Rest',
            'description': 'Sleep aids natural recovery. Allow the child to rest naturally.',
            'dosage': 'As needed'
        },
        {
            'name': 'Proper Nutrition',
            'description': 'Continue normal feeding to maintain strength and support immune system.',
            'dosage': 'Regular meals'
        },
        {
            'name': 'No Need for Antibiotics',
            'description': 'Simple cough/cold does not require antibiotics. Cough medicines may contain harmful ingredients - avoid them.',
            'dosage': 'None needed'
        }
    ]


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
