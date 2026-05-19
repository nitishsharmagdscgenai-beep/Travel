const Trip = require("../models/Trip");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Currency conversion rates (simplified - in production use API)
const exchangeRates = {
  INR: 1,
  USD: 83.5,
  EUR: 90.2,
  GBP: 105.3,
};

exports.generateItinerary = async (req, res) => {
  try {
    const {
      destination,
      days,
      budget,
      travelStyle,
      interests,
      currency = "INR",
    } = req.body;

    // Convert budget to USD for AI prompt (Gemini works better with USD)
    const budgetInUSD =
      currency === "INR" ? Math.round(budget / exchangeRates.USD) : budget;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Create a detailed travel itinerary for ${destination} for ${days} days.
    Budget: ${budgetInUSD} USD (approx ${budget} ${currency})
    Travel Style: ${travelStyle}
    Interests: ${interests.join(", ")}
    
    Important: Please provide all costs in ${currency} (Indian Rupees if INR).
    Use the exchange rate: 1 USD = ${exchangeRates.USD} ${currency}
    
    Please provide a JSON response with the following structure (make sure it's valid JSON):
    {
      "dailyItinerary": [
        {
          "day": 1,
          "activities": ["activity1", "activity2", "activity3"],
          "meals": ["breakfast place", "lunch place", "dinner place"],
          "accommodation": "hotel name",
          "transport": "transportation method",
          "estimatedCost": number in ${currency}
        }
      ],
      "recommendedPlaces": ["place1", "place2", "place3"],
      "foodSuggestions": ["food1", "food2", "food3"],
      "travelTips": ["tip1", "tip2", "tip3", "tip4"],
      "estimatedBudget": {
        "accommodation": number in ${currency},
        "food": number in ${currency},
        "activities": number in ${currency},
        "transport": number in ${currency},
        "total": number in ${currency}
      },
      "bestTimeToVisit": "time description"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let itinerary;
    try {
      const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      itinerary = JSON.parse(cleanText);

      // Ensure budget values are in INR
      if (itinerary.estimatedBudget) {
        itinerary.estimatedBudget.total = budget;
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Fallback with INR values
      const dailyBudget = Math.round(budget / days);
      itinerary = {
        dailyItinerary: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          activities: [
            `Explore ${destination}`,
            `Visit local attractions`,
            `Enjoy local cuisine`,
          ],
          meals: ["Local restaurant", "Street food", "Fine dining"],
          accommodation: "Centrally located hotel",
          transport: "Public transport / Walking",
          estimatedCost: Math.round(dailyBudget / 3),
        })),
        recommendedPlaces: [`Top attractions in ${destination}`],
        foodSuggestions: ["Local specialties"],
        travelTips: [
          "Book in advance",
          "Check local weather",
          "Learn basic phrases",
        ],
        estimatedBudget: {
          accommodation: Math.round(budget * 0.4),
          food: Math.round(budget * 0.3),
          activities: Math.round(budget * 0.2),
          transport: Math.round(budget * 0.1),
          total: budget,
        },
        bestTimeToVisit: "Check local season guide",
      };
    }

    // Create and save trip
    const trip = new Trip({
      userId: req.userId,
      destination,
      budget,
      currency,
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
      currency,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      message: "Error generating itinerary",
      error: error.message,
      suggestion: "Please check your GEMINI_API_KEY and model availability",
    });
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
