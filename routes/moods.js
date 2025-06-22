const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', authMiddleware, async (req, res) => {
  const { mood, note } = req.body;
  try {
    const newMood = new Mood({ mood, note, userId: req.user.id });
    await newMood.save();
    res.status(201).json(newMood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Add a mood
router.post('/', async (req, res) => {
  const { mood, note } = req.body;

  try {
    const newMood = new Mood({ mood, note });
    await newMood.save();
    res.status(201).json(newMood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Get all moods
router.get('/', async (req, res) => {
  try {
    const moods = await Mood.find().sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
