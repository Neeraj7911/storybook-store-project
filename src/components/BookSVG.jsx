import { motion } from "framer-motion";

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
      initial={{ pathLength: 0, fill: "none" }}
      animate={{ pathLength: 1, fill: "url(#book-gradient)" }}
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
    {[30, 40, 50].map((y, index) => (
      <motion.path
        key={y}
        d={`M30 ${y}H70`}
        stroke="white"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 1 + index * 0.2, ease: "easeInOut" }}
      />
    ))}
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

export default BookSVG;
