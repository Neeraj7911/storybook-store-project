import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  updateProfile,
  getRedirectResult,
} from "firebase/auth";
import io from "socket.io-client";
import { auth } from "../firebase/config";
import "./SignupPage.css";

const socket = io("http://localhost:3000");

const BackgroundEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="background-effect">
      <div
        className="glow"
        style={{ left: mousePosition.x, top: mousePosition.y }}
      ></div>
    </div>
  );
};

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Handle redirect result after Google signup
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const user = result.user;
          socket.emit("signup", {
            name: user.displayName || "New User",
            email: user.email,
          });
          navigate("/profile");
        }
      })
      .catch((error) => {
        setError("Failed to sign up with Google. " + error.message);
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });

      socket.emit("signup", { name, email });
      navigate("/profile");
    } catch (error) {
      setError("Failed to create an account. " + error.message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setError("");
      await signInWithRedirect(auth, provider);
      // Redirect handling is done in useEffect
    } catch (error) {
      setError("Failed to initiate Google signup. " + error.message);
    }
  };

  return (
    <div className="signup-page">
      <BackgroundEffect />
      <motion.div
        className="signup-form-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="signup-form">
          <h2>Join the Adventure</h2>
          {error && <div className="error">{error}</div>}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="submit-button"
          >
            Start Your Journey
          </motion.button>
          <motion.button
            type="button"
            onClick={handleGoogleSignup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="google-signup-button"
          >
            Sign Up with Google
          </motion.button>
          <p className="login-link">
            Already on the adventure? <Link to="/login">Log In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default SignupPage;
