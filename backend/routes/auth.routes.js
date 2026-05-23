const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);
router.get("/preferences", authMiddleware, authController.getPreferences);
router.put("/preferences", authMiddleware, authController.updatePreferences);

module.exports = router;
