import React, {useState, useRef, useEffect} from 'react';
import { openai } from '../openai';

function ChatBox({ topic }) {
    const [messages, setMessages] = useState([
      { text: 'Hello, welcome to our debate! You may begin...', sender: 'ai' },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [score, setScore] = useState(0);
    const [scoreChanged, setScoreChanged] = useState(false);
    const [scoreDown, setScoreDown] = useState(false);
    const chatEndRef = useRef(null);
  

    const handleSend = async () => {
      if (input.trim() !== '') {
        const userMessage = input;
        setInput('');
    
        // Add user message to chatbox
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: userMessage, sender: 'user' },
        ]);
    
        let qualityScore = null;
        let aiQualityScore = null;
    
        try {
          // Step 1: Attempt to send the user's message to the Python backend for scoring
          const scoreResponse = await fetch('http://127.0.0.1:4000/score-response', {
          //const scoreResponse = await fetch('/score-response', {


            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });
        



                
          if (scoreResponse.ok) {
            const scoreData = await scoreResponse.json();
            if (!scoreData.valid_input){
              setMessages((prevMessages) => [
                ...prevMessages,
                { text: `I do not understand what you said, can you please restate or say something else?`, sender: 'ai' },
              ]);
              return;
            }
            else if (scoreData.quality_score !== undefined) {
              qualityScore = scoreData.quality_score;
              // Add quality score to chatbox
              // setMessages((prevMessages) => [
              //   ...prevMessages,
              //   { text: `Your response quality score: ${qualityScore}`, sender: 'ai' },
              // ]);
              setScore((prevScore) => {
                const newScore = prevScore + qualityScore*10;
                setScoreChanged(true); // Trigger color change effect

                // Reset color after 2 seconds
                setTimeout(() => {
                    setScoreChanged(false);
                }, 2000);

                return newScore;
            });

            
            } else {
              console.warn('Backend returned unexpected data:', scoreData);
            }
          } else {
            console.warn('Backend is unreachable or returned an error.');
          }
        } catch (error) {
          console.error('Error while communicating with the backend:', error);
        }
    
        try {
          // Step 2: Call OpenAI API with user's message and topic
          const openAIResponse = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
              { role: 'system', content: 'You are debating against a user in a texting simulation.' },
              {
                role: 'user',
                content: `The user's opinion is: ${topic}. They state: "${userMessage}". Rebuttal this, as if you are just the user's friend. Please respond in the same amount of sentences as the user's response.`,
              },
            ],
          });
    
          if (openAIResponse && openAIResponse.choices && openAIResponse.choices.length > 0) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: openAIResponse.choices[0].message.content, sender: 'ai' },
            ]);

            const scoreAI = await fetch('http://127.0.0.1:4000/score-response', {
      


            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: openAIResponse.choices[0].message.content }),
            
        });
        if (scoreAI.ok){
          const scoreAIData = await scoreAI.json();
          aiQualityScore = scoreAIData.quality_score * 10;

         
          setScore((prevScore) => {
              const newScore = Math.max(0, prevScore - aiQualityScore); 
              setScoreDown(true);
              setTimeout(() => setScoreDown(false), 2000);
              return newScore;
          });
          } 
        
       }  else {
            console.error('Unexpected response format from OpenAI:', openAIResponse);
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: 'Sorry, I could not process that. Please try again.', sender: 'ai' },
            ]);
          }
        } catch (error) {
          console.error('Error during OpenAI API call:', error);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: 'An error occurred. Please try again.', sender: 'ai' },
          ]);
        }
      }
    };
    

  
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
          <h2 className={`score-display ${scoreChanged ? 'score-increase' : ''} ${scoreDown ? 'score-decrease' : ''}`}>
    Score: {score*10}
</h2>
        </div>
        <div className="chat-box">
          {messages.map((message, index) => (
            <div
            key={index}
            className={`chat-message ${
              message.sender === 'user' ? 'user-message' : 'ai-message'
            }`}
          >
            {message.text.startsWith('"') && message.text.endsWith('"')
              ? message.text.slice(1, -1)
              : message.text}
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

  // const handleSend = async () => {
    //   if (input.trim() !== '') {
    //     setMessages((prevMessages) => [
    //       ...prevMessages,
    //       { text: input, sender: 'user' },
    //     ]);
    //     const userMessage = input;
    //     setInput('');
    
    //     try {
    //       // Call the OpenAI API with the user's message and topic
    //       const completion = await openai.chat.completions.create({
    //         model: "gpt-4",
    //         messages: [
    //           { role: "system", content: "You are debating against a user in a texting simulation." },
    //           {
    //             role: "user",
    //             content: `The user's opinion is: ${topic}. They state: "${userMessage}". Rebuttal this, as if you are just the user's friend. Please respond in the same amount of sentences as the user's response.`,
    //           },
    //         ],
    //       });
    
    //       // Ensure that completion.choices exists and contains the expected data
    //       if (completion && completion.choices && completion.choices.length > 0) {
    //         let aiResponse = completion.choices[0].message.content;
    
    //         // Add quotation marks if missing
    //         if (!aiResponse.startsWith('"') || !aiResponse.endsWith('"')) {
    //           aiResponse = `"${aiResponse}"`;
    //         }
    
    //         setMessages((prevMessages) => [
    //           ...prevMessages,
    //           { text: aiResponse, sender: 'ai' },
    //         ]);
    //       } else {
    //         console.error("Unexpected response format:", completion);
    //         setMessages((prevMessages) => [
    //           ...prevMessages,
    //           { text: "Sorry, I couldn't process that. Please try again.", sender: 'ai' },
    //         ]);
    //       }
    //     } catch (error) {
    //       console.error("Error with OpenAI API:", error);
    //       setMessages((prevMessages) => [
    //         ...prevMessages,
    //         { text: "An error occurred. Please try again.", sender: 'ai' },
    //       ]);
    //     }
    //   }
    // };
    
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
    };
    
    <div className="heading">
          <h2 className={`score-ai-disappear ${updateAI ? 'score-ai-appear' : 'score-ai-disappear'}`}>
              +{scoreValue} </h2>
          <h2 className={`score-user-disappear ${updateUser ? 'score-user-appear' : 'score-user-disappear'}`}>
            +{scoreValue} </h2>
          </div>
     
    
    
    */


