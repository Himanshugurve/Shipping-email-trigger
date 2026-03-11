const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use the MONGO_URI from .env
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDB;