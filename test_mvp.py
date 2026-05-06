"""
Pneumtofy assessment logic smoke tests.
"""
import sys

sys.path.insert(0, "backend")

from decision_logic import PneumoniaAssessment


def assess(**overrides):
    data = {
        "age_months": 24,
        "cough_duration": 2,
        "respiratory_rate": None,
        "fast_breathing": False,
        "fever": False,
        "fever_temp": 0,
        "difficulty_breathing": False,
        "chest_indrawing": False,
        "stridor": False,
        "lethargy": False,
        "unable_to_drink": False,
        "convulsions": False,
        "cyanosis": False,
        "unconscious": False,
        "vomiting": False,
        "diarrhea": False,
        "previous_episodes": 0,
    }
    data.update(overrides)
    return PneumoniaAssessment.assess_symptoms(**data)


def check(name, result, expected_assessment=None, expected_risk=None):
    print(f"\n{name}")
    print(f"Assessment: {result['assessment']}")
    print(f"Risk Level: {result['risk_level']}")

    if expected_assessment:
        assert result["assessment"] == expected_assessment
    if expected_risk:
        assert result["risk_level"] == expected_risk


def run_tests():
    check(
        "TEST 1: Simple cough/cold",
        assess(cough_duration=2),
        expected_assessment="SIMPLE COUGH or COLD",
        expected_risk="MILD",
    )

    check(
        "TEST 2: Pneumonia with age-based fast breathing",
        assess(cough_duration=7, respiratory_rate=42, fever=True, fever_temp=38.5),
        expected_assessment="PNEUMONIA - Treat with Amoxicillin",
        expected_risk="MODERATE",
    )

    check(
        "TEST 3: Critical chest indrawing",
        assess(cough_duration=7, chest_indrawing=True, fever=True, fever_temp=39.0),
        expected_assessment="SEEK IMMEDIATE MEDICAL CARE",
        expected_risk="CRITICAL",
    )

    check(
        "TEST 4: Critical dyspnea / difficulty breathing",
        assess(cough_duration=7, difficulty_breathing=True),
        expected_assessment="SEEK IMMEDIATE MEDICAL CARE",
        expected_risk="CRITICAL",
    )

    check(
        "TEST 5: Critical unable to drink",
        assess(cough_duration=8, unable_to_drink=True, vomiting=True),
        expected_assessment="SEEK IMMEDIATE MEDICAL CARE",
        expected_risk="CRITICAL",
    )

    print("\nAll assessment logic smoke tests passed.")


if __name__ == "__main__":
    run_tests()
