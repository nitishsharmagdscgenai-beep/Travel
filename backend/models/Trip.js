// models/Trip.js
const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  travelStyle: {
    type: String,
    enum: ["luxury", "moderate", "budget"],
    default: "moderate",
  },
  interests: [
    {
      type: String,
    },
  ],
  itinerary: {
    type: Object,
    required: true,
  },
  weather: {
    type: Object,
  },
  estimatedCost: {
    type: Number,
  },
  mapLocations: [
    {
      name: String,
      lat: Number,
      lng: Number,
      description: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Trip", tripSchema);
