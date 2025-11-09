import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

// -------------------- REGISTER USER --------------------
export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "User Already exists" });

  const hashPassword = await bcrypt.hash(password, 10);
  user = { name, email, password: hashPassword };

  const otp = Math.floor(Math.random() * 1000000);

  // ✅ Use Activation_Secret from .env
  const activationToken = jwt.sign(
    { user, otp },
    process.env.Activation_Secret,
    { expiresIn: "5m" }
  );

  await sendMail(email, "E learning", { name, otp });

  res.status(200).json({
    message: "Otp sent to your mail",
    activationToken,
  });
});

// -------------------- VERIFY OTP --------------------
export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  const verify = jwt.verify(activationToken, process.env.Activation_Secret);

  if (!verify) return res.status(400).json({ message: "Otp Expired" });
  if (verify.otp !== otp) return res.status(400).json({ message: "Wrong Otp" });

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

  // ✅ Use JWT_SECRET from .env
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user,
  });
});

// -------------------- GET MY PROFILE --------------------
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user });
});

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No User with this email" });

  // ✅ Use Forgot_Secret from .env
  const token = jwt.sign({ email }, process.env.Forgot_Secret, { expiresIn: "5m" });

  await sendForgotMail("E learning", { email, token });

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
  await user.save();

  res.json({ message: "Reset Password Link is sent to your mail" });
});

// -------------------- RESET PASSWORD --------------------
export const resetPassword = TryCatch(async (req, res) => {
  const decodedData = jwt.verify(req.query.token, process.env.Forgot_Secret);

  const user = await User.findOne({ email: decodedData.email });
  if (!user) return res.status(404).json({ message: "No user with this email" });

  if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
    return res.status(400).json({ message: "Token Expired" });
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordExpire = null;

  await user.save();

  res.json({ message: "Password Reset" });
});
