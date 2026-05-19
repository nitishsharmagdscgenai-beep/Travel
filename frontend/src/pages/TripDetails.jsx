// src/pages/TripDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiTrash2,
  FiEdit,
  FiDownload,
  FiSun,
  FiCloud,
  FiWind,
  FiThermometer,
  FiArrowLeft,
  FiCoffee,
  FiHome,
  FiMap,
  FiCamera,
} from "react-icons/fi";
import { tripAPI, weatherAPI } from "../services/api";
import toast from "react-hot-toast";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fetchTripDetails = async () => {
    try {
      const response = await tripAPI.getById(id);
      setTrip(response.data);
      fetchWeather(response.data.destination);
    } catch (error) {
      toast.error("Failed to load trip details");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city) => {
    try {
      const response = await weatherAPI.getWeather(city);
      setWeather(response.data);
    } catch (error) {
      console.error("Weather fetch error:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await tripAPI.delete(id);
        toast.success("Trip deleted successfully");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Failed to delete trip");
      }
    }
  };

  const handleExport = () => {
    const tripData = JSON.stringify(trip, null, 2);
    const blob = new Blob([tripData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trip-${trip.destination}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Trip exported successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  const itinerary = trip.itinerary;
  const dailyItinerary = itinerary?.dailyItinerary || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
            >
              <FiArrowLeft /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold gradient-text">
              {trip.destination}
            </h1>
            <div className="flex gap-4 mt-2 text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FiCalendar /> {trip.days} days
              </span>
              <span className="flex items-center gap-1">
                <FiDollarSign /> {formatINR(trip.estimatedCost)}
              </span>
              <span className="flex items-center gap-1">
                <FiMapPin /> {trip.travelStyle} travel
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <FiDownload /> Export
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      </motion.div>

      {/* Weather Section */}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiSun className="text-yellow-500" /> Current Weather in{" "}
            {weather.city}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {Math.round(weather.temperature)}°C
              </div>
              <div className="text-sm text-gray-600">Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{weather.humidity}%</div>
              <div className="text-sm text-gray-600">Humidity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{weather.windSpeed} m/s</div>
              <div className="text-sm text-gray-600">Wind Speed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold capitalize">
                {weather.condition}
              </div>
              <div className="text-sm text-gray-600">Condition</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Itinerary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-semibold mb-6">Your Travel Itinerary</h2>

        {dailyItinerary.map((day, idx) => (
          <div key={idx} className="mb-8 last:mb-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-t-xl">
              <h3 className="text-lg font-semibold">
                Day {day.day || idx + 1}
              </h3>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-b-xl p-4 space-y-3">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <FiClock /> Activities
                </h4>
                <ul className="list-disc list-inside ml-4 text-gray-600 dark:text-gray-400">
                  {day.activities?.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <FiCoffee /> Meals
                </h4>
                <ul className="list-disc list-inside ml-4 text-gray-600 dark:text-gray-400">
                  {day.meals?.map((meal, i) => (
                    <li key={i}>{meal}</li>
                  ))}
                </ul>
              </div>
              {day.accommodation && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <FiHome /> Accommodation
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {day.accommodation}
                  </p>
                </div>
              )}
              {day.transport && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <FiMap /> Transport
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {day.transport}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Recommendations Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FiCamera /> Recommended Places
          </h3>
          <ul className="space-y-2">
            {itinerary?.recommendedPlaces?.map((place, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {place}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FiCoffee /> Food Suggestions
          </h3>
          <ul className="space-y-2">
            {itinerary?.foodSuggestions?.map((food, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span className="text-gray-700 dark:text-gray-300">{food}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Travel Tips & Budget */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-3">💡 Travel Tips</h3>
          <ul className="space-y-2">
            {itinerary?.travelTips?.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">✨</span>
                <span className="text-gray-700 dark:text-gray-300">{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-3">💰 Budget Breakdown</h3>
          {itinerary?.estimatedBudget && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Accommodation</span>
                <span className="font-semibold">
                  {formatINR(itinerary.estimatedBudget.accommodation)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Food</span>
                <span className="font-semibold">
                  {formatINR(itinerary.estimatedBudget.food)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Activities</span>
                <span className="font-semibold">
                  {formatINR(itinerary.estimatedBudget.activities)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transport</span>
                <span className="font-semibold">
                  {formatINR(itinerary.estimatedBudget.transport)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatINR(itinerary.estimatedBudget.total)}</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <button
          onClick={() => setShowMap(!showMap)}
          className="mb-4 btn-secondary"
        >
          {showMap ? "Hide Map" : "Show Map"}
        </button>

        {showMap && (
          <div className="h-96 rounded-xl overflow-hidden">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Sample marker for destination - in production, use geocoding API */}
              <Marker position={[48.8566, 2.3522]}>
                <Popup>
                  {trip.destination}
                  <br />
                  Your destination!
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TripDetails;
