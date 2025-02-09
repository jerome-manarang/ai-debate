from flask import Flask, request, jsonify
from collections import Counter
from flask_cors import CORS
from textblob import TextBlob
import scoring
import re

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Debugging: Log incoming requests (Optional, for debugging only)
@app.before_request
def log_request_info():
    print(f"Request Method: {request.method}")
    print(f"Request Headers: {request.headers}")
    print(f"Request Body: {request.get_data(as_text=True)}")


def validate_input(user_input):
    banned_words = ["violence", "attack", "kill", "fraud", "illegal"]
    
    if not user_input.strip():
        return False

    if len(user_input) == 1:
        return False


    if not re.search(r"[a-zA-Z]{3,}", user_input):
        return False


    words = user_input.lower().split()
    word_counts = Counter(words)
    if any(count > len(words) / 2 for count in word_counts.values()):
        return False


    if len(user_input.split()) > 100:
        return False


    """blob = TextBlob(user_input)
    if blob.sentiment.subjectivity < 0.2: 
        return False"""

 
    if any(word in user_input.lower() for word in banned_words):
        return False



    return True
    
    


@app.route('/score-response', methods=['POST'])
def score_response():
    try:
       
        
        data = request.json
        user_message = data.get('message', '')
        valid_input = validate_input(user_message)
        struct_score = scoring.calculate_structure_score(user_message)
        evi_score = scoring.calculate_evidence_score(user_message)
        ref_score = scoring.calculate_refute_score(user_message)

    
        word_count, sentiment, lexical_diversity = scoring.analyze_text(user_message)
        tone_score = scoring.calculate_tone_score(sentiment)

      
        quality_score = scoring.calculate_quality_score(struct_score, evi_score, ref_score, tone_score)


        return jsonify({
            "valid_input" : valid_input,
            "word_count": word_count,
            "sentiment": sentiment,
            "lexical_diversity": lexical_diversity,
            "quality_score": round(quality_score, 2)
        })
    except Exception as e:
        # Handle errors gracefully
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=4000)
