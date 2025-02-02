import { motion } from "framer-motion";

const BookAnimation = () => {
  return (
    <motion.div
      className="floating-book"
      animate={{
        y: [0, -20, 0],
        rotateZ: [0, 5, -5, 0],
      }}
      transition={{
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    >
      📚
    </motion.div>
  );
};

export default BookAnimation;
