import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiMap } from "react-icons/fi";
import "../styles/pages/NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="notfound-card"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1.1, 1.1, 1],
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="notfound-icon"
        >
          🗺️
        </motion.div>

        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Page Not Found</h2>
        <p className="notfound-message">
          Oops! It seems like you're lost. The page you're looking for doesn't
          exist or has been moved.
        </p>

        <div className="notfound-buttons">
          <Link to="/" className="home-btn">
            <FiHome size={18} /> Go to Homepage
          </Link>
          <Link to="/dashboard" className="dashboard-btn">
            <FiMap size={18} /> Go to Dashboard
          </Link>
        </div>

        <div className="notfound-footer">
          <p>Need help? Contact our support team</p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
