const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 🔥 SEND OTP FUNCTION (FIXED + DEBUG)
const sendOTP = async (email, otp) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email config missing in .env");
    }

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

    console.log(`[AUTH] Sending OTP to ${email}`);

    await transporter.sendMail({
      from: `"CivicBridge" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "CivicBridge OTP Verification",
      html: `
        <div style="font-family:sans-serif;">
          <h2>Your OTP Code</h2>
          <h1>${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY");
    return true;

  } catch (err) {
    console.error("❌ FULL EMAIL ERROR:", err);
    return false; // ❗ critical
  }
};

// TEMP MEMORY STORAGE
const tempUsers = new Map();

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    console.log("[API] Registration:", req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const userRole = role === "politician" ? "politician" : "citizen";

    tempUsers.set(email, {
      name,
      email,
      password: hashedPassword,
      role: userRole,
      otp,
      otpExpiry,
    });

    // Auto delete after 5 min
    setTimeout(() => {
      tempUsers.delete(email);
      console.log(`[AUTH] Temp user expired: ${email}`);
    }, 5 * 60 * 1000);

    const emailSent = await sendOTP(email, otp);

    if (!emailSent) {
      tempUsers.delete(email);
      return res.status(500).json({
        message: "Failed to send OTP email. Check your email configuration.",
      });
    }

    res.status(201).json({
      message: "OTP sent to your email",
      email,
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = tempUsers.get(email);

    if (!user) {
      return res.status(400).json({ message: "Session expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      tempUsers.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    await User.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isVerified: true,
    });

    tempUsers.delete(email);

    res.json({
      message: "OTP verified successfully. Please login.",
    });

  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};