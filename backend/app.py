from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob

app = Flask(__name__)
CORS(app)  # Allow frontend requests


# Debugging: Log incoming requests (Optional, for debugging only)
@app.before_request
def log_request_info():
    print(f"Request Method: {request.method}")
    print(f"Request Headers: {request.headers}")
    print(f"Request Body: {request.get_data(as_text=True)}")

# Actual route for handling POST requests
@app.route('/score-response', methods=['POST'])
def score_response():
    try:
        # Get JSON data from the request
        data = request.json
        user_message = data.get('message', '')

        structure_diction = ["However", "On the other hand", "While I agree"]
        evidence_diction = ["research", "this shows", "which shows"]
        refute_diction = ["You make a", "I disagree", "While I agree"]


        struct_score = sum(1 for value in structure_diction if value in user_message)
        evi_score = sum(1 for value in evidence_diction if value in user_message)
        ref_score = sum(1 for value in refute_diction if value in user_message)
                
        
        blob = TextBlob(user_message)
        word_count = len(user_message.split())
        sentiment = blob.sentiment.polarity
        lexical_diversity = (len(set(blob.words)) / word_count) if word_count > 0 and len(set(blob.words)) > 0 else 0

        tone_score = 1.0 if sentiment > -0.5 else 0.5

        

        # Calculate quality score 
        quality_score = (
            struct_score * 0.25 +
            evi_score * 0.30 +
            tone_score * 0.15 +
            ref_score * 0.10 

            
        )

        # Respond with analysis data
        return jsonify({
            "word_count": word_count,
            "sentiment": sentiment,
            "lexical_diversity": lexical_diversity,
            "quality_score": round(quality_score, 2)
        })
    except Exception as e:
        # Handle errors gracefully
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=4000)
