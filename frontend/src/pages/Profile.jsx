// src/pages/Profile.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // In a real app, you would have an update endpoint
      // const response = await api.put('/auth/profile', formData);
      // setUser(response.data);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const travelStats = [
    { label: "Total Trips", value: "12", color: "from-blue-500 to-cyan-500" },
    {
      label: "Countries Visited",
      value: "8",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Days Traveled",
      value: "45",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Budget Spent",
      value: "$12,450",
      color: "from-orange-500 to-red-500",
    },
  ];

  const recentActivity = [
    { action: "Created trip to Paris", date: "2 days ago", icon: "✈️" },
    { action: "Generated AI itinerary", date: "5 days ago", icon: "🤖" },
    { action: "Saved budget tips", date: "1 week ago", icon: "💰" },
    { action: "Chat with AI assistant", date: "2 weeks ago", icon: "💬" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <FiEdit2 className="text-blue-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  placeholder="Email"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
                  >
                    <FiSave /> Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold gradient-text">
                  {user?.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-2">
                  <FiMail /> {user?.email}
                </p>
                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <FiCalendar /> Member since{" "}
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <FiEdit2 /> Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {travelStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`glass-card p-6 bg-gradient-to-r ${stat.color}`}
          >
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            <p className="text-white/90 mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activity.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {activity.action}
                </span>
              </div>
              <span className="text-sm text-gray-500">{activity.date}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Travel Preferences</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Preferred Travel Style
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
              <option>Moderate</option>
              <option>Luxury</option>
              <option>Budget</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Favorite Destinations
            </label>
            <input
              type="text"
              placeholder="e.g., Paris, Tokyo, Bali"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Notifications
            </label>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="notifications" className="w-4 h-4" />
              <label htmlFor="notifications">
                Receive travel deals and tips
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
            </select>
          </div>
        </div>
        <button className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
          Save Preferences
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
