import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

// -------------------- REGISTER USER --------------------
export const register = TryCatch(async (req, res) => {
  try {
    const { email, name, password } = req.body;

    console.log("📩 Register request received:", req.body);

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    user = { name, email, password: hashPassword };

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Create activation token
    const activationToken = jwt.sign(
      { user, otp },
      process.env.ACTIVATION_SECRET, // ✅ must match .env name
      { expiresIn: "5m" }
    );

    console.log("✅ OTP generated:", otp);

    // Send OTP email
    await sendMail(email, "E-Learning OTP Verification", { name, otp });

    res.status(200).json({
      message: "OTP sent to your email",
      activationToken,
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: error.message });
  }
});

// -------------------- VERIFY OTP --------------------
export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  try {
    const decoded = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);

    if (!decoded) return res.status(400).json({ message: "OTP expired" });
    if (decoded.otp !== otp) return res.status(400).json({ message: "Wrong OTP" });

    await User.create({
      name: decoded.user.name,
      email: decoded.user.email,
      password: decoded.user.password,
    });

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Verify error:", error);
    res.status(500).json({ message: error.message });
  }
});

// -------------------- LOGIN USER --------------------
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "No user with this email" });

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.json({
    message: `Welcome back, ${user.name}`,
    token,
    user,
  });
});

// -------------------- GET MY PROFILE --------------------
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ user });
});

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No user with this email" });

  const token = jwt.sign({ email }, process.env.FORGOT_SECRET, { expiresIn: "5m" });

  await sendForgotMail(email, "E-Learning Password Reset", { email, token });

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
  await user.save();

  res.json({ message: "Password reset link sent to your email" });
});

// -------------------- RESET PASSWORD --------------------
export const resetPassword = TryCatch(async (req, res) => {
  const decodedData = jwt.verify(req.query.token, process.env.FORGOT_SECRET);

  const user = await User.findOne({ email: decodedData.email });
  if (!user) return res.status(404).json({ message: "No user with this email" });

  if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
    return res.status(400).json({ message: "Token expired" });
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordExpire = null;
  await user.save();

  res.json({ message: "Password reset successfully" });
});
