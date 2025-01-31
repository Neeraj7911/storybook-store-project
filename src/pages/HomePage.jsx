import { motion } from "framer-motion";
import ThemeSelection from "../components/ThemeSelection";
import PhotoUpload from "../components/PhotoUpload";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Create Your Own Storybook!</h1>
        <p>Bring your imagination to life with our custom storybook creator.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cta-button"
        >
          Get Started
        </motion.button>
      </motion.section>
      <ThemeSelection />
      <PhotoUpload />
    </div>
  );
};

export default HomePage;
