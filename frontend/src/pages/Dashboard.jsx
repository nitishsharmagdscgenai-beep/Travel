import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiClock,
  FiUser,
  FiTrash2,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { tripAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
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

  const handleDeleteTrip = async (tripId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await tripAPI.delete(tripId);
        toast.success("Trip deleted successfully");
        fetchTrips();
      } catch (error) {
        toast.error("Failed to delete trip");
      }
    }
  };

  // Calculate statistics
  const stats = {
    totalTrips: trips.length,
    totalBudget: trips.reduce(
      (sum, trip) => sum + (trip.estimatedCost || trip.budget || 0),
      0,
    ),
    averageDays: trips.length
      ? Math.round(
          trips.reduce((sum, trip) => sum + trip.days, 0) / trips.length,
        )
      : 0,
    lastDestination: trips.length > 0 ? trips[0]?.destination : "No trips yet",
  };

  // Prepare chart data
  const budgetData = trips.slice(0, 6).map((trip) => ({
    name: trip.destination?.substring(0, 10),
    budget: trip.estimatedCost || trip.budget || 0,
  }));

  const destinationsData = trips.reduce((acc, trip) => {
    acc[trip.destination] = (acc[trip.destination] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(destinationsData).map(([name, value]) => ({
    name: name.length > 12 ? name.substring(0, 12) + "..." : name,
    value,
  }));

  const COLORS = [
    "#4caf50",
    "#66bb6a",
    "#81c784",
    "#a5d6a7",
    "#c8e6c9",
    "#2e7d32",
    "#388e3c",
    "#43a047",
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="welcome-card"
      >
        <div className="welcome-info">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Track your adventures and plan new journeys</p>
        </div>
        <div className="profile-avatar" onClick={() => navigate("/profile")}>
          <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <span>Profile</span>
        </div>
      </motion.div>

      {/* Recent Trips Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="recent-section"
      >
        <div className="section-title">
          <h2>Recent Trips</h2>
          <button
            onClick={() => navigate("/create-trip")}
            className="new-trip-btn"
          >
            + New Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="empty-trips">
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
          <div className="trips-grid">
            {trips.slice(0, 6).map((trip) => (
              <motion.div
                key={trip._id}
                whileHover={{ y: -5 }}
                className="trip-card"
                onClick={() => navigate(`/trip/${trip._id}`)}
              >
                <button
                  className="card-delete-btn"
                  onClick={(e) => handleDeleteTrip(trip._id, e)}
                  title="Delete trip"
                >
                  <FiTrash2 size={14} />
                </button>
                <div className="card-icon">
                  <FiMapPin size={24} />
                </div>
                <h3>{trip.destination}</h3>
                <div className="card-meta">
                  <span>
                    <FiCalendar size={12} /> {trip.days} days
                  </span>
                  <span>
                    <FiDollarSign size={12} />{" "}
                    {formatINR(trip.estimatedCost || trip.budget)}
                  </span>
                </div>
                {trip.interests && trip.interests.length > 0 && (
                  <div className="card-interests">
                    {trip.interests.slice(0, 3).map((interest, idx) => (
                      <span key={idx} className="interest-tag">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Insights Section with Charts */}
      {trips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="insights-section"
        >
          <div className="section-title">
            <h2>Travel Insights</h2>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stats-row"
          >
            <div className="stat-box">
              <FiMapPin className="stat-icon-green" />
              <div className="stat-info">
                <span className="stat-value">{stats.totalTrips}</span>
                <span className="stat-label">Total Trips</span>
              </div>
            </div>
            <div className="stat-box">
              <FiDollarSign className="stat-icon-green" />
              <div className="stat-info">
                <span className="stat-value">
                  {formatINR(stats.totalBudget)}
                </span>
                <span className="stat-label">Total Budget</span>
              </div>
            </div>
            <div className="stat-box">
              <FiCalendar className="stat-icon-green" />
              <div className="stat-info">
                <span className="stat-value">{stats.averageDays}</span>
                <span className="stat-label">Avg Days/Trip</span>
              </div>
            </div>
            <div className="stat-box">
              <FiTrendingUp className="stat-icon-green" />
              <div className="stat-info">
                <span className="stat-value">{stats.lastDestination}</span>
                <span className="stat-label">Last Destination</span>
              </div>
            </div>
          </motion.div>

          <div className="charts-row">
            {/* Budget Chart */}
            <div className="chart-card">
              <h3>Budget Overview</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value) => formatINR(value)}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #43a047",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="budget"
                      fill="#43a047 "
                      name="Budget (₹)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Destinations Chart */}
            <div className="chart-card">
              <h3>Popular Destinations</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={90}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
