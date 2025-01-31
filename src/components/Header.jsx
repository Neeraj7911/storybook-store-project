import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Custom Storybook</Link>
      </div>
      <nav className={`nav ${isOpen ? "open" : ""}`}>
        <motion.ul>
          <motion.li whileHover={{ scale: 1.1 }}>
            <Link to="/">Home</Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <Link to="/create">Create Story</Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <Link to="/about">About</Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <Link to="/contact">Contact</Link>
          </motion.li>
        </motion.ul>
      </nav>
      {user ? (
        <div className="user-profile">
          <motion.img
            src={user.photoURL || "/placeholder.svg"}
            alt="User Profile"
            className="profile-image"
            onClick={toggleDropdown}
            whileHover={{ scale: 1.1 }}
          />
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                className="dropdown-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Link to="/profile">Profile</Link>
                <Link to="/orders">Order Status</Link>
                <button onClick={handleLogout}>Logout</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="auth-buttons">
          <motion.button whileHover={{ scale: 1.1 }}>
            <Link to="/login">Login</Link>
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }}>
            <Link to="/signup">Sign Up</Link>
          </motion.button>
        </div>
      )}
      <div className="menu-toggle" onClick={toggleMenu}>
        <div className={`hamburger ${isOpen ? "open" : ""}`}></div>
      </div>
    </header>
  );
};

export default Header;
