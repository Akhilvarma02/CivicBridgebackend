const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* =========================
   ✅ CORS CONFIG (PRODUCTION SAFE)
========================= */
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

/* =========================
   ✅ MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   ✅ ROUTES
========================= */
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

/* =========================
   ✅ ROOT ROUTE (HEALTH CHECK)
========================= */
app.get("/", (req, res) => {
  res.status(200).send("CivicBridge API is running 🚀");
});

/* =========================
   ✅ MONGODB CONNECTION (FIXED)
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

/* =========================
   ✅ GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

/* =========================
   ✅ SERVER START (RENDER SAFE)
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});