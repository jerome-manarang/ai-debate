from textblob import TextBlob

def calculate_structure_score(user_message):
    structure_diction = [
    "however", "on the other hand", "while I agree", "therefore", "thus", "consequently", 
    "as a result", "in contrast", "nevertheless", "nonetheless", "moreover", "furthermore", 
    "additionally", "in conclusion", "to summarize", "to illustrate", "for example", 
    "for instance", "in other words", "in summary", "to clarify", "alternatively"
]
    user_message_lower = user_message.lower()  
    return sum(1 for value in structure_diction if value.lower() in user_message_lower)

def calculate_evidence_score(user_message):
    evidence_diction = evidence_diction = [
    "research", "this shows", "which shows", "proof", "explain", "explained", "study", 
    "according to", "data", "findings", "demonstrates", "reveals", "proves", "supports", 
    "verified", "statistics", "suggests", "indicates", "as evidence", "case study", 
    "observed", "results", "scientific", "empirical", "peer-reviewed", "validated", 
    "confirmed", "example", "illustrates", "proven", "documented", "analysis"
]

    user_message_lower = user_message.lower()
    return sum(1 for value in evidence_diction if value.lower() in user_message_lower)

def calculate_refute_score(user_message):
    refute_diction = refute_diction = [
    "you make a", "i disagree", "while I agree", "that being said", "on the contrary", 
    "contradict", "counterpoint", "i challenge", "i oppose", "i refute", "i reject", 
    "objection", "flawed", "misconception", "incorrect", "this is wrong", "not true", 
    "however, this is not", "your argument fails", "does not hold up", "not valid", 
    "weak argument", "lacks merit", "overlooks", "ignores", "not convincing", 
    "unsubstantiated", "inaccurate", "fails to consider", "misguided"
]

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
