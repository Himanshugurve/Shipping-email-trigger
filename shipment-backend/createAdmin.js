require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");
const sendEmail = require("./services/sendEmail");
const generatePassword = require("./utils/generatePassword");

mongoose.connect("mongodb://127.0.0.1:27017/shipmentDB");

async function createAdmin() {
  try {
    const email = "hrishikap38@gmail.com";

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    // 🔹 Generate Random Password
    const password = generatePassword(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email: email,
      password: hashedPassword
    });

    await admin.save();

    console.log("Admin Created");

    // Send email with credentials
    await sendEmail(email, password);

    console.log("Email Sent Successfully");

    process.exit();

  } catch (error) {
    console.log("Error:", error);
    process.exit(1);
  }
}

createAdmin();