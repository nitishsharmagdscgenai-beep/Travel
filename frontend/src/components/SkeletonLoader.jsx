// src/components/SkeletonLoader.jsx
import React from "react";
import { motion } from "framer-motion";

const SkeletonLoader = ({ type = "card" }) => {
  const variants = {
    card: (
      <div className="glass-card p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    ),
    chart: (
      <div className="glass-card p-6">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    ),
  };

  return variants[type] || variants.card;
};

export default SkeletonLoader;
