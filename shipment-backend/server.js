require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);

// Serve React Build
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});