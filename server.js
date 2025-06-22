const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "https://moodlog-frontend.vercel.app",
  credentials: true
}));




app.use(express.json());

const moodRoutes = require("./routes/moods");
app.use("/api/moods", moodRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err.message));

app.get("/", (req, res) => {
  res.send("MoodLog API running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
