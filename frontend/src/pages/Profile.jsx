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
  FiMapPin,
  FiDollarSign,
  FiGlobe,
  FiClock,
} from "react-icons/fi";
import toast from "react-hot-toast";
import "../styles/pages/Profile.css";

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
    { label: "Total Trips", value: "12", icon: FiMapPin },
    { label: "Countries Visited", value: "8", icon: FiGlobe },
    { label: "Days Traveled", value: "45", icon: FiCalendar },
    { label: "Budget Spent", value: "₹4,50,000", icon: FiDollarSign },
  ];

  const recentActivity = [
    { action: "Created trip to Paris", date: "2 days ago", icon: "✈️" },
    { action: "Generated AI itinerary", date: "5 days ago", icon: "🤖" },
    { action: "Saved budget tips", date: "1 week ago", icon: "💰" },
    { action: "Chat with AI assistant", date: "2 weeks ago", icon: "💬" },
  ];

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="profile-card"
      >
        <div className="profile-header">
          {/* Avatar */}
          <div className="avatar-section">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <button className="edit-avatar-btn">
              <FiEdit2 size={16} />
            </button>
          </div>

          {/* User Info */}
          <div className="user-info">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Name"
                  className="edit-input"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email"
                  className="edit-input"
                />
                <div className="edit-actions">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="save-btn"
                  >
                    <FiSave size={16} /> Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="cancel-btn"
                  >
                    <FiX size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="user-name">{user?.name}</h1>
                <p className="user-email">
                  <FiMail size={14} /> {user?.email}
                </p>
                <p className="user-member-since">
                  <FiCalendar size={14} /> Member since{" "}
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-profile-btn"
                >
                  <FiEdit2 size={16} /> Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {travelStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="stat-card"
          >
            <stat.icon className="stat-icon" />
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="activity-card"
      >
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="activity-item">
              <div className="activity-info">
                <span className="activity-icon">{activity.icon}</span>
                <span className="activity-action">{activity.action}</span>
              </div>
              <span className="activity-date">{activity.date}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="preferences-card"
      >
        <h2 className="section-title">Travel Preferences</h2>
        <div className="preferences-grid">
          <div className="preference-field">
            <label>Preferred Travel Style</label>
            <select className="preference-select">
              <option>Moderate</option>
              <option>Luxury</option>
              <option>Budget</option>
            </select>
          </div>
          <div className="preference-field">
            <label>Favorite Destinations</label>
            <input
              type="text"
              placeholder="e.g., Paris, Tokyo, Bali"
              className="preference-input"
            />
          </div>
          <div className="preference-field">
            <label>Email Notifications</label>
            <div className="checkbox-wrapper">
              <input type="checkbox" id="notifications" />
              <label htmlFor="notifications">
                Receive travel deals and tips
              </label>
            </div>
          </div>
          <div className="preference-field">
            <label>Currency</label>
            <select className="preference-select">
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>
        <button className="save-preferences-btn">Save Preferences</button>
      </motion.div>
    </div>
  );
};

export default Profile;
