import React, { useState } from 'react';
import './App.css';

function TitlePage({ onStart }) {
  return (
    <div className="main-page">
      <h1 className="title">AI Debater</h1>
      <button className="starting-button" onClick={onStart}>
        Begin
      </button>
    </div>
  );
}

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const responses = [
    "Hello there!",
    "HI I am robot",
    "hello good user",
    "hello welcome to our debate"
  ];
  const handleSend = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');


      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prevMessages => [...prevMessages, {text: randomResponse, sender: 'ai'}]);
    }

  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

function App() {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <div>
      {started ? <ChatBox /> : <TitlePage onStart={handleStart} />}
    </div>
  );
}

export default App;
