import React, {useState} from 'react';


function TopicPage({ onSubmit }) {
    const [topic, setTopic] = useState('');
    const [error, setError] = useState('');
  
    const bannedWords = ['violence', 'kill', 'attack', 'suicide', 'killing'];
  
    const handleSubmit = () => {
      const containsBannedWords = bannedWords.some((word) =>
      topic.toLowerCase().includes(word)
      );
  
      if (topic.trim() === '' || topic.trim().split(/\s+/).length < 3) {
        setError('Please enter a valid topic.');
      }
      else if (containsBannedWords){
        setError('Your topic contains inapprorpiate words. Please choose another topic.')
      }
      else {
        setError('');
        onSubmit(topic);
    
      }
    };
  
    return (
      <div className="topic-page">
        <h2>Please enter a topic of your choice:</h2>
        <p>Ex: I think Marvel is better than DC</p>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Type your debate topic..."
          className="topic-input"
        />
        <button className="send-button" onClick={handleSubmit}>
          Submit
        </button>
  
      
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
  
    );
  }

  export default TopicPage;