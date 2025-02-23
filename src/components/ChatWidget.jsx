import { useState, useEffect } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import "./ChatWidget.css";

const socket = io("http://localhost:3000"); // Adjust URL for production

const ChatWidget = () => {
  const [isVisible, setIsVisible] = useState(true); // Widget visibility
  const [isOpen, setIsOpen] = useState(false); // Chat body open state
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showPeep, setShowPeep] = useState(false); // Robot peep state

  useEffect(() => {
    // Robot peeps every 10-30 seconds
    const interval = setInterval(() => {
      if (!isOpen && isVisible) {
        setShowPeep(true);
        setTimeout(() => setShowPeep(false), 3000); // Hide after 3 seconds
      }
    }, Math.random() * 20000 + 10000); // Random 10-30s

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, { sender: "Support", text: msg }]);
    });

    return () => {
      clearInterval(interval);
      socket.off("message");
    };
  }, [isOpen, isVisible]);

  const handleStartChat = (e) => {
    e.preventDefault();
    if (name && email && phone) {
      socket.emit("userDetails", { name, email, phone });
      setIsChatStarted(true);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("message", message);
      setMessages((prev) => [...prev, { sender: "You", text: message }]);
      setMessage("");
    }
  };

  const handleHideWidget = () => {
    setIsVisible(false);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="chat-widget"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {/* Chat Circle SVG */}
          <motion.div
            className="chat-header"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="30"
                cy="30"
                r="28"
                fill="url(#grad)"
                stroke="#fff"
                strokeWidth="2"
              />
              <path
                d="M20 40C20 35.5817 23.5817 32 28 32H32C36.4183 32 40 35.5817 40 40"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="30" cy="22" r="6" fill="#fff" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="60" y2="60">
                  <stop offset="0%" stopColor="#4CAF50" />
                  <stop offset="100%" stopColor="#388E3C" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Robot Peep */}
          <AnimatePresence>
            {showPeep && !isOpen && (
              <motion.div
                className="robot-peep"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <svg
                  width="50"
                  height="70"
                  viewBox="0 0 50 70"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="15"
                    y="30"
                    width="20"
                    height="20"
                    rx="4"
                    fill="#4CAF50"
                  />
                  <circle cx="20" cy="25" r="5" fill="#388E3C" />
                  <circle cx="30" cy="25" r="5" fill="#388E3C" />
                  <rect
                    x="17"
                    y="50"
                    width="6"
                    height="10"
                    rx="2"
                    fill="#388E3C"
                  />
                  <rect
                    x="27"
                    y="50"
                    width="6"
                    height="10"
                    rx="2"
                    fill="#388E3C"
                  />
                  <rect x="22" y="15" width="6" height="6" rx="1" fill="#fff" />
                </svg>
                <span className="peep-message">Need any help?</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Body */}
          {isOpen && (
            <motion.div
              className="chat-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="chat-close"
                onClick={handleHideWidget}
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.div>

              {/* Robot Greeting */}
              {!isChatStarted && (
                <motion.div
                  className="robot-greeting"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <svg
                    width="50"
                    height="70"
                    viewBox="0 0 50 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="15"
                      y="30"
                      width="20"
                      height="20"
                      rx="4"
                      fill="#4CAF50"
                    />
                    <circle cx="20" cy="25" r="5" fill="#388E3C" />
                    <circle cx="30" cy="25" r="5" fill="#388E3C" />
                    <rect
                      x="17"
                      y="50"
                      width="6"
                      height="10"
                      rx="2"
                      fill="#388E3C"
                    />
                    <rect
                      x="27"
                      y="50"
                      width="6"
                      height="10"
                      rx="2"
                      fill="#388E3C"
                    />
                    <rect
                      x="22"
                      y="15"
                      width="6"
                      height="6"
                      rx="1"
                      fill="#fff"
                    />
                  </svg>
                  <span>How may I help you?</span>
                </motion.div>
              )}

              {!isChatStarted ? (
                <form onSubmit={handleStartChat} className="chat-form">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    required
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05, backgroundColor: "#388E3C" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Chat
                  </motion.button>
                </form>
              ) : (
                <>
                  <div className="chat-messages">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        className={`message ${msg.sender.toLowerCase()}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <strong>{msg.sender}:</strong> {msg.text}
                      </motion.div>
                    ))}
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    whileHover={{ scale: 1.05, backgroundColor: "#388E3C" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWidget;
