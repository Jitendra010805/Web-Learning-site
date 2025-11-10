import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

// -------------------- REGISTER USER --------------------
export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  let user = await User.findOne({ email });
  if (user)
    return res.status(400).json({ message: "User Already exists" });

  const hashPassword = await bcrypt.hash(password, 10);
  user = { name, email, password: hashPassword };

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  // ⚡ Ensure correct env variable name
  const activationSecret = process.env.ACTIVATION_SECRET;
  if (!activationSecret)
    return res.status(500).json({ message: "Activation secret not set" });

  const activationToken = jwt.sign({ user, otp }, activationSecret, {
    expiresIn: "5m",
  });

  const data = { name, otp };

  try {
    await sendMail(email, "E-Learning OTP Verification", data);
  } catch (err) {
    console.error("SendMail failed:", err.message);
  }

  res.status(200).json({
    message: "OTP sent to your email",
    activationToken,
  });
});

// -------------------- VERIFY OTP --------------------
export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  const activationSecret = process.env.ACTIVATION_SECRET;
  if (!activationSecret)
    return res.status(500).json({ message: "Activation secret not set" });

  const verify = jwt.verify(activationToken, activationSecret);

  if (!verify) return res.status(400).json({ message: "OTP Expired" });
  if (verify.otp !== otp) return res.status(400).json({ message: "Wrong OTP" });

  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  });

  res.json({ message: "User Registered" });
});

// -------------------- LOGIN USER --------------------
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "No User with this email" });

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) return res.status(400).json({ message: "Wrong Password" });

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) return res.status(500).json({ message: "JWT secret not set" });

  const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: "15d" });

  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user,
  });
});

// -------------------- GET PROFILE --------------------
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user });
});

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No User with this email" });

  const forgotSecret = process.env.FORGOT_SECRET;
  if (!forgotSecret) return res.status(500).json({ message: "Forgot secret not set" });

  const token = jwt.sign({ email }, forgotSecret, { expiresIn: "5m" });
  const data = { email, token };

  try {
    await sendForgotMail(email, "E-Learning Password Reset", data);
  } catch (err) {
    console.error("SendForgotMail failed:", err.message);
  }

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
  await user.save();

  res.json({ message: "Reset Password Link sent to your email" });
});

// -------------------- RESET PASSWORD --------------------
export const resetPassword = TryCatch(async (req, res) => {
  const forgotSecret = process.env.FORGOT_SECRET;
  if (!forgotSecret) return res.status(500).json({ message: "Forgot secret not set" });

  const decodedData = jwt.verify(req.query.token, forgotSecret);
  const user = await User.findOne({ email: decodedData.email });
  if (!user) return res.status(404).json({ message: "No user with this email" });

  if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
    return res.status(400).json({ message: "Token Expired" });
  }

  const password = await bcrypt.hash(req.body.password, 10);
  user.password = password;
  user.resetPasswordExpire = null;
  await user.save();

  res.json({ message: "Password Reset" });
});
