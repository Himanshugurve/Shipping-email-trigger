require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
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

// Serve React Build (only if build directory exists)
const buildPath = path.join(__dirname, "build");
const indexPath = path.join(buildPath, "index.html");

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  
  // Catch-all handler for React Router
  app.get(/.*/, (req, res) => {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("React build exists but index.html is missing");
    }
  });
} else {
  // Fallback for development
  app.get("/", (req, res) => {
    res.send("Shipment Admin Backend Running - No build directory found");
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});