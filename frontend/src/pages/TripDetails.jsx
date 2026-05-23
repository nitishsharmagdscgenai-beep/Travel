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
import "../styles/pages/TripDetails.css";

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

// Enhanced geocoding function
const getCoordinates = async (destination) => {
  const commonCoordinates = {
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
  if (commonCoordinates[key]) {
    return commonCoordinates[key];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "TravelAI-App/1.0",
        },
      },
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return [20.5937, 78.9629];
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
      const coords = await getCoordinates(response.data.destination);
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading trip details...</p>
      </div>
    );
  }

  if (!trip) return null;

  const itinerary = trip.itinerary;
  const dailyItinerary = itinerary?.dailyItinerary || [];

  // Function to normalize budget - MOVED HERE after itinerary is defined
  const getNormalizedBudget = () => {
    const estimatedBudget = itinerary?.estimatedBudget;
    const actualBudget = trip.estimatedCost || trip.budget;

    if (!estimatedBudget || !actualBudget) return null;

    const estimatedTotal =
      estimatedBudget.total ||
      estimatedBudget.accommodation +
        estimatedBudget.food +
        estimatedBudget.activities +
        estimatedBudget.transport;

    if (estimatedTotal === 0) return null;

    const ratio = actualBudget / estimatedTotal;

    let accommodation = Math.round(estimatedBudget.accommodation * ratio);
    let food = Math.round(estimatedBudget.food * ratio);
    let activities = Math.round(estimatedBudget.activities * ratio);
    let transport = Math.round(estimatedBudget.transport * ratio);

    // Adjust to make total exact
    const sum = accommodation + food + activities + transport;
    const diff = actualBudget - sum;
    accommodation += diff;

    return {
      accommodation,
      food,
      activities,
      transport,
      total: actualBudget,
    };
  };

  const normalizedBudget = getNormalizedBudget();

  return (
    <div className="trip-details-container">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="trip-header"
      >
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          <FiArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="trip-header-main">
          <div className="trip-info-section">
            <h1 className="trip-title">{trip.destination}</h1>
            <div className="trip-meta">
              <span className="meta-badge">
                <FiCalendar size={14} /> {trip.days} days
              </span>
              <span className="meta-badge">
                <FiDollarSign size={14} />{" "}
                {formatINR(trip.estimatedCost || trip.budget)}
              </span>
              <span className="meta-badge">
                <FiMapPin size={14} /> {trip.travelStyle} travel
              </span>
            </div>
          </div>

          <div className="trip-actions">
            <button
              onClick={handleExport}
              className="action-btn trip-export-btn"
            >
              <FiDownload size={16} /> Export
            </button>
            <button
              onClick={handleDelete}
              className="action-btn trip-delete-btn"
            >
              <FiTrash2 size={16} /> Delete Trip
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
          className="weather-card"
        >
          <h2 className="section-title">
            <FiSun className="section-icon" /> Weather in {weather.city}
          </h2>
          <div className="weather-grid">
            <div className="weather-item">
              <div className="weather-value">
                {Math.round(weather.temperature)}°C
              </div>
              <div className="weather-label">Temperature</div>
            </div>
            <div className="weather-item">
              <div className="weather-value">{weather.humidity}%</div>
              <div className="weather-label">Humidity</div>
            </div>
            <div className="weather-item">
              <div className="weather-value">{weather.windSpeed} km/h</div>
              <div className="weather-label">Wind Speed</div>
            </div>
            <div className="weather-item">
              <div className="weather-value capitalize">
                {weather.condition}
              </div>
              <div className="weather-label">Condition</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Itinerary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="itinerary-card"
      >
        <h2 className="section-title">Your Travel Itinerary</h2>
        <div className="itinerary-list">
          {dailyItinerary.map((day, idx) => (
            <div key={idx} className="itinerary-day">
              <div className="day-header">
                <span className="day-number">Day {day.day || idx + 1}</span>
              </div>
              <div className="day-content">
                {day.activities && day.activities.length > 0 && (
                  <div className="day-section">
                    <h4>
                      <FiClock size={14} /> Activities
                    </h4>
                    <ul>
                      {day.activities.map((activity, i) => (
                        <li key={i}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {day.meals && day.meals.length > 0 && (
                  <div className="day-section">
                    <h4>
                      <FiCoffee size={14} /> Meals
                    </h4>
                    <ul>
                      {day.meals.map((meal, i) => (
                        <li key={i}>{meal}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {day.accommodation && (
                  <div className="day-section">
                    <h4>
                      <FiHome size={14} /> Accommodation
                    </h4>
                    <p>{day.accommodation}</p>
                  </div>
                )}
                {day.transport && (
                  <div className="day-section">
                    <h4>
                      <FiMap size={14} /> Transport
                    </h4>
                    <p>{day.transport}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations Section */}
      <div className="recommendations-grid">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="recommendation-card"
        >
          <h3>
            <FiCamera size={18} /> Recommended Places
          </h3>
          <ul>
            {itinerary?.recommendedPlaces?.map((place, idx) => (
              <li key={idx}>
                <span className="bullet">•</span>
                <span>{place}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="recommendation-card"
        >
          <h3>
            <FiCoffee size={18} /> Food Suggestions
          </h3>
          <ul>
            {itinerary?.foodSuggestions?.map((food, idx) => (
              <li key={idx}>
                <span className="bullet">•</span>
                <span>{food}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Travel Tips & Budget */}
      <div className="tips-budget-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="tips-card"
        >
          <h3>💡 Travel Tips</h3>
          <ul>
            {itinerary?.travelTips?.map((tip, idx) => (
              <li key={idx}>
                <span className="bullet">✨</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="budget-card"
        >
          <h3>💰 Budget Breakdown</h3>
          {normalizedBudget ? (
            <div className="budget-list">
              <div className="budget-item">
                <span>Accommodation</span>
                <span className="budget-amount">
                  {formatINR(normalizedBudget.accommodation)}
                </span>
              </div>
              <div className="budget-item">
                <span>Food</span>
                <span className="budget-amount">
                  {formatINR(normalizedBudget.food)}
                </span>
              </div>
              <div className="budget-item">
                <span>Activities</span>
                <span className="budget-amount">
                  {formatINR(normalizedBudget.activities)}
                </span>
              </div>
              <div className="budget-item">
                <span>Transport</span>
                <span className="budget-amount">
                  {formatINR(normalizedBudget.transport)}
                </span>
              </div>
              <div className="budget-total">
                <span>Total</span>
                <span>{formatINR(normalizedBudget.total)}</span>
              </div>
            </div>
          ) : (
            <p className="no-data">Budget breakdown not available</p>
          )}
        </motion.div>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="map-card"
      >
        <button onClick={() => setShowMap(!showMap)} className="map-toggle-btn">
          {showMap ? "Hide Map" : "Show Map"}
        </button>

        {showMap && (
          <div className="map-container">
            <MapContainer
              key={mapCoordinates[0]}
              center={mapCoordinates}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={mapCoordinates}>
                <Popup>
                  <div className="map-popup">
                    <strong>{trip?.destination}</strong>
                    <br />
                    <span>Your dream destination!</span>
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
