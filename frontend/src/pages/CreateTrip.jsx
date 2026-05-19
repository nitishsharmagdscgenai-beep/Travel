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
    days: 2,
    budget: 10000, // Default budget in INR
    travelStyle: "moderate",
    interests: [],
    currency: "INR",
  });

  const travelStyles = [
    {
      value: "luxury",
      label: "Luxury",
      icon: "👑",
      color: "from-yellow-500 to-orange-500",
      minBudget: 50000,
    },
    {
      value: "moderate",
      label: "Moderate",
      icon: "⭐",
      color: "from-blue-500 to-cyan-500",
      minBudget: 10000,
    },
    {
      value: "budget",
      label: "Budget",
      icon: "💰",
      color: "from-green-500 to-emerald-500",
      minBudget: 5000,
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

  const handleTravelStyleChange = (style) => {
    const selectedStyle = travelStyles.find((s) => s.value === style);
    let newBudget = formData.budget;

    // Suggest budget based on travel style
    if (selectedStyle && formData.budget < selectedStyle.minBudget) {
      newBudget = selectedStyle.minBudget;
      toast.info(
        `${style.charAt(0).toUpperCase() + style.slice(1)} style typically starts from ₹${selectedStyle.minBudget.toLocaleString("en-IN")}`,
      );
    }

    setFormData({ ...formData, travelStyle: style, budget: newBudget });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    if (formData.budget < 1000) {
      toast.error("Budget should be at least ₹1,000 for a meaningful trip");
      return;
    }

    setLoading(true);
    try {
      const response = await tripAPI.generate({
        ...formData,
        currency: "INR",
      });
      toast.success("Trip generated successfully!");
      navigate(`/trip/${response.data.trip._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate trip");
    } finally {
      setLoading(false);
    }
  };

  // Format budget display
  const formatBudget = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
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
          Let AI plan the perfect itinerary tailored just for you (All costs in
          ₹ INR)
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
              placeholder="e.g., Manali, Goa, Jaipur, Paris, Tokyo"
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
                Budget (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  min="1000"
                  max="5000000"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget: parseInt(e.target.value),
                    })
                  }
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Current budget: {formatBudget(formData.budget)} for{" "}
                {formData.days} days (≈{" "}
                {Math.round(formData.budget / formData.days).toLocaleString(
                  "en-IN",
                )}{" "}
                ₹/day)
              </p>
            </div>
          </div>

          {/* Budget Range Indicator */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
            <p className="text-sm font-medium mb-2">Budget Range (₹ INR):</p>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Budget (₹5k-10k)</span>
              <span>Moderate (₹10k-₹50k)</span>
              <span>Luxury (₹50k+)</span>
            </div>
            <div className="mt-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-yellow-500 rounded-full"
                style={{
                  width: `${Math.min(100, (formData.budget / 100000) * 100)}%`,
                  transition: "width 0.3s ease",
                }}
              ></div>
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
                  onClick={() => handleTravelStyleChange(style.value)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    formData.travelStyle === style.value
                      ? `bg-gradient-to-r ${style.color} text-white border-transparent shadow-lg scale-105`
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                  }`}
                >
                  <div className="text-2xl mb-2">{style.icon}</div>
                  <div className="font-semibold">{style.label}</div>
                  <div className="text-xs mt-1 opacity-80">
                    From ₹{style.minBudget.toLocaleString("en-IN")}
                  </div>
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
              "Generate AI Itinerary (₹ INR)"
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
        <h3 className="text-lg font-semibold mb-3">💡 INR Budget Tips</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>• Domestic trips in India: ₹2,000-5,000 per day</li>
          <li>
            • International trips (Southeast Asia): ₹10,000-50,000 per day
          </li>
          <li>• International trips (Europe/USA): ₹50,000-1,50,000 per day</li>
          <li>• Luxury stays in India: ₹5,000-20,000 per night</li>
          <li>• Budget hostels: ₹500-1,500 per night</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default CreateTrip;
