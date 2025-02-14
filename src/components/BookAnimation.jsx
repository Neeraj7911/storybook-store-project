import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "./Modal";
import "./BookAnimation.css";

const BookAnimation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
      setShowModal(true);
    }, 1000);
  };

  return (
    <>
      <div className="book-animation-container" onClick={handleClick}>
        <motion.div
          className="book-wrapper"
          animate={isOpen ? { rotateY: 180 } : {}}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                className="floating-book"
                animate={{
                  y: [0, -15, 0],
                  rotateZ: [0, 3, -3, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                exit={{ opacity: 0 }}
              >
                <BookSVG />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="open-book"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BookOpenSVG />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          className="book-shadow"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <BookContent />
      </Modal>
    </>
  );
};

const BookSVG = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M20 20H80V80C80 82.7614 77.7614 85 75 85H25C22.2386 85 20 82.7614 20 80V20Z"
      fill="url(#book-gradient)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    <motion.path
      d="M20 20H75C77.7614 20 80 22.2386 80 25V80"
      stroke="white"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M30 30H70"
      stroke="white"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
    />
    <motion.path
      d="M30 40H70"
      stroke="white"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 1.2, ease: "easeInOut" }}
    />
    <motion.path
      d="M30 50H70"
      stroke="white"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 1.4, ease: "easeInOut" }}
    />
    <defs>
      <linearGradient
        id="book-gradient"
        x1="20"
        y1="20"
        x2="80"
        y2="85"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ff6b6b" />
        <stop offset="1" stopColor="#feca57" />
      </linearGradient>
    </defs>
  </svg>
);

const BookOpenSVG = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M10 20C10 17.2386 12.2386 15 15 15H45V85H15C12.2386 85 10 82.7614 10 80V20Z"
      fill="url(#book-gradient-left)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
    <motion.path
      d="M90 20C90 17.2386 87.7614 15 85 15H55V85H85C87.7614 85 90 82.7614 90 80V20Z"
      fill="url(#book-gradient-right)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
    <motion.path
      d="M20 30H40"
      stroke="white"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M20 40H40"
      stroke="white"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.7, ease: "easeInOut" }}
    />
    <motion.path
      d="M60 30H80"
      stroke="white"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M60 40H80"
      stroke="white"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.7, ease: "easeInOut" }}
    />
    <defs>
      <linearGradient
        id="book-gradient-left"
        x1="10"
        y1="15"
        x2="45"
        y2="85"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ff6b6b" />
        <stop offset="1" stopColor="#feca57" />
      </linearGradient>
      <linearGradient
        id="book-gradient-right"
        x1="90"
        y1="15"
        x2="55"
        y2="85"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ff6b6b" />
        <stop offset="1" stopColor="#feca57" />
      </linearGradient>
    </defs>
  </svg>
);

const BookContent = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const pages = [
    {
      icon: "📚",
      title: "Your Story, Your Book – A Memory for a Lifetime!",
      content:
        "Ever dreamed of being the hero of your own story? With our personalized storybooks, you can bring your memories to life in a beautifully crafted book. Let’s get started!",
      image: "/pic1.jpeg",
    },
    {
      icon: "🌟",
      title: "Choose Your Story ThemePick a Story, Make It Yours!",
      content:
        "Choose from exciting themes—magical adventures, space explorations, fairytale lands, and more. Every story is crafted to make you the star!",
      image: "/pic1.jpeg",
    },
    {
      icon: "🚀",
      title: "Add Your Photos – Be the Star!",
      content:
        "Upload 8-10 pictures of yourself or your loved ones. Our smart AI will seamlessly blend them into the story, making it truly personal!",
      image: "/pic1.jpeg",
    },
    {
      icon: "🏆",
      title: "Your Name, Your Adventure!",
      content:
        "Add names, fun details, and personal messages. Your story will feel like it was written just for you!",
      image: "/pic1.jpeg",
    },

    {
      icon: "🏆",
      title: "Your Story, Ready to Print!",
      content:
        "Choose between a beautifully printed hardcover book or a digital PDF version. Pay securely and let us handle the rest!",
      image: "/pic1.jpeg",
    },
    {
      icon: "🏆",
      title: "Delivered to Your Doorstep!",
      content:
        "We print, pack, and ship your storybook with love! Get ready to hold your personalized story in your hands.",
      image: "/pic1.jpeg",
    },
  ];

  const nextPage = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextPage();
      } else if (event.key === "ArrowLeft") {
        prevPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextPage, prevPage]); // Added nextPage and prevPage as dependencies

  return (
    <div className="book-content">
      <h2>Interactive Journey</h2>
      <div className="animation-container">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="animation-step"
          >
            <motion.img
              src={pages[currentPage].image}
              alt={pages[currentPage].title}
              className="page-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="step-icon">{pages[currentPage].icon}</div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {pages[currentPage].title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {pages[currentPage].content}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="navigation-buttons">
        <motion.button
          onClick={prevPage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Previous
        </motion.button>
        <motion.button
          onClick={nextPage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
      </div>
      <div className="page-indicator">
        {pages.map((_, index) => (
          <motion.div
            key={index}
            className={`indicator ${index === currentPage ? "active" : ""}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: index === currentPage ? 1.2 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

const pageVariants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

export default BookAnimation;
