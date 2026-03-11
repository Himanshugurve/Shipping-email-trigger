const express = require("express");

const router = express.Router();

const verifyAdmin = require("../middleware/authMiddleware");

const {
  createService,
  getServices,
  searchByPin,
  updateService
} = require("../controllers/serviceController");

// Create service (Protected)
router.post("/create", verifyAdmin, createService);

// Get all services (Protected)
router.get("/", verifyAdmin, getServices);

// Search by pincode (Protected)
router.get("/search/:pincode", verifyAdmin, searchByPin);

// Update service (Protected)
router.put("/update/:id", verifyAdmin, updateService);

module.exports = router;