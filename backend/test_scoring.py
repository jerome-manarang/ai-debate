import pytest
import scoring

def test_calculate_structure_score():
    assert scoring.calculate_structure_score("However, this is a strong point.") == 1
    assert scoring.calculate_structure_score("On the other hand, I believe otherwise.") == 1
    assert scoring.calculate_structure_score("While I agree with some parts, this is different.") == 1
    assert scoring.calculate_structure_score("This sentence has no structure indicators.") == 0
    assert scoring.calculate_structure_score("However, therefore, and moreover are all transitions.") == 3
    assert scoring.calculate_structure_score("Furthermore, in contrast, and in other words, we see the issue.") == 3
    assert scoring.calculate_structure_score("This is a sentence without structural transitions.") == 0
    assert scoring.calculate_structure_score("Thus, as a result, in conclusion, I stand by my statement.") == 3
    assert scoring.calculate_structure_score("") == 0  # Edge case: Empty string

def test_calculate_evidence_score():
    assert scoring.calculate_evidence_score("Research suggests that this is effective.") == 1
    assert scoring.calculate_evidence_score("This shows that the data supports our hypothesis.") == 1
    assert scoring.calculate_evidence_score("The experiment, which shows significant results, is key.") == 1
    assert scoring.calculate_evidence_score("No evidence keywords here.") == 0
    assert scoring.calculate_evidence_score("According to a study, statistics demonstrate the effectiveness.") == 2
    assert scoring.calculate_evidence_score("Data, results, and findings all suggest a conclusion.") == 3
    assert scoring.calculate_evidence_score("Case study and peer-reviewed research prove this point.") == 2
    assert scoring.calculate_evidence_score("Scientific analysis confirms and proves this hypothesis.") == 2
    assert scoring.calculate_evidence_score("") == 0  # Edge case: Empty string
    assert scoring.calculate_evidence_score("Explained, demonstrated, and verified by experts.") == 3

def test_calculate_refute_score():
    assert scoring.calculate_refute_score("You make a good point, but I disagree.") == 2
    assert scoring.calculate_refute_score("I disagree with your claim.") == 1
    assert scoring.calculate_refute_score("While I agree with the premise, the conclusion is incorrect.") == 1
    assert scoring.calculate_refute_score("This sentence does not refute anything.") == 0
    assert scoring.calculate_refute_score("Your argument is flawed and lacks merit.") == 2
    assert scoring.calculate_refute_score("I reject this reasoning, as it contradicts the facts.") == 2
    assert scoring.calculate_refute_score("However, this argument is weak and overlooks key details.") == 2
    assert scoring.calculate_refute_score("Not convincing, unsubstantiated, and misguided reasoning.") == 3
    assert scoring.calculate_refute_score("") == 0  # Edge case: Empty string

def test_analyze_text():
    message = "This is a test message with some words."
    word_count, sentiment, lexical_diversity = scoring.analyze_text(message)
    
    assert word_count == 8 
    assert -1.0 <= sentiment <= 1.0  
    assert 0.0 <= lexical_diversity <= 1.0  

    empty_message = ""
    word_count, sentiment, lexical_diversity = scoring.analyze_text(empty_message)
    assert word_count == 0  
    assert lexical_diversity == 0.0 

    diverse_message = "Unique words make this sentence more diverse in its vocabulary usage."
    word_count, sentiment, lexical_diversity = scoring.analyze_text(diverse_message)
    assert word_count > 5  
    assert lexical_diversity > 0.5  

def test_calculate_tone_score():
    assert scoring.calculate_tone_score(0.8) == 1.0
    assert scoring.calculate_tone_score(0.0) == 1.0
    assert scoring.calculate_tone_score(-0.4) == 1.0
    assert scoring.calculate_tone_score(-0.6) == 0.5
    assert scoring.calculate_tone_score(1.0) == 1.0  # Edge case: Max positive sentiment
    assert scoring.calculate_tone_score(-1.0) == 0.5  # Edge case: Max negative sentiment
    assert scoring.calculate_tone_score(0.5) == 1.0  # Midway positive sentiment
    assert scoring.calculate_tone_score(-0.1) == 1.0  # Slightly negative sentiment

def test_calculate_quality_score():
    quality_score = scoring.calculate_quality_score(2, 3, 1, 1.0)
    expected_score = (2 * 0.25) + (3 * 0.30) + (1.0 * 0.15) + (1 * 0.10)
    assert round(quality_score, 2) == round(expected_score, 2)

    quality_score = scoring.calculate_quality_score(0, 0, 0, 0.0)
    assert quality_score == 0  # Edge case: No contributions, should be 0

    quality_score = scoring.calculate_quality_score(10, 10, 10, 1.0)
    expected_score = (10 * 0.25) + (10 * 0.30) + (1.0 * 0.15) + (10 * 0.10)
    assert round(quality_score, 2) == round(expected_score, 2)  # Large values case

    quality_score = scoring.calculate_quality_score(1, 1, 1, 0.5)
    expected_score = (1 * 0.25) + (1 * 0.30) + (0.5 * 0.15) + (1 * 0.10)
    assert round(quality_score, 2) == round(expected_score, 2)  # Mixed small values

