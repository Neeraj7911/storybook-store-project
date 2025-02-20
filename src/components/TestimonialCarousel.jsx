"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    text: "StoryMagic transformed our family time! We create unforgettable stories together.",
    author: "Sarah M., Parent",
    rating: 5,
  },
  {
    id: 2,
    text: "As a teacher, I've seen my students' creativity soar with StoryMagic. It's an invaluable tool!",
    author: "John D., Educator",
    rating: 5,
  },
  {
    id: 3,
    text: "I've always wanted to write, and StoryMagic gave me the perfect starting point. Now I'm a published author!",
    author: "Emily R., Aspiring Author",
    rating: 5,
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

  return (
    <div className="testimonial-carousel">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="testimonial"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <p>&quot;{testimonials[currentIndex].text}&quot;</p>
          <div className="testimonial-author">
            <span>{testimonials[currentIndex].author}</span>
            <div className="testimonial-rating">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <span key={i} className="star">
                  ★
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TestimonialCarousel;
