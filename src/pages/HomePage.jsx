import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import BookAnimation from "../components/BookAnimation";
import ParticleEffect from "../components/ParticleEffect";
import Modal from "../components/Modal";
import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canvasRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  const handleOpenBook = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="home-page">
      <section className="hero">
        <motion.div
          className="hero-background"
          animate={{
            backgroundPosition: `${mousePosition.x / 50}px ${
              mousePosition.y / 50
            }px`,
          }}
          transition={{ type: "tween", ease: "linear" }}
        />
        <ParticleEffect canvasRef={canvasRef} mousePosition={mousePosition} />
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Create Your Magical Storybook
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Bring your imagination to life with our enchanting storybook creator
          </motion.p>
          <Link to="/create">
            <motion.button
              className="cta-button"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 8px rgb(255,255,255)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Adventure
            </motion.button>
          </Link>
        </div>
        <BookAnimation onOpenBook={handleOpenBook} />
      </section>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="modal-content">
          <h2>Your Love Story Journey</h2>
          <p>This is where your personalized love story begins!</p>
          <p>Follow these steps to create your magical storybook:</p>
          <ol>
            <li>Choose your characters and setting</li>
            <li>Craft your unique love story</li>
            <li>Select beautiful illustrations</li>
            <li>Review and customize your book</li>
            <li>Order your personalized storybook</li>
          </ol>

          <button
            className="start-journey-button"
            onClick={() => setIsModalOpen(false)}
          >
            Begin Your Journey
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
