const nodemailer = require("nodemailer");

const sendEmail = async (email, password) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Admin Login Credentials",
    html: `
      <h2>Admin Account Created</h2>
      <p>Your admin account has been created.</p>

      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>

      <p>Please login to the system.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;