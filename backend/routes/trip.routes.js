// routes/trip.routes.js
const express = require("express");
const router = express.Router();
const tripController = require("../controllers/trip.controller");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.post("/generate", tripController.generateItinerary);
router.get("/", tripController.getUserTrips);
router.get("/:id", tripController.getTripById);
router.put("/:id", tripController.updateTrip);
router.delete("/:id", tripController.deleteTrip);

module.exports = router;
