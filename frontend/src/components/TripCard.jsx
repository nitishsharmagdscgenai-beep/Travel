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

const TripCard = ({ trip, onDelete }) => {
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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/trip/${trip._id}`)}
      className="glass-card p-5 cursor-pointer group hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg">
            {trip.destination?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{trip.destination}</h3>
            <p className="text-xs text-gray-500">
              {new Date(trip.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
        >
          <FiTrash2 className="text-red-500" />
        </button>
      </div>

      <div className="space-y-2 ml-12">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FiCalendar className="text-gray-500" /> {trip.days} days
          </span>
          <span className="flex items-center gap-1">
            <FiDollarSign className="text-green-500" />{" "}
            {formatINR(trip.estimatedCost || trip.budget)}
          </span>
          <span className="flex items-center gap-1">
            <FiMapPin className="text-green-600" /> {trip.travelStyle}
          </span>
        </div>

        {trip.interests && trip.interests.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {trip.interests.slice(0, 3).map((interest, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700"
              >
                {interest}
              </span>
            ))}
            {trip.interests.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                +{trip.interests.length - 3}
              </span>
            )}
          </div>
        )}

        <button className="mt-2 text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
          <FiEye /> View Details
        </button>
      </div>
    </motion.div>
  );
};

export default TripCard;
