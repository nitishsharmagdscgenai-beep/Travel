const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  preferences: {
    travelStyle: {
      type: String,
      enum: ["budget", "moderate", "luxury"],
      default: "moderate",
    },
    favoriteDestinations: {
      type: String,
      default: "",
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    language: {
      type: String,
      default: "en",
    },
    budgetRange: {
      type: String,
      enum: ["budget", "moderate", "luxury"],
      default: "moderate",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
