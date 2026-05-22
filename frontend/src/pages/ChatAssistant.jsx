import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiUser,
  FiMic,
  FiMicOff,
  FiTrash2,
  FiHelpCircle,
} from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import { aiAPI } from "../services/api";
import toast from "react-hot-toast";

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your AI travel assistant. Ask me anything about travel destinations, recommendations, budgeting, or local tips! ✈️",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await aiAPI.chat(input, "Travel planning");
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: response.data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast.error("Failed to get response");
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content:
          "Sorry, I'm having trouble connecting. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: "bot",
        content: "Chat cleared! How can I help you with your travel plans? ✈️",
        timestamp: new Date(),
      },
    ]);
    toast.success("Chat cleared");
  };

  const toggleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Voice recognition failed");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast.error("Voice recognition not supported in your browser");
    }
  };

  const suggestedQuestions = [
    "What's the best time to visit Japan?",
    "Budget travel tips for Europe",
    "Hidden gems in Italy",
    "Local food recommendations in Thailand",
    "How to save money on flights?",
    "Best beach destinations in December",
  ];

  return (
    <div className="chat-container">
      <div className="chat-grid">
        {/* Chat Area */}
        <div className="chat-main">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <FaRobot size={20} />
              </div>
              <div>
                <h2>AI Travel Assistant</h2>
                <p>Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="clear-chat-btn"
              title="Clear chat"
            >
              <FiTrash2 size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`message-wrapper ${message.type === "user" ? "user" : "bot"}`}
                >
                  <div
                    className={`message-bubble ${message.type === "user" ? "user" : "bot"}`}
                  >
                    <div className="message-avatar">
                      {message.type === "user" ? (
                        <FiUser size={14} />
                      ) : (
                        <FaRobot size={14} />
                      )}
                    </div>
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="message-wrapper bot"
              >
                <div className="message-bubble bot">
                  <div className="message-avatar">
                    <FaRobot size={14} />
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <div className="input-wrapper">
              <button
                onClick={toggleVoiceInput}
                className={`voice-btn ${isListening ? "listening" : ""}`}
              >
                {isListening ? <FiMicOff size={18} /> : <FiMic size={18} />}
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about travel..."
                className="chat-input"
                rows="1"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="send-btn"
              >
                <FiSend size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div className="chat-sidebar">
          <div className="suggestions-card">
            <h3>
              <FiHelpCircle size={18} /> Suggested Questions
            </h3>
            <div className="suggestions-list">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question)}
                  className="suggestion-btn"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="tips-card">
            <h3>Quick Tips</h3>
            <ul className="tips-list">
              <li>• Ask about specific destinations</li>
              <li>• Request budget breakdowns</li>
              <li>• Get local food recommendations</li>
              <li>• Learn about hidden gems</li>
              <li>• Check weather patterns</li>
              <li>• Get packing suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
