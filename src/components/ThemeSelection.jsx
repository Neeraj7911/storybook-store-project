import { motion } from "framer-motion";
import "./ThemeSelection.css";

const themes = [
  "Fairy Tale",
  "Adventure",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Historical",
];

const ThemeSelection = () => {
  return (
    <section className="theme-selection">
      <h2>Choose Your Story Theme</h2>
      <div className="theme-grid">
        {themes.map((theme, index) => (
          <motion.div
            key={index}
            className="theme-item"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ThemeSelection;
