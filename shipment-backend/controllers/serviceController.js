const Service = require("../models/Service");
const transporter = require("../config/mailer");

// Create service
exports.createService = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Admin email from env:", process.env.EMAIL_USER);

    const { pincode, service, tat, phoneNumber, email } = req.body;
    const adminEmail = process.env.EMAIL_USER;

    // Validate required fields
    if (!pincode || !service || !tat || !phoneNumber || !email) {
      console.log("Missing fields validation failed");
      return res.status(400).json({
        message: "All fields are required",
        missing: { pincode: !!pincode, service: !!service, tat: !!tat, phoneNumber: !!phoneNumber, email: !!email }
      });
    }

    // Check if user email is same as admin email
    if (email === adminEmail) {
      console.log("Email validation failed - same as admin");
      return res.status(400).json({
        message: "Provided email cannot be the same as admin email"
      });
    }

    // check duplicate pincode
    const existing = await Service.findOne({ pincode });

    if (existing) {
      console.log("Duplicate pincode validation failed");
      return res.status(400).json({
        message: "Pincode already exists"
      });
    }

    const newService = new Service({
      pincode,
      service,
      tat,
      phoneNumber,
      email
    });

    await newService.save();
    console.log("Service saved successfully");

    // send email to user
    try {
      await transporter.sendMail({
        from: adminEmail,
        to: email,
        subject: "Service Created Successfully",
        html: `
          <h3>Service Added</h3>
          <p>Pincode: ${pincode}</p>
          <p>Courier Service: ${service}</p>
          <p>TAT: ${tat} Day(s)</p>
        `
      });
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the whole operation if email fails
    }

    res.status(201).json({
      message: "Service Created & Email Sent",
      data: newService
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search by PIN starting digits
exports.searchByPin = async (req, res) => {
  try {
    const { pincode } = req.params;

    console.log("Searching for:", pincode);

    const services = await Service.find({
      $expr: {
        $regexMatch: {
          input: { $toString: "$pincode" },
          regex: `^${pincode}`
        }
      }
    });

    console.log("Results found:", services.length);

    res.json(services);

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update phone number
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Service.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};