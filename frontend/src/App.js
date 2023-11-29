import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]); // Chat history
  const [input, setInput] = useState(''); // Current input

  // Send question to backend and handle response
  const sendQuestion = async () => {
    if (input.trim() === '') return; // Ignore empty input

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.get(`http://localhost:3001/ask?question=${encodeURIComponent(input)}`);
      setMessages([...newMessages, { text: response.data.result.text, sender: 'bot' }]);
    } catch (error) {
      console.error('There was an error sending the question:', error);
      setMessages([...newMessages, { text: 'Error getting response from the server.', sender: 'bot' }]);
    }
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendQuestion();
  };

  return (
    <div className="App">
      <h1>Chat with our bot</h1>
      <div className="chat-window">
        {messages.map((message, index) => (
          <p key={index} style={{ color: message.sender === 'user' ? 'blue' : 'green' }}>
            {message.text}
          </p>
        ))}
      </div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your question"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;
