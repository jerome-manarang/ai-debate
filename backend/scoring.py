from textblob import TextBlob

def calculate_structure_score(user_message):
    structure_diction = ["however", "On the other hand", "While i agree"]
    user_message_lower = user_message.lower()  # Convert input to lowercase
    return sum(1 for value in structure_diction if value.lower() in user_message_lower)

def calculate_evidence_score(user_message):
    evidence_diction = ["research", "this shows", "which shows"]
    user_message_lower = user_message.lower()
    return sum(1 for value in evidence_diction if value.lower() in user_message_lower)

def calculate_refute_score(user_message):
    refute_diction = ["you make a", "i disagree", "while i agree"]
    user_message_lower = user_message.lower()
    return sum(1 for value in refute_diction if value.lower() in user_message_lower)

def analyze_text(user_message):
    blob = TextBlob(user_message)
    word_count = len(user_message.split())
    sentiment = blob.sentiment.polarity
    lexical_diversity = (len(set(blob.words)) / word_count) if word_count > 0 and len(set(blob.words)) > 0 else 0

    return word_count, sentiment, lexical_diversity

def calculate_tone_score(sentiment):
  
    return 1.0 if sentiment > -0.5 else 0.5

def calculate_quality_score(struct_score, evi_score, ref_score, tone_score):
 
    return (
        struct_score * 0.25 +
        evi_score * 0.30 +
        tone_score * 0.15 +
        ref_score * 0.10
    )
