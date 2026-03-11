const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    pincode: {
      type: Number,
      required: true,
      unique: true   // prevents duplicate pincodes
    },
    service: {
      type: String,
      required: true
    },
    tat: {
      type: Number,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);