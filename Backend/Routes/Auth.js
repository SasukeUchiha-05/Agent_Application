const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

const router = express.Router();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register Route
router.post("/register", async (req, res) => {
    const { name, age, address, email, password } = req.body;
  
    if (!name || !age || !address || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, age, address, email, password: hashedPassword });
      
      await newUser.save();
  
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// PROFILE (Protected Route)
router.get("/profile", async (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: `Welcome ${decoded.email}` });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});

module.exports = router;
