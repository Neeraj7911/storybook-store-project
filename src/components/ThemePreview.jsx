import { useState } from "react";
import { motion } from "framer-motion";

const themes = [
  { name: "Fantasy", color: "#7B68EE", icon: "🧙‍♂️" },
  { name: "Sci-Fi", color: "#4CAF50", icon: "🚀" },
  { name: "Adventure", color: "#FFA500", icon: "🗺️" },
  { name: "Mystery", color: "#800080", icon: "🕵️‍♀️" },
];

const ThemePreview = () => {
  const [activeTheme, setActiveTheme] = useState(0);

  return (
    <div className="theme-preview-container">
      {themes.map((theme, index) => (
        <motion.div
          key={theme.name}
          className="theme-item"
          style={{ backgroundColor: theme.color }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTheme(index)}
        >
          <span className="theme-icon">{theme.icon}</span>
          <span className="theme-name">{theme.name}</span>
        </motion.div>
      ))}
      <motion.div
        className="theme-highlight"
        animate={{
          x: activeTheme * 120,
          backgroundColor: themes[activeTheme].color,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
};

export default ThemePreview;
