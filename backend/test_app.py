import pytest
from app import app 
import json
import re
from collections import Counter
from unittest.mock import patch, MagicMock
from textblob import TextBlob
from app import log_request_info, validate_input 

@pytest.fixture
def client():
    
    app.config["TESTING"] = True 
    with app.test_client() as client:
        yield client 

def test_score_response_valid_input(client):
    response = client.post(
        "/score-response",
        data=json.dumps({"message": "However, I believe research suggests this is true."}),
        content_type="application/json",
    )

    assert response.status_code == 200  # Ensure successful response
    data = response.get_json()
    
    # Ensure required fields exist in the response
    assert "word_count" in data
    assert "sentiment" in data
    assert "lexical_diversity" in data
    assert "quality_score" in data

    # Ensure quality_score is a valid number
    assert isinstance(data["quality_score"], float)

def test_score_response_empty_input(client):
    
    response = client.post(
        "/score-response",
        data=json.dumps({"message": ""}),
        content_type="application/json",
    )

    assert response.status_code == 200
    data = response.get_json()
    
    assert data["word_count"] == 0
    assert data["lexical_diversity"] == 0
    assert isinstance(data["quality_score"], float)

def test_score_response_missing_message_key(client):
    """Tests handling of a request without the 'message' key"""
    response = client.post(
        "/score-response",
        data=json.dumps({}),
        content_type="application/json",
    )

    assert response.status_code == 200  # Should handle missing key gracefully
    data = response.get_json()
    
    assert data["word_count"] == 0
    assert data["lexical_diversity"] == 0
    assert isinstance(data["quality_score"], float)

def test_score_response_invalid_json(client):

    response = client.post(
        "/score-response",
        data="Not a JSON",
        content_type="application/json",
    )

    assert response.status_code == 500
    data = response.get_json()
    assert "error" in data



def test_validate_input():
    """Test validate_input with various valid and invalid cases."""
    assert validate_input("I rest my case.") == True
