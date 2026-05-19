// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMap, FiCpu, FiCloud, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: FiCpu,
      title: "AI-Powered Planning",
      desc: "Smart itineraries tailored to your preferences",
    },
    {
      icon: FiMap,
      title: "Interactive Maps",
      desc: "Explore destinations with detailed maps",
    },
    {
      icon: FiCloud,
      title: "Real-time Weather",
      desc: "Stay updated with weather forecasts",
    },
    {
      icon: FiTrendingUp,
      title: "Budget Tracking",
      desc: "Manage and optimize your travel budget",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-gradient"></div>

        <div className="relative max-w-8xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">AI Travel Planner</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Plan your perfect trip with AI-powered itineraries, real-time
              weather, and interactive maps
            </p>

            {!user && (
              <div className="space-x-4">
                <Link to="/register" className="inline-block btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="inline-block btn-secondary">
                  Sign In
                </Link>
              </div>
            )}

            {user && (
              <Link to="/dashboard" className="inline-block btn-primary">
                Go to Dashboard
              </Link>
            )}
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center hover:shadow-2xl transition-all duration-300"
              >
                <feature.icon className="text-4xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
