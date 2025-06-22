const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log("📨 Received register request:", req.body);

  try {
    const existing = await User.findOne({ username });
    console.log("🔍 Checked for existing user");

    if (existing) {
      console.log("❗ Username already exists");
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed");

    const user = new User({ username, password: hashed });
    await user.save();
    console.log("✅ New user saved");

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
    res.status(500).json({ message: "Something went wrong on the server." });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2d',
    });

    res.json({ token, username: user.username });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: 'Login failed' });
  }
});


module.exports = router;
