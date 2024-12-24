from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from textblob import TextBlob

app = Flask(__name__)


FRONTEND_URL = "http://localhost:3000"

# Enable CORS for specific routes
CORS(app, resources={r"/score-response": {"origins": FRONTEND_URL}}, supports_credentials=True)

# Debugging: Log incoming requests
@app.before_request
def log_request_info():
    print(f"Request Method: {request.method}")
    print(f"Request Headers: {request.headers}")
    print(f"Request Body: {request.get_data(as_text=True)}")

# Function to add CORS headers
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = FRONTEND_URL
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

# Apply CORS headers globally to all responses
@app.after_request
def after_request(response):
    return add_cors_headers(response)

# Handle preflight OPTIONS requests globally
@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def options_preflight(path):
    return add_cors_headers(make_response())

# Actual route for handling POST requests
@app.route('/score-response', methods=['POST'])
def score_response():
    try:
        # Get JSON data from the request
        data = request.json
        user_message = data.get('message', '')

        # Perform TextBlob analysis
        blob = TextBlob(user_message)
        word_count = len(user_message.split())
        sentiment = blob.sentiment.polarity
        lexical_diversity = len(set(user_message.split())) / word_count if word_count > 0 else 0

        # Calculate quality score
        quality_score = (
            (word_count / 10) * 0.4 +
            (sentiment * 50) * 0.3 +
            (lexical_diversity * 100) * 0.3
        )

        # Respond with analysis data
        response = jsonify({
            "word_count": word_count,
            "sentiment": sentiment,
            "lexical_diversity": lexical_diversity,
            "quality_score": round(quality_score, 2)
        })
        return response
    except Exception as e:
        # Handle errors gracefully
        response = jsonify({"error": str(e)})
        return response, 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
