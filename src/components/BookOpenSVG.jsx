import React from "react";
import { motion } from "framer-motion";

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
      initial={{ pathLength: 0, fill: "none" }}
      animate={{ pathLength: 1, fill: "url(#book-gradient-left)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
    <motion.path
      d="M90 20C90 17.2386 87.7614 15 85 15H55V85H85C87.7614 85 90 82.7614 90 80V20Z"
      fill="url(#book-gradient-right)"
      initial={{ pathLength: 0, fill: "none" }}
      animate={{ pathLength: 1, fill: "url(#book-gradient-right)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
    {[30, 40, 50, 60].map((y, index) => (
      <React.Fragment key={y}>
        <motion.path
          d={`M20 ${y}H40`}
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.5 + index * 0.1,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d={`M60 ${y}H80`}
          stroke="white"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.5 + index * 0.1,
            ease: "easeInOut",
          }}
        />
      </React.Fragment>
    ))}
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

export default BookOpenSVG;
