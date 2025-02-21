"use client";
import { motion } from "framer-motion";
import {
  FaWandMagicSparkles,
  FaPalette,
  FaRobot,
  FaCloud,
} from "react-icons/fa6";
import "./FeatureShowcase.css";
const features = [
  {
    icon: <FaWandMagicSparkles />, // Fixed icon
    title: "Story Generator",
    description: "Create unique stories with our AI-powered generator",
  },
  {
    icon: <FaPalette />,
    title: "Illustration Studio",
    description: "Bring your stories to life with custom illustrations",
  },
  {
    icon: <FaRobot />,
    title: "Character Creator",
    description: "Design memorable characters for your tales",
  },
  {
    icon: <FaCloud />,
    title: "Cloud Sync",
    description: "Access your stories from any device, anywhere",
  },
];

const FeatureShowcase = () => {
  return (
    <div className="feature-showcase">
      <h3>Magical Features</h3>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeatureShowcase;
