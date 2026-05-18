// src/pages/ChatAssistant.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiUser,
  FiMic,
  FiMicOff,
  FiTrash2,
  FiCpu,
  FiMessageSquare,
  FiHelpCircle,
  FiCompass,
  FiDollarSign,
  FiSun,
  FiCoffee,
  FiMap,
} from "react-icons/fi";
import { FaRobot } from "react-icons/fa"; // For robot icon
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
    <div className="h-full flex flex-col">
      <div className="grid lg:grid-cols-4 gap-6 h-full">
        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col glass-card overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <FaRobot className="text-white text-xl" />
              </div>
              <div>
                <h2 className="font-semibold">AI Travel Assistant</h2>
                <p className="text-xs text-gray-500">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiTrash2 className="text-red-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      {message.type === "user" ? (
                        <FiUser className="text-white" />
                      ) : (
                        <FaRobot className="text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-xl p-3 ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <FaRobot />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <button
                onClick={toggleVoiceInput}
                className={`p-3 rounded-xl transition-all ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {isListening ? <FiMicOff /> : <FiMic />}
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about travel..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                rows="1"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FiHelpCircle /> Suggested Questions
            </h3>
            <div className="space-y-2">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question)}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                • Ask about specific destinations
              </li>
              <li className="flex items-center gap-2">
                • Request budget breakdowns
              </li>
              <li className="flex items-center gap-2">
                • Get local food recommendations
              </li>
              <li className="flex items-center gap-2">
                • Learn about hidden gems
              </li>
              <li className="flex items-center gap-2">
                • Check weather patterns
              </li>
              <li className="flex items-center gap-2">
                • Get packing suggestions
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
