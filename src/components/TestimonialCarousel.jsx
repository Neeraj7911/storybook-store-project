"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import "./TestimonialCarousel.css";

const testimonials = [
  {
    id: 1,
    text: "StoryMagic transformed our family time! We create unforgettable stories together.",
    author: "Sarah M.",
    role: "Parent",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    text: "As a teacher, I've seen my students' creativity soar with StoryMagic. It's invaluable!",
    author: "John D.",
    role: "Educator",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    text: "StoryMagic gave me the perfect start to write. Now I'm a published author!",
    author: "Emily R.",
    role: "Aspiring Author",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="tc-container">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="tc-testimonial"
          initial={{ opacity: 0, x: 100, rotate: 5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={{ opacity: 0, x: -100, rotate: -5 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="tc-avatar-wrapper">
            <motion.img
              src={testimonials[currentIndex].avatar}
              alt={testimonials[currentIndex].author}
              className="tc-avatar"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          <motion.p
            className="tc-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            "{testimonials[currentIndex].text}"
          </motion.p>
          <div className="tc-author-rating">
            <motion.div
              className="tc-author"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span className="tc-author-name">
                {testimonials[currentIndex].author}
              </span>
              <span className="tc-author-role">
                {testimonials[currentIndex].role}
              </span>
            </motion.div>
            <motion.div
              className="tc-rating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <FaStar key={i} className="tc-star" />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="tc-navigation">
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            className={`tc-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
            whileHover={{ scale: 1.2, backgroundColor: "#ff4757" }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
