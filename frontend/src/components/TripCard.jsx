import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import { tripAPI } from "../services/api";
import toast from "react-hot-toast";
import "../styles/components/TripCard.css";

const TripCard = ({ trip, onDelete, compact = false }) => {
  const navigate = useNavigate();

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete trip to ${trip.destination}?`)) {
      try {
        await tripAPI.delete(trip._id);
        toast.success("Trip deleted successfully");
        if (onDelete) onDelete(trip._id);
      } catch (error) {
        toast.error("Failed to delete trip");
      }
    }
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(`/trip/${trip._id}`)}
        className="trip-card-compact"
      >
        <div className="trip-card-compact-content">
          <div className="trip-avatar-compact">
            {trip.destination?.charAt(0).toUpperCase()}
          </div>
          <div className="trip-card-compact-info">
            <h4 className="trip-title-compact">{trip.destination}</h4>
            <div className="trip-meta-compact">
              <span>
                <FiCalendar size={12} /> {trip.days}d
              </span>
              <span>
                <FiDollarSign size={12} />{" "}
                {formatINR(trip.estimatedCost || trip.budget)}
              </span>
            </div>
          </div>
          <button onClick={handleDelete} className="delete-btn-compact">
            <FiTrash2 size={14} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/trip/${trip._id}`)}
      className="trip-card"
    >
      {/* Rest of the full card implementation */}
      <div className="trip-card-header">
        <div className="trip-card-info">
          <div className="trip-avatar">
            {trip.destination?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="trip-title">{trip.destination}</h3>
            <p className="trip-date">
              {new Date(trip.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="delete-btn"
          title="Delete trip"
        >
          <FiTrash2 size={16} />
        </button>
      </div>

      <div className="trip-card-details">
        <div className="trip-meta">
          <span className="trip-meta-item">
            <FiCalendar size={14} /> {trip.days} days
          </span>
          <span className="trip-meta-item">
            <FiDollarSign size={14} />{" "}
            {formatINR(trip.estimatedCost || trip.budget)}
          </span>
          <span className="trip-meta-item">
            <FiMapPin size={14} /> {trip.travelStyle}
          </span>
        </div>

        {trip.interests && trip.interests.length > 0 && (
          <div className="trip-interests">
            {trip.interests.slice(0, 3).map((interest, idx) => (
              <span key={idx} className="interest-badge">
                {interest}
              </span>
            ))}
            {trip.interests.length > 3 && (
              <span className="interest-badge more">
                +{trip.interests.length - 3}
              </span>
            )}
          </div>
        )}

        <button className="view-details-btn">
          <FiEye size={14} /> View Details
        </button>
      </div>
    </motion.div>
  );
};

export default TripCard;
