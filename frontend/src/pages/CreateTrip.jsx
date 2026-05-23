import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiCompass,
  FiHeart,
  FiLoader,
} from "react-icons/fi";
import { tripAPI } from "../services/api";
import toast from "react-hot-toast";
import "../styles/pages/CreateTrip.css";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    days: 3,
    budget: 30000,
    travelStyle: "moderate",
    interests: [],
  });

  const travelStyles = [
    { value: "luxury", label: "Luxury", icon: "👑", minBudget: 80000 },
    { value: "moderate", label: "Moderate", icon: "⭐", minBudget: 30000 },
    { value: "budget", label: "Budget", icon: "💰", minBudget: 10000 },
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
      const response = await tripAPI.generate({ ...formData, currency: "INR" });
      toast.success("Trip generated successfully!");
      navigate(`/trip/${response.data.trip._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate trip");
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (value) => {
    return new Intl.NumberFormat("en-IN", {
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="create-trip-container">
      <div className="create-trip-card">
        <h1 className="gradient-text">Create Your Dream Trip</h1>
        <p className="subtitle">
          Let AI plan the perfect itinerary tailored just for you
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FiMapPin /> Destination
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              placeholder="e.g., Manali, Goa, Jaipur, Paris, Tokyo"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FiCalendar /> Number of Days
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.days}
                onChange={(e) =>
                  setFormData({ ...formData, days: parseInt(e.target.value) })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FiDollarSign /> Budget
              </label>
              <input
                type="number"
                min="10000"
                max="5000000"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: parseInt(e.target.value) })
                }
                required
              />
              <small>
                Current: ₹{formatBudget(formData.budget)} for {formData.days}{" "}
                days
              </small>
            </div>
          </div>

          {/* After the budget input, add this budget range indicator */}
          <div className="budget-range">
            <div className="budget-range-label">
              <span>Budget Range</span>
            </div>
            <div className="budget-bar">
              <div
                className="budget-bar-fill"
                style={{
                  width: `${Math.min(100, (formData.budget / 500000) * 100)}%`,
                }}
              ></div>
            </div>
            <div className="budget-range-label" style={{ marginTop: "6px" }}>
              <span>₹10,000</span>
              <span>₹5,00,000+</span>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FiCompass /> Travel Style
            </label>
            <div className="styles-grid">
              {travelStyles.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, travelStyle: style.value })
                  }
                  className={`style-btn ${formData.travelStyle === style.value ? "active" : ""}`}
                >
                  <div className="style-icon">{style.icon}</div>
                  <div className="style-label">{style.label}</div>
                  <div className="style-budget">
                    From ₹{style.minBudget.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>
              <FiHeart /> Interests
            </label>
            <div className="interests-grid">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`interest-btn ${formData.interests.includes(interest) ? "active" : ""}`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <>
                <FiLoader className="spinning" /> Generating Your Trip...
              </>
            ) : (
              "Generate AI Itinerary"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
