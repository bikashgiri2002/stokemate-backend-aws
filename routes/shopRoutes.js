import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import validator from "validator";
import Shop from "../models/shopModel.js";
import protect from "../middleware/authMiddleware.js";
import {
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendOTPEmail,
} from "../utils/emailService.js";

const router = express.Router();

// Register Shop

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check for existing shop
    const existingShop = await Shop.findOne({ email });
    if (existingShop) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create the shop
    const shop = await Shop.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      otp,
      otpExpires,
      isVerified: false,
    });

    // Send OTP via email
    await sendOTPEmail(email, name, otp);

    return res.status(201).json({
      message: "OTP sent to email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (shop.isVerified) {
      return res.status(400).json({ message: "Shop already verified" });
    }

    if (shop.otp !== otp || Date.now() > shop.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark as verified and remove OTP
    shop.isVerified = true;
    shop.otp = undefined;
    shop.otpExpires = undefined;
    await shop.save();
    await sendConfirmationEmail(shop.email, shop.name);

    res.status(200).json({ message: "Shop verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (shop.isVerified) {
      return res.status(400).json({ message: "Shop already verified" });
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update shop with new OTP
    shop.otp = otp;
    shop.otpExpires = otpExpires;
    await shop.save();

    // Send new OTP via email
    await sendOTPEmail(email, shop.name, otp);

    return res.status(200).json({
      message: "New OTP sent to email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Shop
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const shop = await Shop.findOne({ email });

    if (
      !shop ||
      !(await bcrypt.compare(password, shop.password)) ||
      !shop.isVerified
    ) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: shop._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      shop: { id: shop._id, name: shop.name, email: shop.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get Shop Profile
router.get("/profile", protect, async (req, res) => {
  try {
    const shop = await Shop.findById(req.shop.id).select("-password");
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Request Password Reset (Send Token via Email)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const shop = await Shop.findOne({ email });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    shop.resetPasswordToken = resetTokenHash;
    shop.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 mins
    await shop.save();

    const resetURL = `https://stokematefrontend.onrender.com/reset-password/${resetToken}`;
    await sendPasswordResetEmail(shop.email, shop.name, resetURL);

    res.json({ message: "Reset password link sent to email." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Reset Password using Token
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const shop = await Shop.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!shop) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    shop.password = await bcrypt.hash(newPassword, 10);
    shop.resetPasswordToken = undefined;
    shop.resetPasswordExpires = undefined;

    await shop.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
