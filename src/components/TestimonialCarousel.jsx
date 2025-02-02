import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    text: "My kids love the stories we create together!",
    author: "Sarah M.",
  },
  {
    id: 2,
    text: "This app unleashed my creativity. Highly recommended!",
    author: "John D.",
  },
  {
    id: 3,
    text: "The perfect tool for aspiring young authors!",
    author: "Emily R.",
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
          <span>- {testimonials[currentIndex].author}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TestimonialCarousel;
