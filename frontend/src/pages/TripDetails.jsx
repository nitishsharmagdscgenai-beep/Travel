import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiTrash2,
  FiDownload,
  FiSun,
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

// Component to handle theme-based map tiles
const MapTheme = () => {
  const map = useMap();
  const isDark = document.documentElement.classList.contains("dark");

  useEffect(() => {
    // You can change tile layer based on theme if needed
    console.log("Theme changed:", isDark ? "dark" : "light");
  }, [isDark]);

  return null;
};

// Simple geocoding function
const getCoordinates = (destination) => {
  const coordinates = {
    paris: [48.8566, 2.3522],
    london: [51.5074, -0.1278],
    "new york": [40.7128, -74.006],
    tokyo: [35.6762, 139.6503],
    dubai: [25.2048, 55.2708],
    singapore: [1.3521, 103.8198],
    bangkok: [13.7367, 100.5231],
    mumbai: [19.076, 72.8777],
    delhi: [28.6139, 77.209],
    goa: [15.2993, 74.124],
    jaipur: [26.9124, 75.7873],
    manali: [32.2432, 77.1892],
    kerala: [10.1632, 76.6413],
    chennai: [13.0827, 80.2707],
    bangalore: [12.9716, 77.5946],
    hyderabad: [17.385, 78.4867],
    kolkata: [22.5726, 88.3639],
    udaipur: [24.5854, 73.7125],
    shimla: [31.1048, 77.1734],
    rishikesh: [30.0869, 78.2676],
  };

  const key = destination?.toLowerCase();
  return coordinates[key] || [20.5937, 78.9629];
};

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState([20.5937, 78.9629]);

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
      const coords = getCoordinates(response.data.destination);
      setMapCoordinates(coords);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  const itinerary = trip.itinerary;
  const dailyItinerary = itinerary?.dailyItinerary || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Header - Same as before */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-4 flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors text-sm"
            >
              <FiArrowLeft size={16} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {trip.destination}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-500 dark:text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <FiCalendar size={14} /> {trip.days} days
              </span>
              <span className="flex items-center gap-1">
                <FiDollarSign size={14} />{" "}
                {formatINR(trip.estimatedCost || trip.budget)}
              </span>
              <span className="flex items-center gap-1">
                <FiMapPin size={14} /> {trip.travelStyle} travel
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-600 transition-all flex items-center gap-2 text-sm"
            >
              <FiDownload size={14} /> Export
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-2 text-sm"
            >
              <FiTrash2 size={14} /> Delete
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
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <FiSun className="text-gray-600" /> Current Weather in{" "}
            {weather.city}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {Math.round(weather.temperature)}°C
              </div>
              <div className="text-xs text-gray-500 mt-1">Temperature</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {weather.humidity}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Humidity</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {weather.windSpeed} m/s
              </div>
              <div className="text-xs text-gray-500 mt-1">Wind Speed</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                {weather.condition}
              </div>
              <div className="text-xs text-gray-500 mt-1">Condition</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Itinerary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Your Travel Itinerary
        </h2>
        <div className="space-y-4">
          {dailyItinerary.map((day, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
            >
              <div className="bg-green-600 text-white px-4 py-2">
                <h3 className="font-semibold">Day {day.day || idx + 1}</h3>
              </div>
              <div className="p-4 space-y-3">
                {day.activities && day.activities.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FiClock size={14} /> Activities
                    </h4>
                    <ul className="list-disc list-inside ml-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {day.activities.map((activity, i) => (
                        <li key={i}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {day.meals && day.meals.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FiCoffee size={14} /> Meals
                    </h4>
                    <ul className="list-disc list-inside ml-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {day.meals.map((meal, i) => (
                        <li key={i}>{meal}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {day.accommodation && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                      <FiHome size={14} /> Accommodation
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                      {day.accommodation}
                    </p>
                  </div>
                )}
                {day.transport && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                      <FiMap size={14} /> Transport
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                      {day.transport}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
            <FiCamera /> Recommended Places
          </h3>
          <ul className="space-y-2">
            {itinerary?.recommendedPlaces?.map((place, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-green-600 mt-1">•</span>
                <span className="text-gray-600 dark:text-gray-400">
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
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
            <FiCoffee /> Food Suggestions
          </h3>
          <ul className="space-y-2">
            {itinerary?.foodSuggestions?.map((food, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-green-600 mt-1">•</span>
                <span className="text-gray-600 dark:text-gray-400">{food}</span>
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
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            💡 Travel Tips
          </h3>
          <ul className="space-y-2">
            {itinerary?.travelTips?.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-green-600 mt-1">✨</span>
                <span className="text-gray-600 dark:text-gray-400">{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            💰 Budget Breakdown
          </h3>
          {itinerary?.estimatedBudget ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Accommodation
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatINR(itinerary.estimatedBudget.accommodation)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Food</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatINR(itinerary.estimatedBudget.food)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Activities
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatINR(itinerary.estimatedBudget.activities)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Transport
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatINR(itinerary.estimatedBudget.transport)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-2 flex justify-between font-semibold text-sm">
                <span>Total</span>
                <span className="text-green-600">
                  {formatINR(itinerary.estimatedBudget.total)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Budget breakdown not available
            </p>
          )}
        </motion.div>
      </div>

      {/* Map Section - Updated with better tile options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
      >
        <button
          onClick={() => setShowMap(!showMap)}
          className="mb-4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-600 transition-all text-sm"
        >
          {showMap ? "Hide Map" : "Show Map"}
        </button>

        {showMap && (
          <div className="h-96 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <MapContainer
              key={mapCoordinates[0]}
              center={mapCoordinates}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <MapTheme />
              {/* Option 1: CartoDB Voyager - Clean and neutral (Recommended) */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> | &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {/* Option 2: Stamen Toner - Black and white, very clean */}
              {/* <TileLayer
                attribution='Map tiles by <a href="http://stamen.com">Stamen</a>'
                url="https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png"
              /> */}

              {/* Option 3: Stamen Terrain - Subtle colors */}
              {/* <TileLayer
                attribution='Map tiles by <a href="http://stamen.com">Stamen</a>'
                url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png"
              /> */}

              <Marker position={mapCoordinates}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-gray-900">
                      {trip?.destination}
                    </strong>
                    <br />
                    <span className="text-sm text-gray-600">
                      Your dream destination!
                    </span>
                  </div>
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
  