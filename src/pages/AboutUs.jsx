"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useAnimation,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { FaMagic, FaPencilAlt, FaBook, FaShare, FaStar } from "react-icons/fa";
import TestimonialCarousel from "../components/TestimonialCarousel";
import FeatureShowcase from "./FeatureShowcase.jsx";
import "./AboutUs.css";

const AboutUs = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const controls = useAnimation();
  const { scrollYProgress } = useScroll();

  const scenes = [
    {
      title: "Imagine",
      description: "Step into a world where stories come alive",
      icon: <FaMagic />,
      color: "#FF6B6B",
    },
    {
      title: "Create",
      description: "Craft your unique tale with our magical tools",
      icon: <FaPencilAlt />,
      color: "#4ECDC4",
    },
    {
      title: "Experience",
      description: "Watch your story unfold in stunning detail",
      icon: <FaBook />,
      color: "#45B7D1",
    },
    {
      title: "Share",
      description: "Spread the joy of your creation with loved ones",
      icon: <FaShare />,
      color: "#F7B731",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prevScene) => (prevScene + 1) % scenes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    controls.start({ opacity: [0, 1], transition: { duration: 1 } });
  }, [controls]);

  const handleSceneClick = (index) => {
    setCurrentScene(index);
  };

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="about-us-container">
      <motion.div className="magical-background" style={{ y: backgroundY }} />
      {/*
      <header className="site-header">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          StoryMagic
        </motion.h1>
        <nav>
          <motion.a
            href="#home"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Home
          </motion.a>
          <motion.a
            href="#about"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            About
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Contact
          </motion.a>
        </nav>
      </header>
*/}

      <main className="main-content">
        <motion.h2
          className="main-title"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Unleash Your Imagination
        </motion.h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            className="scene active"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="scene-icon"
              style={{ backgroundColor: scenes[currentScene].color }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              {scenes[currentScene].icon}
            </motion.div>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {scenes[currentScene].title}
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {scenes[currentScene].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <div className="scene-navigation">
          {scenes.map((scene, index) => (
            <motion.button
              key={index}
              className={`scene-dot ${index === currentScene ? "active" : ""}`}
              onClick={() => handleSceneClick(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">{scene.title}</span>
            </motion.button>
          ))}
        </div>

        <FeatureShowcase />

        <motion.div
          className="testimonial-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3>What Our Users Say</h3>
          <TestimonialCarousel />
        </motion.div>

        <motion.div
          className="cta-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.button
            className="cta-button"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(255, 107, 107, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Magical Journey
          </motion.button>
        </motion.div>

        <motion.div
          className="stats-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <div className="stat-item">
            <FaStar className="stat-icon" />
            <h4>1M+</h4>
            <p>Happy Users</p>
          </div>
          <div className="stat-item">
            <FaBook className="stat-icon" />
            <h4>5M+</h4>
            <p>Stories Created</p>
          </div>
          <div className="stat-item">
            <FaMagic className="stat-icon" />
            <h4>100+</h4>
            <p>Magical Tools</p>
          </div>
        </motion.div>
      </main>

      <motion.div
        className="floating-shapes"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {[...Array(10)].map((_, index) => (
          <motion.div
            key={index}
            className="shape"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default AboutUs;
