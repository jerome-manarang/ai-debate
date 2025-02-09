import pytest
import scoring

def test_calculate_structure_score():
    assert scoring.calculate_structure_score("However, this is a strong point.") == 1
    assert scoring.calculate_structure_score("On the other hand, I believe otherwise.") == 1
    assert scoring.calculate_structure_score("While I agree with some parts, this is different.") == 1
    assert scoring.calculate_structure_score("This sentence has no structure indicators.") == 0

def test_calculate_evidence_score():
    assert scoring.calculate_evidence_score("Research suggests that this is effective.") == 1
    assert scoring.calculate_evidence_score("This shows that the data supports our hypothesis.") == 1
    assert scoring.calculate_evidence_score("The experiment, which shows significant results, is key.") == 1
    assert scoring.calculate_evidence_score("No evidence keywords here.") == 0

def test_calculate_refute_score():
    assert scoring.calculate_refute_score("You make a good point, but I disagree.") == 2
    assert scoring.calculate_refute_score("I disagree with your claim.") == 1
    assert scoring.calculate_refute_score("While I agree with the premise, the conclusion is incorrect.") == 1
    assert scoring.calculate_refute_score("This sentence does not refute anything.") == 0

def test_analyze_text():
    message = "This is a test message with some words."
    word_count, sentiment, lexical_diversity = scoring.analyze_text(message)
    
    assert word_count == 8  # Expected word count
    assert -1.0 <= sentiment <= 1.0  # Sentiment should be within this range
    assert 0.0 <= lexical_diversity <= 1.0  # Lexical diversity should be within [0,1]

def test_calculate_tone_score():
    assert scoring.calculate_tone_score(0.8) == 1.0
    assert scoring.calculate_tone_score(0.0) == 1.0
    assert scoring.calculate_tone_score(-0.4) == 1.0
    assert scoring.calculate_tone_score(-0.6) == 0.5

def test_calculate_quality_score():
    quality_score = scoring.calculate_quality_score(2, 3, 1, 1.0)
    expected_score = (2 * 0.25) + (3 * 0.30) + (1.0 * 0.15) + (1 * 0.10)
    assert round(quality_score, 2) == round(expected_score, 2)

