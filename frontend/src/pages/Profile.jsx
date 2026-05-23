import React, { useState, useEffect } from "react";
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
  FiTrendingUp,
  FiAward,
  FiStar,
  FiCompass, // Add this
  FiBell, // Add this
  FiCreditCard, // Add this
} from "react-icons/fi";
import { tripAPI } from "../services/api";
import toast from "react-hot-toast";
import "../styles/pages/Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBudget: 0,
    totalDays: 0,
    uniqueDestinations: 0,
    favoriteDestination: "",
    averageBudgetPerDay: 0,
  });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  const [preferences, setPreferences] = useState({
    travelStyle: user?.preferences?.travelStyle || "moderate",
    favoriteDestinations: user?.preferences?.favoriteDestinations || "",
    emailNotifications: user?.preferences?.emailNotifications !== false,
    currency: user?.preferences?.currency || "INR",
    language: user?.preferences?.language || "en",
    budgetRange: user?.preferences?.budgetRange || "moderate",
  });

  useEffect(() => {
    fetchUserTrips();
    loadUserPreferences();
  }, []);

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fetchUserTrips = async () => {
    try {
      const response = await tripAPI.getAll();
      setTrips(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const calculateStats = (tripsData) => {
    const totalTrips = tripsData.length;
    const totalBudget = tripsData.reduce(
      (sum, trip) => sum + (trip.estimatedCost || trip.budget || 0),
      0,
    );
    const totalDays = tripsData.reduce((sum, trip) => sum + trip.days, 0);
    const uniqueDestinations = new Set(
      tripsData.map((trip) => trip.destination),
    ).size;

    const destinationCount = tripsData.reduce((acc, trip) => {
      acc[trip.destination] = (acc[trip.destination] || 0) + 1;
      return acc;
    }, {});

    const favoriteDestination = Object.keys(destinationCount).reduce(
      (a, b) => (destinationCount[a] > destinationCount[b] ? a : b),
      "",
    );

    const averageBudgetPerDay = totalDays > 0 ? totalBudget / totalDays : 0;

    setStats({
      totalTrips,
      totalBudget,
      totalDays,
      uniqueDestinations,
      favoriteDestination: favoriteDestination || "N/A",
      averageBudgetPerDay,
    });
  };

  const loadUserPreferences = async () => {
    try {
      const response = await fetch(`/api/auth/preferences`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          phone: formData.phone,
          location: formData.location,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        // Also update localStorage if you store user there
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        const updatedPrefs = await response.json();
        setPreferences(updatedPrefs);
        toast.success("Preferences saved successfully");
        setIsEditingPreferences(false);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Save failed");
      }
    } catch (error) {
      console.error("Save preferences error:", error);
      toast.error(error.message || "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const travelStats = [
    {
      label: "Total Trips",
      value: stats.totalTrips,
      icon: FiMapPin,
      color: "#0d530e",
    },
    {
      label: "Total Budget",
      value: formatINR(stats.totalBudget),
      icon: FiDollarSign,
      color: "#0d530e",
    },
    {
      label: "Days Traveled",
      value: stats.totalDays,
      icon: FiClock,
      color: "#0d530e",
    },
    {
      label: "Destinations",
      value: stats.uniqueDestinations,
      icon: FiGlobe,
      color: "#0d530e",
    },
  ];

  const achievementStats = [
    {
      label: "Favorite Destination",
      value: stats.favoriteDestination,
      icon: FiStar,
      color: "#0d530e",
    },
    {
      label: "Avg Budget/Day",
      value: formatINR(stats.averageBudgetPerDay),
      icon: FiTrendingUp,
      color: "#0d530e",
    },
    {
      label: "Adventure Score",
      value: "Explorer",
      icon: FiAward,
      color: "#0d530e",
    },
  ];

  function getAdventureScore() {
    const score = Math.min(
      100,
      Math.floor(stats.totalTrips * 10 + stats.uniqueDestinations * 5),
    );
    return `${score}%`;
  }

  const recentTrips = trips.slice(0, 4);

  return (
    <div className="profile-container">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="profile-header-card"
      >
        <div className="profile-cover"></div>
        <div className="profile-content">
          <div className="avatar-wrapper">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              className="edit-avatar-btn"
              onClick={() => setIsEditing(true)}
              title="Edit Profile"
            >
              <FiEdit2 size={14} />
            </button>
          </div>

          <div className="profile-details">
            {isEditing ? (
              <div className="edit-form-container">
                <div className="edit-form-grid">
                  <div className="edit-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="edit-field-input"
                    />
                  </div>
                  <div className="edit-field">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="edit-field-input"
                    />
                  </div>
                  <div className="edit-field">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="edit-field-input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="edit-field">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="edit-field-input"
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="edit-field">
                    <label>Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="edit-field-input edit-textarea"
                      rows="3"
                      placeholder="Tell us about your travel style..."
                    />
                  </div>
                </div>
                <div className="edit-actions">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="save-profile-btn"
                  >
                    <FiSave size={16} />{" "}
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="cancel-profile-btn"
                  >
                    <FiX size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="profile-name">{user?.name}</h1>
                <p className="profile-bio">
                  {user?.bio ||
                    "Travel enthusiast exploring the world one destination at a time 🌍"}
                </p>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <FiMail size={14} />
                    <span>{user?.email}</span>
                  </div>
                  <div className="profile-info-item">
                    <FiCalendar size={14} />
                    <span>
                      Member since{" "}
                      {new Date(
                        user?.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  {user?.phone && (
                    <div className="profile-info-item">
                      <FiUser size={14} />
                      <span>{user.phone}</span>
                    </div>
                  )}

                  {user?.location && (
                    <div className="profile-info-item">
                      <FiMapPin size={14} />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="stats-cards-section"
      >
        <h2 className="section-title">Travel Statistics</h2>
        <div className="stats-cards-grid">
          {travelStats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="achievements-section"
      >
        <h2 className="section-title">Achievements & Insights</h2>
        <div className="achievements-grid">
          {achievementStats.map((stat, idx) => (
            <div key={idx} className="achievement-card">
              <stat.icon size={28} color={stat.color} />
              <div>
                <p className="achievement-label">{stat.label}</p>
                <p className="achievement-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Trips Section */}
      {recentTrips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="recent-trips-section"
        >
          <h2 className="section-title">Recent Adventures</h2>
          <div className="recent-trips-grid">
            {recentTrips.map((trip) => (
              <div
                key={trip._id}
                className="recent-trip-card"
                onClick={() => (window.location.href = `/trip/${trip._id}`)}
              >
                <div className="trip-card-header">
                  <div className="trip-destination-icon">
                    {trip.destination?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{trip.destination}</h3>
                    <p>
                      {trip.days} days •{" "}
                      {formatINR(trip.estimatedCost || trip.budget)}
                    </p>
                  </div>
                </div>
                {trip.interests && (
                  <div className="trip-interests">
                    {trip.interests.slice(0, 3).map((interest, idx) => (
                      <span key={idx} className="interest-chip">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="preferences-section"
      >
        <div className="preferences-header">
          <h2 className="section-title">Travel Preferences</h2>
          {!isEditingPreferences && (
            <button
              onClick={() => setIsEditingPreferences(true)}
              className="edit-preferences-btn"
            >
              <FiEdit2 size={14} /> Edit
            </button>
          )}
        </div>

        {isEditingPreferences ? (
          <div className="preferences-edit-form">
            <div className="preferences-grid">
              <div className="preference-item">
                <label>Travel Style</label>
                <select
                  value={preferences.travelStyle}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      travelStyle: e.target.value,
                    })
                  }
                  className="preference-select"
                >
                  <option value="budget">Budget Traveler</option>
                  <option value="moderate">Moderate Traveler</option>
                  <option value="luxury">Luxury Traveler</option>
                </select>
              </div>

              <div className="preference-item">
                <label>Favorite Destinations</label>
                <input
                  type="text"
                  value={preferences.favoriteDestinations}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      favoriteDestinations: e.target.value,
                    })
                  }
                  placeholder="e.g., Paris, Tokyo, Bali"
                  className="preference-input"
                />
              </div>

              <div className="preference-item">
                <label>Email Notifications</label>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={preferences.emailNotifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        emailNotifications: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="notifications">
                    Receive travel deals and tips
                  </label>
                </div>
              </div>

              <div className="preference-item">
                <label>Currency</label>
                <select
                  value={preferences.currency}
                  onChange={(e) =>
                    setPreferences({ ...preferences, currency: e.target.value })
                  }
                  className="preference-select"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="JPY">Japanese Yen (¥)</option>
                </select>
              </div>

              <div className="preference-item">
                <label>Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) =>
                    setPreferences({ ...preferences, language: e.target.value })
                  }
                  className="preference-select"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div className="preference-item">
                <label>Budget Range</label>
                <select
                  value={preferences.budgetRange}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      budgetRange: e.target.value,
                    })
                  }
                  className="preference-select"
                >
                  <option value="budget">Budget (₹10k-30k per trip)</option>
                  <option value="moderate">Moderate (₹30k-1L per trip)</option>
                  <option value="luxury">Luxury (₹1L+ per trip)</option>
                </select>
              </div>
            </div>

            <div className="preferences-actions">
              <button
                onClick={handleSavePreferences}
                disabled={loading}
                className="save-preferences-btn"
              >
                <FiSave size={16} />{" "}
                {loading ? "Saving..." : "Save Preferences"}
              </button>
              <button
                onClick={() => setIsEditingPreferences(false)}
                className="cancel-preferences-btn"
              >
                <FiX size={16} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="preferences-display">
            <div className="preferences-grid-display">
              <div className="pref-display-item">
                <span className="pref-label">Travel Style</span>
                <span className="pref-value capitalize">
                  {preferences.travelStyle}
                </span>
              </div>
              <div className="pref-display-item">
                <span className="pref-label">Favorite Destinations</span>
                <span className="pref-value">
                  {preferences.favoriteDestinations || "Not specified"}
                </span>
              </div>
              <div className="pref-display-item">
                <span className="pref-label">Email Notifications</span>
                <span className="pref-value">
                  {preferences.emailNotifications ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="pref-display-item">
                <span className="pref-label">Currency</span>
                <span className="pref-value">{preferences.currency}</span>
              </div>
              <div className="pref-display-item">
                <span className="pref-label">Language</span>
                <span className="pref-value">
                  {preferences.language === "en"
                    ? "English"
                    : preferences.language}
                </span>
              </div>
              <div className="pref-display-item">
                <span className="pref-label">Budget Range</span>
                <span className="pref-value capitalize">
                  {preferences.budgetRange}
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
