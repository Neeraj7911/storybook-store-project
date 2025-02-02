import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import BookAnimation from "../components/BookAnimation";
import ParticleEffect from "../components/ParticleEffect";
import "./HomePage.css";

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
        </div>
        <BookAnimation />
      </section>
    </div>
  );
};

export default HomePage;
