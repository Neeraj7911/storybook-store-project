/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { user } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setShowDropdown(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const getFirstName = (fullName) => {
    return fullName ? fullName.split(" ")[0] : "User";
  };

  const navItems = ["Create", "Explore", "About"];

  return (
    <header className="header">
      <div className="header-background">
        <div
          className="header-blob"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
          }}
        ></div>
      </div>
      <div className="header-content">
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${isOpen ? "open" : ""}`}></div>
        </div>
        <Link to="/" className="logo">
          <svg viewBox="0 0 200 200" className="logo-svg">
            <path
              d="M100 20L20 100l80 80 80-80z"
              className="logo-path"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="logo-text">StoryMaker</span>
        </Link>
        <nav className={`nav ${isOpen ? "open" : ""}`}>
          <motion.ul>
            {navItems.map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={`/${item.toLowerCase()}`}
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="nav-text">{item}</span>
                  <span className="nav-highlight"></span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </nav>
        {user ? (
          <div className="user-profile" ref={dropdownRef}>
            <motion.div
              className="profile-trigger"
              onClick={toggleDropdown}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={user.photoURL || "/placeholder.svg"}
                alt="User Profile"
                className="profile-image"
              />
              <span className="username">{getFirstName(user.displayName)}</span>
            </motion.div>
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="dropdown-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Link
                    to="/profile"
                    onClick={() => {
                      setShowDropdown(false);
                      setIsOpen(false);
                    }}
                  >
                    Profile
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="auth-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="login-btn"
            >
              <Link to="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="signup-btn"
            >
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </motion.button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
