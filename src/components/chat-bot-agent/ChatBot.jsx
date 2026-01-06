import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import axios from '../../api/axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: 'bot', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [interrupt, setInterrupt] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  const handleInterruptResume = async (decision) => {
    try {
      setIsTyping(true);
      const formData = new FormData();
      formData.append('decision', decision);

      if (threadId) {
        formData.append('thread_id', threadId);
      }

      const response = await axios.post('/ai-chatbot/chat/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });

      const data = response?.data;
      const rawAnswer = data?.response_data?.answer;
      const hasInterrupt = data?.response_data?.interrupt != null;

      if (hasInterrupt) {
        setInterrupt(data.response_data.interrupt);
      } else {
        setInterrupt(null);
      }

      const answer = rawAnswer && rawAnswer.trim() ? rawAnswer : null;
      const newThreadId = data?.response_data?.thread_id || data?.response_data?.thread || null;

      if (newThreadId) {
        setThreadId(newThreadId);
      }

      if (answer) {
        const botMessage = {
          id: messages.length + 2,
          text: answer,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.log(error);
      setInterrupt(null);

      const errorMessage = {
        id: messages.length + 2,
        text: 'There was an error contacting the assistant. Please try again.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append('message', inputValue);
      if (threadId) {
        formData.append('thread_id', threadId);
      }

      const response = await axios.post('/ai-chatbot/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });

      const data = response?.data;
      const rawAnswer = data?.response_data?.answer;
      const hasInterrupt = data?.response_data?.interrupt != null;

      if (hasInterrupt) {
        setInterrupt(data.response_data.interrupt);
      } else {
        setInterrupt(null);
      }

      const answer = rawAnswer && rawAnswer.trim() ? rawAnswer : null;
      const newThreadId = data?.response_data?.thread_id || data?.response_data?.thread || null;

      if (newThreadId) {
        setThreadId(newThreadId);
      }

      if (answer) {
        const botMessage = {
          id: messages.length + 2,
          text: answer,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'There was an error contacting the assistant. Please try again.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleQuickReply = (text) => {
    setInputValue(text);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
      <div className="chatbot-container open">
        <div className="chatbot-header">
          <div className="chatbot-title">
            <div className="chatbot-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white"/>
                <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11Z" fill="white"/>
              </svg>
            </div>
            <div>
              <h3>Support Assistant</h3>
              <p className="chatbot-status">
                {isTyping ? 'Typing...' : 'Online • Usually responds instantly'}
              </p>
            </div>
          </div>
          <button 
            className="close-button"
            onClick={toggleChat}
            aria-label="Close chat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Messages Container */}
        <div className="chatbot-messages">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
                <div className="message-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                    </ReactMarkdown>
                    <span className="message-timestamp">{message.timestamp}</span>
                </div>
            </div>
          ))}

          {interrupt && (
            <div className="message bot-message">
              <div className="message-content">
                <p>{interrupt.message}</p>
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                  {(interrupt.options || ['yes', 'no']).map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="quick-reply-button"
                      disabled={isTyping}
                      onClick={() => handleInterruptResume(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {isTyping && (
            <div className="message bot-message">
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {/* <div className="quick-replies">
          <p>Quick questions:</p>
          <div className="quick-reply-buttons">
            {["How do I reset my password?", "What are your hours?", "Contact support"].map((text, index) => (
              <button
                key={index}
                className="quick-reply-button"
                onClick={() => handleQuickReply(text)}
              >
                {text}
              </button>
            ))}
          </div>
        </div> */}

        {/* Input Area */}
        <form className="chatbot-input-container" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="chatbot-input"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!inputValue.trim() || isTyping}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2Z" 
                stroke={inputValue.trim() && !isTyping ? "white" : "#666"} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
      )}
    </>
  );
};

export default ChatBot;