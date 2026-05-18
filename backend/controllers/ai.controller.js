// controllers/ai.controller.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a travel assistant AI. Help the user with their travel query.
    Context: ${context || "General travel planning"}
    User Query: ${message}
    
    Provide helpful, concise travel advice about destinations, accommodations, local cuisine, hidden gems, budget tips, and weather considerations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      reply: text,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    res
      .status(500)
      .json({ message: "Error processing chat", error: error.message });
  }
};

exports.getPackingSuggestions = async (req, res) => {
  try {
    const { destination, days, weather } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create a packing list for a ${days}-day trip to ${destination}.
    Weather conditions: ${weather || "Unknown"}
    Provide a JSON response with categories: essentials, clothing, electronics, toiletries, miscellaneous.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = JSON.parse(response.text());

    res.json(suggestions);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error generating packing suggestions",
        error: error.message,
      });
  }
};
