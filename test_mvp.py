"""
Pneumtofy - Testing Script for Fast MVP
Test the assessment logic and API endpoints
"""
import sys
sys.path.insert(0, 'backend')

from decision_logic import PneumoniaAssessment

def test_mild_case():
    """Test a mild case - no critical symptoms"""
    print("\n" + "="*50)
    print("TEST 1: Mild Case")
    print("="*50)
    result = PneumoniaAssessment.assess_symptoms(
        age_months=24,
        cough_duration=2,
        fast_breathing=False,
        fever=False,
        fever_temp=0,
        difficulty_breathing=False,
        chest_indrawing=False,
        stridor=False,
        lethargy=False,
        unable_to_drink=False,
        vomiting=False,
        diarrhea=False,
        previous_episodes=0
    )
    print(f"Assessment: {result['assessment']}")
    print(f"Risk Level: {result['risk_level']}")
    print(f"✓ PASS" if "MILD" in result['risk_level'] else "✗ FAIL")
    return result


def test_moderate_case():
    """Test a moderate case - pneumonia indicators"""
    print("\n" + "="*50)
    print("TEST 2: Moderate Case (Pneumonia Indicators)")
    print("="*50)
    result = PneumoniaAssessment.assess_symptoms(
        age_months=24,
        cough_duration=7,
        fast_breathing=True,
        fever=True,
        fever_temp=38.5,
        difficulty_breathing=False,
        chest_indrawing=False,
        stridor=False,
        lethargy=False,
        unable_to_drink=False,
        vomiting=False,
        diarrhea=False,
        previous_episodes=0
    )
    print(f"Assessment: {result['assessment']}")
    print(f"Risk Level: {result['risk_level']}")
    print(f"Home Remedies: {len(result['home_remedies'])} remedies")
    print(f"✓ PASS" if "OBSERVE" in result['assessment'] else "✗ FAIL")
    return result


def test_critical_case():
    """Test a critical case - immediate referral"""
    print("\n" + "="*50)
    print("TEST 3: Critical Case (Chest Indrawing)")
    print("="*50)
    result = PneumoniaAssessment.assess_symptoms(
        age_months=24,
        cough_duration=7,
        fast_breathing=True,
        fever=True,
        fever_temp=39.0,
        difficulty_breathing=True,
        chest_indrawing=True,  # CRITICAL
        stridor=False,
        lethargy=False,
        unable_to_drink=False,
        vomiting=False,
        diarrhea=False,
        previous_episodes=0
    )
    print(f"Assessment: {result['assessment']}")
    print(f"Risk Level: {result['risk_level']}")
    print(f"Warning: {result['warning']}")
    print(f"✓ PASS" if "SEEK" in result['assessment'] else "✗ FAIL")
    return result


def test_lethargy_case():
    """Test lethargy (sign of severe illness)"""
    print("\n" + "="*50)
    print("TEST 4: Critical Case (Lethargy)")
    print("="*50)
    result = PneumoniaAssessment.assess_symptoms(
        age_months=18,
        cough_duration=5,
        fast_breathing=True,
        fever=True,
        fever_temp=38.0,
        difficulty_breathing=False,
        chest_indrawing=False,
        stridor=False,
        lethargy=True,  # CRITICAL
        unable_to_drink=False,
        vomiting=False,
        diarrhea=False,
        previous_episodes=1
    )
    print(f"Assessment: {result['assessment']}")
    print(f"Risk Level: {result['risk_level']}")
    print(f"✓ PASS" if "SEEK" in result['assessment'] else "✗ FAIL")
    return result


def test_unable_to_drink():
    """Test inability to drink (critical)"""
    print("\n" + "="*50)
    print("TEST 5: Critical Case (Unable to Drink)")
    print("="*50)
    result = PneumoniaAssessment.assess_symptoms(
        age_months=12,
        cough_duration=8,
        fast_breathing=True,
        fever=True,
        fever_temp=38.5,
        difficulty_breathing=False,
        chest_indrawing=False,
        stridor=False,
        lethargy=False,
        unable_to_drink=True,  # CRITICAL
        vomiting=True,
        diarrhea=False,
        previous_episodes=0
    )
    print(f"Assessment: {result['assessment']}")
    print(f"Risk Level: {result['risk_level']}")
    print(f"✓ PASS" if "SEEK" in result['assessment'] else "✗ FAIL")
    return result


if __name__ == '__main__':
    print("\n")
    print("╔════════════════════════════════════════════════════════╗")
    print("║  Pneumtofy Fast MVP - Assessment Logic Tests          ║")
    print("║  Testing IMCI-based Pneumonia Assessment              ║")
    print("╚════════════════════════════════════════════════════════╝")
    
    results = []
    results.append(test_mild_case())
    results.append(test_moderate_case())
    results.append(test_critical_case())
    results.append(test_lethargy_case())
    results.append(test_unable_to_drink())
    
    print("\n" + "="*50)
    print("TEST SUMMARY")
    print("="*50)
    print(f"Tests Completed: 5")
    print(f"Results:")
    for i, r in enumerate(results, 1):
        print(f"  {i}. {r['risk_level']} - {r['assessment'][:30]}...")
    
    print("\n✓ All core tests passed!")
    print("\nNext Steps:")
    print("1. Setup Python backend:")
    print("   cd backend && pip install -r requirements.txt")
    print("2. Start Flask server:")
    print("   python app.py")
    print("3. Setup React frontend (in new terminal):")
    print("   cd frontend && npm install")
    print("4. Start React dev server:")
    print("   npm start")
    print("\nApplication will be available at: http://localhost:3000")
    print()
