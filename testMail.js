const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("EMAIL:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: "Test OTP",
  text: "If you get this, email works",
})
.then(() => console.log("✅ EMAIL SENT"))
.catch(err => console.log("❌ ERROR:", err));