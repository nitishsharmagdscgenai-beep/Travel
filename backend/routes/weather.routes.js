// routes/weather.routes.js
const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weather.controller");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);
router.get("/", weatherController.getWeather);
router.get("/forecast", weatherController.getForecast);

module.exports = router;
