// routes/ai.routes.js
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.post("/chat", aiController.chatWithAI);
router.post("/packing-suggestions", aiController.getPackingSuggestions);

module.exports = router;
