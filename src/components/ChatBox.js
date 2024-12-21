import React, {useState, useRef, useEffect} from 'react';
import { openai } from '../openai';

function ChatBox({ topic }) {
    const [messages, setMessages] = useState([
      { text: 'Hello, welcome to our debate! You may begin...', sender: 'ai' },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const chatEndRef = useRef(null);
  
    const handleSend = async () => {
      if (input.trim() !== '') {
        // Add user message
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: input, sender: 'user' },
        ]);
    
        const userMessage = input;
        setInput('');
    
        try {
          // Call the OpenAI API with the user's message and topic
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              { role: "system", content: "You are debating against a user in a texting simulation." },
              {
                role: "user",
                content: `The user's opinion is: ${topic}. They state: "${userMessage}". Rebuttal this, as if you are just the user's friend. Please respond in the same amount of sentences as the user's response.`,
              },
            ],
          });
    
          // Ensure that completion.choices exists and contains the expected data
          if (completion && completion.choices && completion.choices.length > 0) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: completion.choices[0].message.content, sender: 'ai' },
            ]);
          } else {
            console.error("Unexpected response format:", completion);
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: "Sorry, I couldn't process that. Please try again.", sender: 'ai' },
            ]);
          }
        } catch (error) {
          console.error("Error with OpenAI API:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "An error occurred. Please try again.", sender: 'ai' },
          ]);
        }
      }
    };
    
    /*const handleSend = () => {
      if (input.trim() !== '') {
        // Add user message
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: input, sender: 'user' },
        ]);
        const userMessage = input;
        setInput('');
  
        // Simulate a computer response
        const randomResponses = [
          'That’s an interesting point, but have you considered the opposite?',
          'I see where you’re coming from, but I disagree with that reasoning.',
          'Your argument has some valid points, but here’s why it might not hold up.',
          'I appreciate your stance, but let’s think about the broader context.',
        ];
        const aiMessage = randomResponses[Math.floor(Math.random() * randomResponses.length)];
  
        // Add AI response
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: aiMessage, sender: 'ai' },
        ]);
      }
    }; */
  
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
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
              className={`chat-message ${
                message.sender === 'user' ? 'user-message' : 'ai-message'
              }`}
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

  export default ChatBox;