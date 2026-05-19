// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
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
} from "react-icons/fi";
import { tripAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import SkeletonLoader from "../components/SkeletonLoader";

const Dashboard = () => {
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
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tripsData) => {
    const totalTrips = tripsData.length;
    const totalBudget = tripsData.reduce(
      (sum, trip) => sum + (trip.estimatedCost || 0),
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
    return arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length,
      )
      .pop();
  };

  // Sample chart data
  const budgetData = trips.slice(0, 5).map((trip) => ({
    name: trip.destination.substring(0, 10),
    budget: formatINR(trip.estimatedCost) || 0,
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
          <FiMapPin className="text-3xl text-blue-600 mb-3" />
          <h3 className="text-2xl font-bold">{stats.totalTrips}</h3>
          <p className="text-gray-600 dark:text-gray-400">Total Trips</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6">
          <FiDollarSign className="text-3xl text-green-600 mb-3" />
          <h3 className="text-2xl font-bold">{formatINR(stats.totalBudget)}</h3>
          <p className="text-gray-600 dark:text-gray-400">Total Budget</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6">
          <FiCalendar className="text-3xl text-purple-600 mb-3" />
          <h3 className="text-2xl font-bold">{stats.averageDays}</h3>
          <p className="text-gray-600 dark:text-gray-400">Avg. Trip Days</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="glass-card p-6">
          <FiTrendingUp className="text-3xl text-orange-600 mb-3" />
          <h3 className="text-2xl font-bold">{stats.favoriteDestination}</h3>
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#3B82F6" name="Budget ($)" />
              <Bar dataKey="days" fill="#8B5CF6" name="Days" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Popular Destinations</h3>
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
        </motion.div>
      </div>

      {/* Recent Trips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-4">Recent Trips</h3>
        <div className="space-y-4">
          {trips.slice(0, 5).map((trip, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div>
                <h4 className="font-semibold">{trip.destination}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {trip.days} days • Budget: $
                  {trip.estimatedCost?.toLocaleString()}
                </p>
              </div>
              <span className="text-sm text-blue-600">
                {new Date(trip.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
