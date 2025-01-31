import { motion } from "framer-motion";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            Custom Storybook is a platform that allows you to create
            personalized storybooks with your own photos and themes.
          </p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <motion.li whileHover={{ x: 5 }}>
              <a href="/">Home</a>
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <a href="/create">Create Story</a>
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <a href="/about">About</a>
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <a href="/contact">Contact</a>
            </motion.li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <motion.a href="#" whileHover={{ y: -5 }}>
              <i className="fab fa-facebook"></i>
            </motion.a>
            <motion.a href="#" whileHover={{ y: -5 }}>
              <i className="fab fa-twitter"></i>
            </motion.a>
            <motion.a href="#" whileHover={{ y: -5 }}>
              <i className="fab fa-instagram"></i>
            </motion.a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2023 Custom Storybook. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
