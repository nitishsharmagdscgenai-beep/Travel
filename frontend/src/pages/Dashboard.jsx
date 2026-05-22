import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import { tripAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTrips();
  }, []);

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fetchTrips = async () => {
    try {
      const response = await tripAPI.getAll();
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalTrips: trips.length,
    totalBudget: trips.reduce(
      (sum, trip) => sum + (trip.estimatedCost || 0),
      0,
    ),
    averageDays: trips.length
      ? Math.round(
          trips.reduce((sum, trip) => sum + trip.days, 0) / trips.length,
        )
      : 0,
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's your travel journey overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FiMapPin className="stat-icon" />
          <div className="stat-value">{stats.totalTrips}</div>
          <div className="stat-label">Total Trips</div>
        </div>

        <div className="stat-card">
          <FiDollarSign className="stat-icon" />
          <div className="stat-value">{formatINR(stats.totalBudget)}</div>
          <div className="stat-label">Total Budget</div>
        </div>
        <div className="stat-card">
          <FiCalendar className="stat-icon" />
          <div className="stat-value">{stats.averageDays}</div>
          <div className="stat-label">Avg. Trip Days</div>
        </div>
        <div className="stat-card">
          <FiTrendingUp className="stat-icon" />
          <div className="stat-value">{trips.length || 0}</div>
          <div className="stat-label">Destinations</div>
        </div>
      </div>

      <div className="recent-trips-section">
        <div className="section-header">
          <h2>Recent Trips</h2>
          <button
            onClick={() => navigate("/create-trip")}
            className="secondary-btn"
          >
            + Plan New Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✈️</div>
            <h3>No trips yet</h3>
            <p>Start planning your first adventure!</p>
            <button
              onClick={() => navigate("/create-trip")}
              className="primary-btn"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="trips-list">
            {trips.slice(0, 5).map((trip) => (
              <div
                key={trip._id}
                className="trip-item"
                onClick={() => navigate(`/trip/${trip._id}`)}
              >
                <div className="trip-info">
                  <div className="trip-avatar">
                    {trip.destination?.charAt(0)}
                  </div>
                  <div>
                    <h4>{trip.destination}</h4>
                    <div className="trip-meta">
                      <span>
                        <FiCalendar size={12} /> {trip.days} days
                      </span>
                      <span>
                        <FiDollarSign size={12} />{" "}
                        {formatINR(trip.estimatedCost)}
                      </span>
                      <span>
                        <FiClock size={12} />{" "}
                        {new Date(trip.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
