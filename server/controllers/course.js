import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";

// Get all courses
export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({ courses });
});

// Get single course
export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json({ course });
});

// Fetch lectures for a course
export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });
  const user = await User.findById(req.user._id);

  if (user.role === "admin") return res.json({ lectures });

  if (!user.subscription.includes(req.params.id))
    return res.status(403).json({ message: "You have not subscribed to this course" });

  res.json({ lectures });
});

// Fetch single lecture
export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: "Lecture not found" });

  const user = await User.findById(req.user._id);

  if (user.role === "admin") return res.json({ lecture });

  if (!user.subscription.includes(lecture.course))
    return res.status(403).json({ message: "You have not subscribed to this course" });

  res.json({ lecture });
});

// Get courses of logged-in user
export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: { $in: req.user.subscription } });
  res.json({ courses });
});

// Checkout / create Razorpay order
export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (!course) return res.status(404).json({ message: "Course not found" });

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({ message: "You already have this course" });
  }

  const options = {
    amount: Math.round(course.price * 100), // amount in paise
    currency: "INR",
    receipt: `rcpt_${course._id.toString().slice(-8)}`, // unique and <40 chars
    payment_capture: 1,
  };

  try {
    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Razorpay order creation failed" });
    }

    console.log("Razorpay Order created:", order);

    res.status(201).json({ order, course });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({
      message: "Razorpay order creation failed",
      error: err.message,
    });
  }
});


// Payment verification
export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature)
    return res.status(400).json({ message: "Payment Failed" });

  await Payment.create({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (!user.subscription.includes(course._id)) {
    user.subscription.push(course._id);
    await user.save();

    await Progress.create({
      course: course._id,
      completedLectures: [],
      user: req.user._id,
    });
  }

  res.status(200).json({ message: "Course Purchased Successfully" });
});

// Add lecture progress
export const addProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress) return res.status(404).json({ message: "Progress not found" });

  const { lectureId } = req.query;

  if (!progress.completedLectures.includes(lectureId)) {
    progress.completedLectures.push(lectureId);
    await progress.save();
  }

  res.status(201).json({ message: "Progress recorded" });
});

// Get user's course progress
export const getYourProgress = TryCatch(async (req, res) => {
  const progress = await Progress.find({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress || progress.length === 0)
    return res.status(404).json({ message: "Progress not found" });

  const allLectures = await Lecture.countDocuments({ course: req.query.course });
  const completedLectures = progress[0].completedLectures.length;
  const courseProgressPercentage = allLectures ? (completedLectures * 100) / allLectures : 0;

  res.json({ courseProgressPercentage, completedLectures, allLectures, progress });
});
