// controllers/trip.controller.js
const Trip = require("../models/Trip");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateItinerary = async (req, res) => {
  try {
    const { destination, days, budget, travelStyle, interests } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create a detailed travel itinerary for ${destination} for ${days} days.
    Budget: ${budget} USD
    Travel Style: ${travelStyle}
    Interests: ${interests.join(", ")}
    
    Please provide a JSON response with the following structure:
    {
      "dailyItinerary": [
        {
          "day": 1,
          "activities": ["activity1", "activity2"],
          "meals": ["breakfast place", "lunch place", "dinner place"],
          "accommodation": "hotel name",
          "transport": "transportation method"
        }
      ],
      "recommendedPlaces": ["place1", "place2"],
      "foodSuggestions": ["food1", "food2"],
      "travelTips": ["tip1", "tip2"],
      "estimatedBudget": {
        "accommodation": number,
        "food": number,
        "activities": number,
        "transport": number,
        "total": number
      },
      "bestTimeToVisit": "time description"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const itinerary = JSON.parse(response.text());

    // Create and save trip
    const trip = new Trip({
      userId: req.userId,
      destination,
      budget,
      days,
      travelStyle,
      interests,
      itinerary,
      estimatedCost: itinerary.estimatedBudget?.total || budget,
    });

    await trip.save();

    res.status(201).json({
      message: "Itinerary generated successfully",
      trip,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    res
      .status(500)
      .json({ message: "Error generating itinerary", error: error.message });
  }
};

exports.getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true },
    );
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json({ message: "Trip updated successfully", trip });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
