const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    // Use updated model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a travel assistant AI. Help the user with their travel query.
    Context: ${context || "General travel planning"}
    User Query: ${message}
    
    Provide helpful, concise travel advice about destinations, accommodations, local cuisine, hidden gems, budget tips, and weather considerations.
    Keep responses friendly and informative.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      reply: text,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      message: "Error processing chat",
      error: error.message,
    });
  }
};

exports.getPackingSuggestions = async (req, res) => {
  try {
    const { destination, days, weather } = req.body;

    // Use updated model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create a packing list for a ${days}-day trip to ${destination}.
    Weather conditions: ${weather || "Unknown"}
    
    Provide a JSON response with this exact structure:
    {
      "essentials": ["item1", "item2", "item3"],
      "clothing": ["item1", "item2", "item3"],
      "electronics": ["item1", "item2"],
      "toiletries": ["item1", "item2", "item3"],
      "miscellaneous": ["item1", "item2"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse JSON
    const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    const suggestions = JSON.parse(cleanText);

    res.json(suggestions);
  } catch (error) {
    console.error("Packing suggestions error:", error);
    // Fallback response
    res.json({
      essentials: ["Passport", "Tickets", "Wallet", "Phone"],
      clothing: ["Weather-appropriate clothes", "Comfortable shoes"],
      electronics: ["Phone charger", "Power bank"],
      toiletries: ["Toothbrush", "Toothpaste", "Shampoo"],
      miscellaneous: ["First aid kit", "Snacks", "Water bottle"],
    });
  }
};
