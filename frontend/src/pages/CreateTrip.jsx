// src/pages/CreateTrip.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiCompass,
  FiHeart,
  FiLoader,
} from "react-icons/fi";
import { tripAPI } from "../services/api";
import toast from "react-hot-toast";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    days: 3,
    budget: 1000,
    travelStyle: "moderate",
    interests: [],
  });

  const travelStyles = [
    {
      value: "luxury",
      label: "Luxury",
      icon: "👑",
      color: "from-yellow-500 to-orange-500",
    },
    {
      value: "moderate",
      label: "Moderate",
      icon: "⭐",
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "budget",
      label: "Budget",
      icon: "💰",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const interestOptions = [
    "Adventure",
    "Culture",
    "Food",
    "Nature",
    "Relaxation",
    "Shopping",
    "Nightlife",
    "History",
    "Art",
    "Photography",
  ];

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    setLoading(true);
    try {
      const response = await tripAPI.generate(formData);
      toast.success("Trip generated successfully!");
      navigate(`/trip/${response.data.trip._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Create Your Dream Trip
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Let AI plan the perfect itinerary tailored just for you
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FiMapPin className="text-blue-600" />
              Destination
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g., Paris, Tokyo, New York"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Days */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FiCalendar className="text-green-600" />
                Number of Days
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.days}
                onChange={(e) =>
                  setFormData({ ...formData, days: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FiDollarSign className="text-yellow-600" />
                Budget (USD)
              </label>
              <input
                type="number"
                min="100"
                max="100000"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FiCompass className="text-purple-600" />
              Travel Style
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {travelStyles.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, travelStyle: style.value })
                  }
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    formData.travelStyle === style.value
                      ? `bg-gradient-to-r ${style.color} text-white border-transparent shadow-lg scale-105`
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                  }`}
                >
                  <div className="text-2xl mb-2">{style.icon}</div>
                  <div className="font-semibold">{style.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FiHeart className="text-red-600" />
              Interests
            </label>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    formData.interests.includes(interest)
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FiLoader className="animate-spin" />
                Generating Your Trip...
              </span>
            ) : (
              "Generate AI Itinerary"
            )}
          </button>
        </form>
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-3">✨ Pro Tips</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            • Be specific about your destination for better recommendations
          </li>
          <li>• Select interests that match your travel style</li>
          <li>• Higher budget allows for more premium suggestions</li>
          <li>• The AI will create a detailed day-by-day itinerary</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default CreateTrip;
