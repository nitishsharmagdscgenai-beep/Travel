// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiMap } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center glass-card p-12 max-w-md"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1.1, 1.1, 1],
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-8xl mb-6"
        >
          🗺️
        </motion.div>

        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Oops! It seems like you're lost. The page you're looking for doesn't
          exist or has been moved.
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full btn-primary flex items-center justify-center gap-2"
          >
            <FiHome /> Go to Homepage
          </Link>
          <Link
            to="/dashboard"
            className="block w-full btn-secondary flex items-center justify-center gap-2"
          >
            <FiMap /> Go to Dashboard
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact our support team
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
