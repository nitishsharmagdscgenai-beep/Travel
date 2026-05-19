import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
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
import {
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiClock,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import { tripAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import SkeletonLoader from "../components/SkeletonLoader";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBudget: 0,
    averageDays: 0,
    favoriteDestination: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchTrips();
  }, []);

  const formatINR = (amount) => {
    if (!amount && amount !== 0) return "₹0";
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
      calculateStats(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tripsData) => {
    const totalTrips = tripsData.length;
    const totalBudget = tripsData.reduce(
      (sum, trip) => sum + (trip.estimatedCost || trip.budget || 0),
      0,
    );
    const averageDays =
      tripsData.reduce((sum, trip) => sum + trip.days, 0) / totalTrips || 0;

    const destinations = tripsData.map((trip) => trip.destination);
    const favoriteDestination = getMostFrequent(destinations);

    setStats({
      totalTrips,
      totalBudget,
      averageDays: Math.round(averageDays),
      favoriteDestination: favoriteDestination || "None",
    });
  };

  const getMostFrequent = (arr) => {
    if (arr.length === 0) return "None";
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length,
      )
      .pop();
  };

  const handleViewTrip = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  const handleDeleteTrip = async (tripId, e) => {
    e.stopPropagation(); // Prevent triggering the view trip
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await tripAPI.delete(tripId);
        toast.success("Trip deleted successfully");
        fetchTrips(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete trip");
      }
    }
  };

  // Prepare chart data with proper formatting
  const budgetData = trips.slice(0, 5).map((trip) => ({
    name: trip.destination.substring(0, 10),
    budget: trip.estimatedCost || trip.budget || 0,
    days: trip.days,
  }));

  const destinationsData = trips.reduce((acc, trip) => {
    acc[trip.destination] = (acc[trip.destination] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(destinationsData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="text-sm">
              <span style={{ color: p.color }}>{p.name}: </span>
              {p.name === "budget"
                ? formatINR(p.value)
                : p.name === "days"
                  ? `${p.value} days`
                  : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="card" />
        <SkeletonLoader type="chart" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h1 className="text-3xl font-bold gradient-text">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's an overview of your travel journey
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6">
          <FiMapPin className="text-3xl text-green-600 mb-3" />
          <h3 className="text-2xl font-bold">{stats.totalTrips}</h3>
          <p className="text-gray-600 dark:text-gray-400">Total Trips</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6">
          <FiDollarSign className="text-3xl text-green-600 mb-3" />
          <h3 className="text-2xl font-bold">{formatINR(stats.totalBudget)}</h3>
          <p className="text-gray-600 dark:text-gray-400">Total Budget</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6">
          <FiCalendar className="text-3xl text-green-600 mb-3" />
          <h3 className="text-2xl font-bold">{stats.averageDays}</h3>
          <p className="text-gray-600 dark:text-gray-400">Avg. Trip Days</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6">
          <FiTrendingUp className="text-3xl text-green-600 mb-3" />
          <h3 className="text-2xl font-bold truncate">
            {stats.favoriteDestination}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Favorite Destination
          </p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Trip Budget Overview</h3>
          {budgetData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="budget"
                  fill="#3B82F6"
                  name="Budget"
                />
                <Bar
                  yAxisId="right"
                  dataKey="days"
                  fill="#8B5CF6"
                  name="Days"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No trips yet. Create your first trip!
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Popular Destinations</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
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
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No destination data yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Trips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Trips</h3>
          {trips.length > 0 && (
            <button
              onClick={() => navigate("/create-trip")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Plan New Trip
            </button>
          )}
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start planning your first adventure!
            </p>
            <button
              onClick={() => navigate("/create-trip")}
              className="btn-primary"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.slice(0, 5).map((trip, index) => (
              <motion.div
                key={trip._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleViewTrip(trip._id)}
                className="group flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 cursor-pointer transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                      {trip.destination?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        {trip.destination}
                      </h4>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="text-xs" /> {trip.days} days
                        </span>
                        <span className="flex items-center gap-1">
                          <FiDollarSign className="text-xs" />{" "}
                          {formatINR(trip.estimatedCost || trip.budget)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="text-xs" />
                          {new Date(trip.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleViewTrip(trip._id)}
                    className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    title="View Details"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={(e) => handleDeleteTrip(trip._id, e)}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    title="Delete Trip"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}

            {trips.length > 5 && (
              <div className="text-center pt-4">
                <button
                  onClick={() => navigate("/profile")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all {trips.length} trips →
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Quick Stats Section */}
      {trips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Travel Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <p className="text-sm opacity-90">Most Expensive Trip</p>
              <p className="text-xl font-bold mt-1">
                {trips.length > 0 &&
                  formatINR(
                    Math.max(...trips.map((t) => t.estimatedCost || t.budget)),
                  )}
              </p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <p className="text-sm opacity-90">Longest Trip</p>
              <p className="text-xl font-bold mt-1">
                {trips.length > 0 && Math.max(...trips.map((t) => t.days))} days
              </p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <p className="text-sm opacity-90">Average Budget per Day</p>
              <p className="text-xl font-bold mt-1">
                {trips.length > 0 &&
                  formatINR(
                    trips.reduce(
                      (sum, t) => sum + (t.estimatedCost || t.budget) / t.days,
                      0,
                    ) / trips.length,
                  )}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
