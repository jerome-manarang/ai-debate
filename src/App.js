import React, { useState, useEffect, useRef } from 'react';
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


/*const responses = [
    "Hello there!",
    "HI I am robot",
    "hello good user",
    "hello welcome to our debate"
  ];

  const handleSend = () => {
    if (input.trim() !== '') {
      // Add user message
      setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);
      setInput('');

      // Simulate AI response
      /*setTimeout(() => {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prevMessages => [...prevMessages, { text: randomResponse, sender: 'ai' }]);
      }, 500); // Add a slight delay to simulate AI thinking */

      function ChatBox() {
        const [messages, setMessages] = useState([]);
        const [input, setInput] = useState('');
        const chatEndRef = useRef(null);
      
        const handleSend = async () => {
          if (input.trim() !== '') {
            // Add user message
            setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);
            setInput('');
        
            // Refine the AI prompt
            const refinedPrompt = `You are a debate AI. The topic is: "${input}". Argue against the user's position with a clear and concise response.`;
        
            // API call to get AI response
            try {
              const response = await fetch('https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B', {
                method: 'POST',
                headers: { 
                  'Authorization': `Bearer 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`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  inputs: refinedPrompt,
                  parameters: { max_new_tokens: 150 } // Limit the number of tokens to prevent overly long responses
                })
              });
              
              const data = await response.json();
              const aiMessage = data[0]?.generated_text.trim() || "Sorry, something went wrong.";
              
              // Add AI response
              setMessages(prevMessages => [...prevMessages, { text: aiMessage, sender: 'ai' }]);
        
            } catch (error) {
              console.error("Error fetching AI response:", error);
              setMessages(prevMessages => [...prevMessages, { text: "Error generating response.", sender: 'ai' }]);
            }
          }
        };
        
      
        // Function to scroll to the bottom of the chat
        const scrollToBottom = () => {
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };
      
        // Scroll to bottom when messages change
        useEffect(() => {
          scrollToBottom();
        }, [messages]);
      
        return (
          <div className="chat-container">
            <div className="heading">
              <h1>AI Debater</h1>
            </div>
            <div className="chat-box">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  {message.text}
                </div>
              ))}
              <div ref={chatEndRef} />
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
